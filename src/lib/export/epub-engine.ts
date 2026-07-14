import { readFileSync } from "fs";
import path from "path";
import { BookContent, ExportOptions, ExportResult, ExportEngine, ValidationIssue, ChapterItemContent } from "./types";

// Dynamic import for the epub library (ESM module)
async function getEpubLib() {
  const { EPub } = await import("@lesjoursfr/html-to-epub");
  return EPub;
}

const EVIDENCE_TYPE_LABELS: Record<string, string> = {
  HISTORICAL_RECORD: "Historical Record",
  ARCHAEOLOGICAL_EVIDENCE: "Archaeological Evidence",
  ANCIENT_TEXT: "Ancient Text",
  ORAL_TRADITION: "Oral Tradition",
  SCIENTIFIC_INTERPRETATION: "Scientific Interpretation",
  SPECULATIVE_THEORY: "Speculative Theory",
  DISPUTED_CLAIM: "Disputed Claim",
  UNRESOLVED_MYSTERY: "Unresolved Mystery",
};

const EVIDENCE_LEVEL_LABELS: Record<number, string> = {
  1: "Primarily speculative",
  2: "Disputed interpretation",
  3: "Genuine unanswered questions",
  4: "Meaningful evidence",
  5: "Mainstream established",
};

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderField(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `<div class="field-section"><p class="field-label">${esc(label)}</p><p class="field-content">${esc(value)}</p></div>`;
}

function renderClaims(claims: Array<Record<string, unknown>>): string {
  if (!claims || claims.length === 0) return "";
  return `<div class="claims-section"><p class="field-label">Claims &amp; Evidence</p>${claims.map(c => `
    <div class="claim">
      <p class="claim-statement">${esc(c.statement as string)}</p>
      <p><span class="evidence-label">${EVIDENCE_TYPE_LABELS[c.evidenceType as string] || c.evidenceType}</span>
      <span class="evidence-level level-${c.contextLevel}">Level ${c.contextLevel}: ${EVIDENCE_LEVEL_LABELS[c.contextLevel as number] || ""}</span></p>
      ${c.explanation ? `<p><em>${esc(c.explanation as string)}</em></p>` : ""}
    </div>`).join("")}</div>`;
}

function renderItemHtml(item: ChapterItemContent): string {
  const d = item.data;
  switch (item.type) {
    case "episode":
      return `<div class="episode-entry">
        <p class="episode-meta"><span class="episode-number">S${String(d.seasonNumber).padStart(2, "0")}E${String(d.episodeNumber).padStart(2, "0")}</span>${d.originalAirDate ? ` — ${d.originalAirDate}` : ""}</p>
        <h3>${esc(d.title as string)}</h3>
        ${d.centralQuestion ? `<div class="central-question"><p>${esc(d.centralQuestion as string)}</p></div>` : ""}
        ${renderField("Summary", d.summary as string)}
        ${renderField("Main Subjects", d.mainSubjects as string)}
        ${renderField("Conventional Explanations", d.conventionalExplanations as string)}
        ${renderClaims((d.claims as Array<Record<string, unknown>>) || [])}
      </div>`;

    case "entry":
      return `<div class="encyclopedia-entry">
        <h3>${esc(d.title as string)}</h3>
        ${d.alternateNames ? `<p class="alternate-names">Also known as: ${esc(d.alternateNames as string)}</p>` : ""}
        ${renderField("Overview", d.briefOverview as string)}
        ${renderField("Historical Background", d.historicalBackground as string)}
        ${renderField("Ancient Astronaut Interpretation", d.ancientAstronautView as string)}
        ${renderField("Mainstream Scholarly Interpretation", d.mainstreamView as string)}
        ${renderField("Evidence Commonly Cited", d.evidenceCited as string)}
        ${renderField("Unresolved Questions", d.unresolvedQuestions as string)}
        ${renderClaims((d.claims as Array<Record<string, unknown>>) || [])}
      </div>`;

    case "person":
      return `<div class="person-entry">
        <h3>${esc(d.name as string)}</h3>
        ${renderField("Biography", d.biography as string)}
        ${renderField("Main Theories", d.mainTheories as string)}
        ${renderField("Published Works", d.publishedWorks as string)}
        ${renderField("Support & Criticism", d.supportAndCriticism as string)}
      </div>`;

    case "location":
      return `<div class="location-entry">
        <h3>${esc(d.name as string)}</h3>
        <p class="location-meta">${[d.country, d.region, d.historicalPeriod].filter(Boolean).map(v => esc(v as string)).join(" — ")}</p>
        ${renderField("Description", d.description as string)}
        ${renderField("Archaeological Consensus", d.archaeologicalConsensus as string)}
        ${renderField("Ancient Astronaut Interpretation", d.ancientAstronautView as string)}
        ${renderField("Unresolved Questions", d.unresolvedQuestions as string)}
      </div>`;

    case "theory":
      return `<div class="theory-entry">
        <h3>${esc(d.title as string)}</h3>
        ${renderField("Overview", d.overview as string)}
        ${renderField("Historical Context", d.historicalContext as string)}
        ${renderField("Key Arguments", d.keyArguments as string)}
        ${renderField("Supporting Evidence", d.supportingEvidence as string)}
        ${renderField("Counter Arguments", d.counterArguments as string)}
      </div>`;

    default: {
      const title = (d.title || d.name || "Untitled") as string;
      return `<div><h3>${esc(title)}</h3>${d.description ? `<p>${esc(d.description as string)}</p>` : ""}</div>`;
    }
  }
}

