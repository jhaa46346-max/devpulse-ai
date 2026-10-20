import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [
      totalProjects,
      totalIssues,
      totalVulnerabilities,
      criticalIssuesCount,
      criticalFindingsCount,
      healthAggregate,
      securityAggregate,
      recentProjects,
      recentAnalyses,
    ] = await Promise.all([
      db.project.count(),
      db.issue.count({ where: { status: "open" } }),
      db.securityFinding.count({ where: { status: "active" } }),
      db.issue.count({ where: { severity: "critical", status: "open" } }),
      db.securityFinding.count({ where: { severity: "critical", status: "active" } }),
      db.project.aggregate({ _avg: { healthScore: true } }),
      db.project.aggregate({ _avg: { securityScore: true } }),
      db.project.findMany({
        take: 4,
        orderBy: { updatedAt: "desc" },
        include: {
          _count: {
            select: {
              files: true,
              issues: { where: { status: "open" } },
              securityFindings: { where: { status: "active" } },
            },
          },
        },
      }),
      db.analysis.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              language: true,
            },
          },
          securityFindings: {
            select: {
              id: true,
              severity: true,
              title: true,
              location: true,
            },
            take: 1,
          },
          issues: {
            select: {
              id: true,
              severity: true,
              title: true,
              location: true,
            },
            take: 1,
          },
        },
      }),
    ]);

    const averageHealth = Math.round(healthAggregate._avg.healthScore ?? 100);
    const averageSecurity = Math.round(securityAggregate._avg.securityScore ?? 100);
    const criticalTotal = criticalIssuesCount + criticalFindingsCount;

    const formattedRecentProjects = recentProjects.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      language: p.language,
      healthScore: p.healthScore,
      securityScore: p.securityScore,
      fileCount: p._count.files,
      issuesCount: p._count.issues,
      vulnerabilitiesCount: p._count.securityFindings,
      updatedAt: p.updatedAt.toISOString(),
    }));

    const formattedRecentAnalyses = recentAnalyses.map((a) => {
      // Determine primary headline finding
      const topFinding = a.securityFindings[0] || a.issues[0];
      const severity = topFinding?.severity || (a.criticalIssues > 0 ? "critical" : "low");
      const title = topFinding?.title || a.summary || "Codebase Scan Complete";
      const location = topFinding?.location || `${a.project.language} Source`;

      return {
        id: a.id,
        projectId: a.project.id,
        project: a.project.name,
        language: a.project.language,
        status: a.status,
        findings: title,
        file: location,
        severity: severity,
        duration: `${(a.durationMs / 1000).toFixed(1)}s`,
        timestamp: a.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalProjects,
          totalIssues,
          totalVulnerabilities,
          criticalIssues: criticalTotal,
          overallHealth: averageHealth,
          overallSecurity: averageSecurity,
        },
        recentProjects: formattedRecentProjects,
        recentAnalyses: formattedRecentAnalyses,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard telemetry:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to calculate dashboard telemetry from database.",
      },
      { status: 500 }
    );
  }
}
