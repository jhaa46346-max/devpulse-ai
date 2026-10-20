import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { runStaticSecurityAudit } from "@/lib/security";

// GET /api/security/scan - List all security findings from DB
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get("severity");
    const projectId = searchParams.get("projectId");

    const whereClause: Record<string, unknown> = {};

    if (severity && severity !== "all") {
      whereClause.severity = severity;
    }

    if (projectId) {
      whereClause.projectId = projectId;
    }

    const [findings, totalProjects, allActive] = await Promise.all([
      db.securityFinding.findMany({
        where: whereClause,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              language: true,
            },
          },
        },
        orderBy: [{ severity: "asc" }, { createdAt: "desc" }],
      }),
      db.project.count(),
      db.securityFinding.findMany({
        where: { status: "active" },
        select: { severity: true },
      }),
    ]);

    // Calculate system-wide transparent security score
    const critical = allActive.filter((f) => f.severity === "critical").length;
    const high = allActive.filter((f) => f.severity === "high").length;
    const medium = allActive.filter((f) => f.severity === "medium").length;
    const low = allActive.filter((f) => f.severity === "low").length;

    let overallSecurityScore = 100;
    overallSecurityScore -= critical * 30;
    overallSecurityScore -= high * 15;
    overallSecurityScore -= medium * 7;
    overallSecurityScore -= low * 2;
    overallSecurityScore = Math.max(0, Math.min(100, overallSecurityScore));

    return NextResponse.json({
      success: true,
      data: {
        score: overallSecurityScore,
        counts: {
          critical,
          high,
          medium,
          low,
          total: allActive.length,
        },
        findings: findings.map((f) => ({
          id: f.id,
          projectId: f.projectId,
          projectName: f.project.name,
          language: f.project.language,
          severity: f.severity,
          category: f.category,
          cwe: f.cwe,
          title: f.title,
          description: f.description,
          location: f.location,
          risk: f.risk,
          remediation: f.remediation,
          status: f.status,
          createdAt: f.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("Security scan fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve security telemetry.",
      },
      { status: 500 }
    );
  }
}

// POST /api/security/scan - Trigger static security scan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, code, fileName } = body;

    // Mode A: Scan a single code snippet
    if (code && typeof code === "string") {
      const auditResult = runStaticSecurityAudit(code, fileName || "source");
      return NextResponse.json({
        success: true,
        data: auditResult,
      });
    }

    // Mode B: Scan all files inside a specific project
    if (projectId && typeof projectId === "string") {
      const project = await db.project.findUnique({
        where: { id: projectId },
        include: { files: true },
      });

      if (!project) {
        return NextResponse.json(
          { success: false, error: "Project not found" },
          { status: 404 }
        );
      }

      let aggregatedFindings = [];

      for (const file of project.files) {
        const fileAudit = runStaticSecurityAudit(file.content, file.path);
        aggregatedFindings.push(...fileAudit.findings);
      }

      // Persist newly discovered findings
      if (aggregatedFindings.length > 0) {
        await db.securityFinding.createMany({
          data: aggregatedFindings.map((f) => ({
            projectId,
            severity: f.severity,
            category: f.category,
            cwe: f.cwe,
            title: f.title,
            description: f.description,
            location: f.location,
            risk: f.risk,
            remediation: f.remediation,
            status: "active",
          })),
        });
      }

      // Re-calculate security score
      const activeFindings = await db.securityFinding.findMany({
        where: { projectId, status: "active" },
        select: { severity: true },
      });

      let projectScore = 100;
      projectScore -= activeFindings.filter((f) => f.severity === "critical").length * 30;
      projectScore -= activeFindings.filter((f) => f.severity === "high").length * 15;
      projectScore -= activeFindings.filter((f) => f.severity === "medium").length * 7;
      projectScore = Math.max(0, Math.min(100, projectScore));

      await db.project.update({
        where: { id: projectId },
        data: { securityScore: projectScore },
      });

      return NextResponse.json({
        success: true,
        message: `Audited ${project.files.length} file(s). Found ${aggregatedFindings.length} issue(s).`,
        securityScore: projectScore,
        findingsCount: aggregatedFindings.length,
      });
    }

    return NextResponse.json(
      { success: false, error: "Provide either code or a projectId to audit." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Security audit execution error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to execute security audit." },
      { status: 500 }
    );
  }
}
