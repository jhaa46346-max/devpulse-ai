import { NextRequest, NextResponse } from "next/server";
import { analyzeCode } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language, fileName, projectId } = body;

    if (!code || typeof code !== "string" || code.trim().length < 5) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide valid source code to analyze (minimum 5 characters).",
        },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser(request);

    const result = await analyzeCode({
      code: code.trim(),
      language: language || "typescript",
      fileName: fileName || "snippet.ts",
      projectId: projectId || undefined,
      userId: currentUser?.id,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Code analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Code analysis failed. Please verify syntax and try again.",
      },
      { status: 500 }
    );
  }
}
