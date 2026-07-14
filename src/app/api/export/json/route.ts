import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") || "full";

  try {
    const data: Record<string, unknown> = {};

    if (type === "full" || type === "episodes") {
      data.episodes = await prisma.episode.findMany({
        orderBy: [{ seasonNumber: "asc" }, { episodeNumber: "asc" }],
        include: { claims: true, citations: { include: { source: true } } },
      });
    }

    if (type === "full" || type === "entries") {
      data.entries = await prisma.encyclopediaEntry.findMany({
        orderBy: { title: "asc" },
        include: { claims: true, citations: { include: { source: true } } },
      });
    }

    if (type === "full" || type === "people") {
      data.people = await prisma.person.findMany({ orderBy: { name: "asc" } });
    }

    if (type === "full" || type === "locations") {
      data.locations = await prisma.location.findMany({ orderBy: { name: "asc" } });
    }

    if (type === "full" || type === "theories") {
      data.theories = await prisma.theory.findMany({
        orderBy: { title: "asc" },
        include: { claims: true },
      });
    }

    if (type === "full" || type === "artifacts") {
      data.artifacts = await prisma.artifact.findMany({ orderBy: { name: "asc" } });
    }

    if (type === "full" || type === "civilizations") {
      data.civilizations = await prisma.civilization.findMany({ orderBy: { name: "asc" } });
    }

    if (type === "full" || type === "deities") {
      data.deities = await prisma.deity.findMany({ orderBy: { name: "asc" } });
    }

    if (type === "full" || type === "ancientTexts") {
      data.ancientTexts = await prisma.ancientText.findMany({ orderBy: { title: "asc" } });
    }

    if (type === "full" || type === "sources") {
      data.sources = await prisma.source.findMany({ orderBy: { title: "asc" } });
    }

    if (type === "full" || type === "tags") {
      data.tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
    }

    const json = JSON.stringify(data, null, 2);
    const filename = type === "full" ? "ancient-aliens-encyclopedia-full.json" : `ancient-aliens-${type}.json`;

    return new NextResponse(json, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
