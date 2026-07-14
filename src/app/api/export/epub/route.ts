import { NextRequest, NextResponse } from "next/server";
import { loadBookContent } from "@/lib/export/content-loader";
import { HtmlToEpubEngine } from "@/lib/export/epub-engine";
import { ExportOptions } from "@/lib/export/types";

export async function GET(request: NextRequest) {
  const editionId = request.nextUrl.searchParams.get("editionId");

  if (!editionId) {
    return NextResponse.json({ error: "editionId is required" }, { status: 400 });
  }

  try {
    const content = await loadBookContent(editionId);

    if (!content) {
      return NextResponse.json({ error: "Edition not found" }, { status: 404 });
    }

    const engine = new HtmlToEpubEngine();

    // Validate first
    const issues = engine.validate(content);
    const errors = issues.filter(i => i.severity === "error");
    if (errors.length > 0) {
      return NextResponse.json({
        error: "Validation failed",
        issues: errors.map(e => e.message),
      }, { status: 422 });
    }

    const options: ExportOptions = {
      format: "EPUB",
      pageSize: content.edition.pageSize,
      marginPreset: content.edition.marginPreset,
      mirroredMargins: content.edition.mirroredMargins,
      bleedMm: content.edition.bleedMm,
      includeBookmarks: true,
      optimizeFor: "web",
    };

    const result = await engine.generate(content, options);

    return new NextResponse(new Uint8Array(result.buffer), {
      status: 200,
      headers: {
        "Content-Type": result.mimeType,
        "Content-Disposition": `attachment; filename="${result.filename}"`,
        "Content-Length": result.buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("EPUB export error:", error);
    return NextResponse.json(
      { error: "EPUB generation failed", details: (error as Error).message },
      { status: 500 }
    );
  }
}
