import { NextRequest, NextResponse } from "next/server";
import { validateImportData, importData } from "@/lib/import/json-importer";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let data: unknown;

    if (contentType.includes("application/json")) {
      data = await request.json();
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }
      const text = await file.text();
      try {
        data = JSON.parse(text);
      } catch {
        return NextResponse.json({ error: "Invalid JSON file" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Content-Type must be application/json or multipart/form-data" }, { status: 400 });
    }

    // Validate
    const validation = await validateImportData(data);
    if (!validation.valid) {
      return NextResponse.json({
        error: "Validation failed",
        issues: validation.errors,
      }, { status: 422 });
    }

    // Check if this is a dry-run (validate only)
    const url = new URL(request.url);
    const dryRun = url.searchParams.get("dryRun") === "true";

    if (dryRun) {
      const preview = validation.preview!;
      return NextResponse.json({
        valid: true,
        preview: {
          episodes: preview.episodes?.length || 0,
          entries: preview.entries?.length || 0,
          people: preview.people?.length || 0,
          locations: preview.locations?.length || 0,
          theories: preview.theories?.length || 0,
          artifacts: preview.artifacts?.length || 0,
          civilizations: preview.civilizations?.length || 0,
          deities: preview.deities?.length || 0,
          ancientTexts: preview.ancientTexts?.length || 0,
          sources: preview.sources?.length || 0,
        },
      });
    }

    // Import
    const result = await importData(validation.preview!);

    return NextResponse.json({
      success: result.success,
      created: result.created,
      skipped: result.skipped,
      errors: result.errors,
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Import failed", details: (error as Error).message },
      { status: 500 }
    );
  }
}
