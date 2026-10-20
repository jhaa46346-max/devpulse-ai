import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const zipPath = path.resolve(process.cwd(), "devpulse-ai-source.zip");

    if (!fs.existsSync(zipPath)) {
      return NextResponse.json(
        { error: "Source archive not found. Please regenerate." },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(zipPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="devpulse-ai-source.zip"',
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Failed to download zip file." }, { status: 500 });
  }
}
