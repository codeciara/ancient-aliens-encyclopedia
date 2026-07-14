// JSON Import - validates and imports structured content into the database

import { prisma } from "@/lib/db";
import { generateSlug } from "@/lib/utils/slug";

export interface ImportResult {
  success: boolean;
  created: number;
  skipped: number;
  errors: string[];
}

export interface EpisodeImport {
  title: string;
  seasonNumber: number;
  episodeNumber: number;
  originalAirDate?: string;
  summary?: string;
  centralQuestion?: string;
  mainSubjects?: string;
  conventionalExplanations?: string;
}

export interface EntryImport {
  title: string;
  alternateNames?: string;
  category?: string;
  briefOverview?: string;
  historicalBackground?: string;
  ancientAstronautView?: string;
  mainstreamView?: string;
  evidenceCited?: string;
  unresolvedQuestions?: string;
}

export interface PersonImport {
  name: string;
  biography?: string;
  mainTheories?: string;
  publishedWorks?: string;
  associatedTopics?: string;
  supportAndCriticism?: string;
}

export interface LocationImport {
  name: string;
  country?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  civilization?: string;
  historicalPeriod?: string;
  knownBuilders?: string;
  description?: string;
  archaeologicalConsensus?: string;
  ancientAstronautView?: string;
  unresolvedQuestions?: string;
}

export interface TheoryImport {
  title: string;
  overview?: string;
  historicalContext?: string;
  keyArguments?: string;
  supportingEvidence?: string;
  counterArguments?: string;
}

export interface FullImportData {
  episodes?: EpisodeImport[];
  entries?: EntryImport[];
  people?: PersonImport[];
  locations?: LocationImport[];
  theories?: TheoryImport[];
  artifacts?: Array<{ name: string; civilization?: string; historicalPeriod?: string; description?: string; archaeologicalConsensus?: string; ancientAstronautView?: string }>;
  civilizations?: Array<{ name: string; timeRange?: string; region?: string; description?: string; notableAchievements?: string }>;
  deities?: Array<{ name: string; mythology?: string; description?: string; ancientAstronautView?: string }>;
  ancientTexts?: Array<{ title: string; civilization?: string; approximateDate?: string; description?: string; relevantPassages?: string; ancientAstronautView?: string; scholarlyConsensus?: string }>;
  sources?: Array<{ title: string; author?: string; publicationYear?: number; publisher?: string; url?: string; isbn?: string; sourceType?: string }>;
}