export class HtmlToEpubEngine implements ExportEngine {
  async generate(content: BookContent, _options: ExportOptions): Promise<ExportResult> {
    const EPub = await getEpubLib();

    // Load EPUB CSS
    let css = "";
    try {
      const cssPath = path.join(process.cwd(), "src", "lib", "export", "epub-styles.css");
      css = readFileSync(cssPath, "utf-8");
    } catch {
      css = "body { font-family: serif; line-height: 1.6; }";
    }

    // Build chapters for the EPUB
    const epubChapters: Array<{ title: string; data: string }> = [];

    // Front matter
    for (const fm of content.frontMatter) {
      if (!fm.isIncluded) continue;

      switch (fm.type) {
        case "TITLE_PAGE":
          epubChapters.push({
            title: "Title Page",
            data: `<div class="cover-page">
              <h1>${esc(content.edition.title)}</h1>
              ${content.edition.subtitle ? `<p class="subtitle">${esc(content.edition.subtitle)}</p>` : ""}
              ${content.edition.author ? `<p class="author">${esc(content.edition.author)}</p>` : ""}
              ${content.edition.publisher ? `<p>${esc(content.edition.publisher)}</p>` : ""}
            </div>`,
          });
          break;

        case "DISCLAIMER":
          epubChapters.push({
            title: "Independent Publication Notice",
            data: `<div class="disclaimer">
              <h2>Independent Publication Notice</h2>
              <p>This is an independent reference work. It is not endorsed by, affiliated with, authorized by, or connected in any way to the History Channel, A+E Networks, Prometheus Entertainment, or any producers, participants, or distributors of the Ancient Aliens television program.</p>
              <p>All original commentary, summaries, and analysis in this work represent the views of the author(s). Episode descriptions are original summaries written for reference purposes.</p>
              <p>Trademarks and program titles are the property of their respective owners and are used solely for identification and reference purposes.</p>
            </div>`,
          });
          break;

        case "COPYRIGHT":
          epubChapters.push({
            title: "Copyright",
            data: `<div>
              <p>&copy; ${new Date().getFullYear()} ${content.edition.author || "The Author"}. All rights reserved.</p>
              ${content.edition.isbn ? `<p>ISBN: ${content.edition.isbn}</p>` : ""}
              ${content.edition.publisher ? `<p>Published by ${esc(content.edition.publisher)}</p>` : ""}
            </div>`,
          });
          break;

        case "COVER":
        case "TOC":
          // TOC is auto-generated by EPUB readers, cover handled via metadata
          break;

        default:
          if (fm.content) {
            epubChapters.push({
              title: fm.type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
              data: `<div>${fm.content}</div>`,
            });
          }
      }
    }

    // Content chapters
    for (const chapter of content.chapters) {
      const itemsHtml = chapter.items.map(item => renderItemHtml(item)).join("\n<hr />\n");

      epubChapters.push({
        title: chapter.title,
        data: `<h2>${esc(chapter.title)}</h2>${chapter.subtitle ? `<p><em>${esc(chapter.subtitle)}</em></p>` : ""}${itemsHtml || "<p><em>No content items in this chapter.</em></p>"}`,
      });
    }

    // Appendix placeholders
    for (const appendix of content.appendices) {
      if (!appendix.isIncluded) continue;
      const title = appendix.type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      epubChapters.push({
        title,
        data: `<h2>${title}</h2><p><em>This section will be auto-generated in full production builds.</em></p>`,
      });
    }

    // Generate EPUB
    const slug = content.edition.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const outputPath = path.join(process.cwd(), "public", "exports", `${slug}.epub`);

    // Ensure output directory exists
    const { mkdirSync } = await import("fs");
    mkdirSync(path.dirname(outputPath), { recursive: true });

    const epub = new EPub({
      title: content.edition.title,
      author: content.edition.author || "Unknown Author",
      publisher: content.edition.publisher || "",
      lang: content.edition.language || "en",
      description: content.edition.subtitle || content.edition.title,
      css,
      content: epubChapters,
      tocTitle: "Table of Contents",
      version: 3,
    }, outputPath);

    await epub.render();

    // Read the generated file
    const epubBuffer = readFileSync(outputPath);

    return {
      buffer: epubBuffer,
      filename: `${slug}.epub`,
      mimeType: "application/epub+zip",
    };
  }

  validate(content: BookContent): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (!content.edition.title) {
      issues.push({ severity: "error", message: "Edition title is required for EPUB" });
    }

    if (!content.edition.author) {
      issues.push({ severity: "warning", message: "Author is recommended for EPUB metadata" });
    }

    if (content.chapters.length === 0) {
      issues.push({ severity: "error", message: "At least one chapter is required" });
    }

    const totalItems = content.chapters.reduce((sum, ch) => sum + ch.items.length, 0);
    if (totalItems === 0) {
      issues.push({ severity: "warning", message: "No content items in any chapter" });
    }

    return issues;
  }
}
