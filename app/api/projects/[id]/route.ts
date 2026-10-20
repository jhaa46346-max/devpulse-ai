import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/projects/[id] - Fetch single project with full details
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const project = await db.project.findUnique({
      where: { id },
      include: {
        files: {
          select: {
            id: true,
            path: true,
            name: true,
            language: true,
            sizeBytes: true,
            createdAt: true,
          },
          orderBy: { path: "asc" },
        },
        issues: {
          orderBy: { createdAt: "desc" },
        },
        securityFindings: {
          orderBy: { createdAt: "desc" },
        },
        analyses: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
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

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: "Project not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        name: project.name,
        description: project.description ?? "",
        language: project.language,
        repositoryUrl: project.repositoryUrl ?? "",
        healthScore: project.healthScore,
        securityScore: project.securityScore,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        files: project.files,
        issues: project.issues,
        securityFindings: project.securityFindings,
        analyses: project.analyses,
        counts: project._count,
      },
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve project details.",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[id] - Update or rename a project
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name, description, language, repositoryUrl } = body;

    const existing = await db.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Project not found.",
        },
        { status: 404 }
      );
    }

    const dataToUpdate: Record<string, unknown> = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 2) {
        return NextResponse.json(
          {
            success: false,
            error: "Project name must be at least 2 characters.",
          },
          { status: 400 }
        );
      }

      // Check if renamed name conflicts with another project
      const duplicate = await db.project.findFirst({
        where: {
          name: name.trim(),
          NOT: { id },
        },
      });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            error: `Another project named '${name.trim()}' already exists.`,
          },
          { status: 409 }
        );
      }

      dataToUpdate.name = name.trim();
    }

    if (description !== undefined) {
      dataToUpdate.description = description ? description.trim() : null;
    }

    if (language !== undefined && typeof language === "string") {
      dataToUpdate.language = language.trim();
    }

    if (repositoryUrl !== undefined) {
      dataToUpdate.repositoryUrl = repositoryUrl ? repositoryUrl.trim() : null;
    }

    const updated = await db.project.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      project: updated,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update project.",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete project (cascades to files, issues, findings)
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const existing = await db.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Project not found.",
        },
        { status: 404 }
      );
    }

    await db.project.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Project '${existing.name}' and all associated files/analyses deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete project.",
      },
      { status: 500 }
    );
  }
}