export async function validateImportData(data: unknown): Promise<{ valid: boolean; errors: string[]; preview: FullImportData | null }> {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    errors.push("Import data must be a JSON object");
    return { valid: false, errors, preview: null };
  }

  const d = data as Record<string, unknown>;

  // Validate episodes
  if (d.episodes && !Array.isArray(d.episodes)) {
    errors.push("'episodes' must be an array");
  } else if (d.episodes) {
    for (let i = 0; i < (d.episodes as unknown[]).length; i++) {
      const ep = (d.episodes as Record<string, unknown>[])[i];
      if (!ep.title) errors.push(`episodes[${i}]: missing title`);
      if (!ep.seasonNumber) errors.push(`episodes[${i}]: missing seasonNumber`);
      if (!ep.episodeNumber) errors.push(`episodes[${i}]: missing episodeNumber`);
    }
  }

  // Validate entries
  if (d.entries && !Array.isArray(d.entries)) {
    errors.push("'entries' must be an array");
  } else if (d.entries) {
    for (let i = 0; i < (d.entries as unknown[]).length; i++) {
      const entry = (d.entries as Record<string, unknown>[])[i];
      if (!entry.title) errors.push(`entries[${i}]: missing title`);
    }
  }

  // Validate people
  if (d.people && !Array.isArray(d.people)) {
    errors.push("'people' must be an array");
  } else if (d.people) {
    for (let i = 0; i < (d.people as unknown[]).length; i++) {
      const p = (d.people as Record<string, unknown>[])[i];
      if (!p.name) errors.push(`people[${i}]: missing name`);
    }
  }

  // Validate locations
  if (d.locations && !Array.isArray(d.locations)) {
    errors.push("'locations' must be an array");
  } else if (d.locations) {
    for (let i = 0; i < (d.locations as unknown[]).length; i++) {
      const loc = (d.locations as Record<string, unknown>[])[i];
      if (!loc.name) errors.push(`locations[${i}]: missing name`);
    }
  }

  // Validate theories
  if (d.theories && !Array.isArray(d.theories)) {
    errors.push("'theories' must be an array");
  } else if (d.theories) {
    for (let i = 0; i < (d.theories as unknown[]).length; i++) {
      const t = (d.theories as Record<string, unknown>[])[i];
      if (!t.title) errors.push(`theories[${i}]: missing title`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    preview: errors.length === 0 ? (d as FullImportData) : null,
  };
}

async function ensureUniqueSlug(table: string, slug: string): Promise<string> {
  let finalSlug = slug;
  let exists = true;
  let attempts = 0;

  while (exists && attempts < 10) {
    const record = await (prisma as unknown as Record<string, { findUnique: (args: Record<string, unknown>) => Promise<unknown> }>)[table].findUnique({ where: { slug: finalSlug } });
    if (!record) {
      exists = false;
    } else {
      attempts++;
      finalSlug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }
  }
  return finalSlug;
}

export async function importData(data: FullImportData): Promise<ImportResult> {
  let created = 0;
  let skipped = 0;
  const errors: string[] = [];

  // Import episodes
  if (data.episodes) {
    for (const ep of data.episodes) {
      try {
        const slug = await ensureUniqueSlug("episode", generateSlug(`s${ep.seasonNumber}e${ep.episodeNumber}-${ep.title}`));
        await prisma.episode.create({
          data: {
            slug,
            title: ep.title,
            seasonNumber: ep.seasonNumber,
            episodeNumber: ep.episodeNumber,
            originalAirDate: ep.originalAirDate || null,
            summary: ep.summary || null,
            centralQuestion: ep.centralQuestion || null,
            mainSubjects: ep.mainSubjects || null,
            conventionalExplanations: ep.conventionalExplanations || null,
            status: "DRAFT",
          },
        });
        created++;
      } catch (e) {
        const msg = (e as Error).message;
        if (msg.includes("Unique constraint")) { skipped++; }
        else { errors.push(`Episode "${ep.title}": ${msg}`); }
      }
    }
  }

  // Import entries
  if (data.entries) {
    for (const entry of data.entries) {
      try {
        const slug = await ensureUniqueSlug("encyclopediaEntry", generateSlug(entry.title));
        await prisma.encyclopediaEntry.create({
          data: {
            slug, title: entry.title,
            alternateNames: entry.alternateNames || null,
            category: entry.category || null,
            briefOverview: entry.briefOverview || null,
            historicalBackground: entry.historicalBackground || null,
            ancientAstronautView: entry.ancientAstronautView || null,
            mainstreamView: entry.mainstreamView || null,
            evidenceCited: entry.evidenceCited || null,
            unresolvedQuestions: entry.unresolvedQuestions || null,
            status: "DRAFT",
          },
        });
        created++;
      } catch (e) {
        const msg = (e as Error).message;
        if (msg.includes("Unique constraint")) { skipped++; }
        else { errors.push(`Entry "${entry.title}": ${msg}`); }
      }
    }
  }

  // Import people
  if (data.people) {
    for (const person of data.people) {
      try {
        const slug = await ensureUniqueSlug("person", generateSlug(person.name));
        await prisma.person.create({
          data: {
            slug, name: person.name,
            biography: person.biography || null,
            mainTheories: person.mainTheories || null,
            publishedWorks: person.publishedWorks || null,
            associatedTopics: person.associatedTopics || null,
            supportAndCriticism: person.supportAndCriticism || null,
            status: "DRAFT",
          },
        });
        created++;
      } catch (e) {
        const msg = (e as Error).message;
        if (msg.includes("Unique constraint")) { skipped++; }
        else { errors.push(`Person "${person.name}": ${msg}`); }
      }
    }
  }

  // Import locations
  if (data.locations) {
    for (const loc of data.locations) {
      try {
        const slug = await ensureUniqueSlug("location", generateSlug(loc.name));
        await prisma.location.create({
          data: {
            slug, name: loc.name,
            country: loc.country || null, region: loc.region || null,
            latitude: loc.latitude ?? null, longitude: loc.longitude ?? null,
            civilization: loc.civilization || null, historicalPeriod: loc.historicalPeriod || null,
            knownBuilders: loc.knownBuilders || null, description: loc.description || null,
            archaeologicalConsensus: loc.archaeologicalConsensus || null,
            ancientAstronautView: loc.ancientAstronautView || null,
            unresolvedQuestions: loc.unresolvedQuestions || null,
            status: "DRAFT",
          },
        });
        created++;
      } catch (e) {
        const msg = (e as Error).message;
        if (msg.includes("Unique constraint")) { skipped++; }
        else { errors.push(`Location "${loc.name}": ${msg}`); }
      }
    }
  }

  // Import theories
  if (data.theories) {
    for (const theory of data.theories) {
      try {
        const slug = await ensureUniqueSlug("theory", generateSlug(theory.title));
        await prisma.theory.create({
          data: {
            slug, title: theory.title,
            overview: theory.overview || null,
            historicalContext: theory.historicalContext || null,
            keyArguments: theory.keyArguments || null,
            supportingEvidence: theory.supportingEvidence || null,
            counterArguments: theory.counterArguments || null,
            status: "DRAFT",
          },
        });
        created++;
      } catch (e) {
        const msg = (e as Error).message;
        if (msg.includes("Unique constraint")) { skipped++; }
        else { errors.push(`Theory "${theory.title}": ${msg}`); }
      }
    }
  }

  // Import artifacts
  if (data.artifacts) {
    for (const a of data.artifacts) {
      try {
        const slug = await ensureUniqueSlug("artifact", generateSlug(a.name));
        await prisma.artifact.create({
          data: { slug, name: a.name, civilization: a.civilization || null, historicalPeriod: a.historicalPeriod || null, description: a.description || null, archaeologicalConsensus: a.archaeologicalConsensus || null, ancientAstronautView: a.ancientAstronautView || null, status: "DRAFT" },
        });
        created++;
      } catch (e) {
        const msg = (e as Error).message;
        if (msg.includes("Unique constraint")) { skipped++; }
        else { errors.push(`Artifact "${a.name}": ${msg}`); }
      }
    }
  }

  // Import civilizations
  if (data.civilizations) {
    for (const c of data.civilizations) {
      try {
        const slug = await ensureUniqueSlug("civilization", generateSlug(c.name));
        await prisma.civilization.create({
          data: { slug, name: c.name, timeRange: c.timeRange || null, region: c.region || null, description: c.description || null, notableAchievements: c.notableAchievements || null, status: "DRAFT" },
        });
        created++;
      } catch (e) {
        const msg = (e as Error).message;
        if (msg.includes("Unique constraint")) { skipped++; }
        else { errors.push(`Civilization "${c.name}": ${msg}`); }
      }
    }
  }

  // Import deities
  if (data.deities) {
    for (const d of data.deities) {
      try {
        const slug = await ensureUniqueSlug("deity", generateSlug(d.name));
        await prisma.deity.create({
          data: { slug, name: d.name, mythology: d.mythology || null, description: d.description || null, ancientAstronautView: d.ancientAstronautView || null, status: "DRAFT" },
        });
        created++;
      } catch (e) {
        const msg = (e as Error).message;
        if (msg.includes("Unique constraint")) { skipped++; }
        else { errors.push(`Deity "${d.name}": ${msg}`); }
      }
    }
  }

  // Import ancient texts
  if (data.ancientTexts) {
    for (const t of data.ancientTexts) {
      try {
        const slug = await ensureUniqueSlug("ancientText", generateSlug(t.title));
        await prisma.ancientText.create({
          data: { slug, title: t.title, civilization: t.civilization || null, approximateDate: t.approximateDate || null, description: t.description || null, relevantPassages: t.relevantPassages || null, ancientAstronautView: t.ancientAstronautView || null, scholarlyConsensus: t.scholarlyConsensus || null, status: "DRAFT" },
        });
        created++;
      } catch (e) {
        const msg = (e as Error).message;
        if (msg.includes("Unique constraint")) { skipped++; }
        else { errors.push(`Ancient Text "${t.title}": ${msg}`); }
      }
    }
  }

  // Import sources
  if (data.sources) {
    for (const s of data.sources) {
      try {
        await prisma.source.create({
          data: { title: s.title, author: s.author || null, publicationYear: s.publicationYear ?? null, publisher: s.publisher || null, url: s.url || null, isbn: s.isbn || null, sourceType: s.sourceType || null },
        });
        created++;
      } catch (e) {
        errors.push(`Source "${s.title}": ${(e as Error).message}`);
      }
    }
  }

  return { success: errors.length === 0, created, skipped, errors };
}
