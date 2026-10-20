import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

// GET /api/projects - List all projects with search and language filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const language = searchParams.get("language")?.trim() || "";

    const whereClause: Record<string, unknown> = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (language && language !== "all") {
      whereClause.language = {
        equals: language,
      };
    }

    const projects = await db.project.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            files: true,
            issues: true,
            securityFindings: true,
            analyses: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const formattedProjects = projects.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      language: p.language,
      repositoryUrl: p.repositoryUrl ?? "",
      healthScore: p.healthScore,
      securityScore: p.securityScore,
      fileCount: p._count.files,
      issuesCount: p._count.issues,
      vulnerabilitiesCount: p._count.securityFindings,
      analysisCount: p._count.analyses,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      count: formattedProjects.length,
      projects: formattedProjects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch projects. Please try again.",
      },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project with validation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, language, repositoryUrl } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Project name is required and must be at least 2 characters.",
        },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error: "Project name must be under 100 characters.",
        },
        { status: 400 }
      );
    }

    // Check for duplicate name
    const existing = await db.project.findFirst({
      where: { name: name.trim() },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `A project named '${name.trim()}' already exists. Please choose a unique name.`,
        },
        { status: 409 }
      );
    }

    // Extract authenticated user if available
    const currentUser = await getCurrentUser(request);

    // Create the project
    const newProject = await db.project.create({
      data: {
        name: name.trim(),
        description: description ? description.trim() : null,
        language: language && typeof language === "string" ? language.trim() : "TypeScript",
        repositoryUrl: repositoryUrl && typeof repositoryUrl === "string" ? repositoryUrl.trim() : null,
        healthScore: 100, // Clean initial health score
        securityScore: 100,
        userId: currentUser?.id ?? null,
      },
      include: {
        _count: {
          select: {
            files: true,
            issues: true,
            securityFindings: true,
            analyses: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        project: {
          id: newProject.id,
          name: newProject.name,
          description: newProject.description ?? "",
          language: newProject.language,
          repositoryUrl: newProject.repositoryUrl ?? "",
          healthScore: newProject.healthScore,
          securityScore: newProject.securityScore,
          fileCount: newProject._count.files,
          issuesCount: newProject._count.issues,
          vulnerabilitiesCount: newProject._count.securityFindings,
          createdAt: newProject.createdAt.toISOString(),
          updatedAt: newProject.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create project. Please verify inputs and try again.",
      },
      { status: 500 }
    );
  }
}
