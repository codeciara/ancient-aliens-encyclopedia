// Renders book content to HTML for both PDF (Paged.js) and EPUB pipelines

import { BookContent, ChapterItemContent } from "./types";

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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderField(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `
    <div class="field">
      <h4 class="field-label">${escapeHtml(label)}</h4>
      <p class="field-value">${escapeHtml(value)}</p>
    </div>`;
}

function renderClaims(claims: Array<Record<string, unknown>>): string {
  if (!claims || claims.length === 0) return "";
  return `
    <div class="claims-section">
      <h4 class="field-label">Claims &amp; Evidence</h4>
      ${claims.map(claim => `
        <div class="claim">
          <p class="claim-statement">${escapeHtml(claim.statement as string)}</p>
          <div class="claim-meta">
            <span class="evidence-badge">${EVIDENCE_TYPE_LABELS[claim.evidenceType as string] || claim.evidenceType}</span>
            <span class="evidence-level level-${claim.contextLevel}">Level ${claim.contextLevel}: ${EVIDENCE_LEVEL_LABELS[claim.contextLevel as number] || ""}</span>
          </div>
          ${claim.explanation ? `<p class="claim-explanation">${escapeHtml(claim.explanation as string)}</p>` : ""}
        </div>
      `).join("")}
    </div>`;
}

export function renderEpisodePage(data: Record<string, unknown>): string {
  return `
    <section class="episode-page" id="episode-${escapeHtml(data.slug as string)}">
      <div class="episode-header">
        <span class="episode-number">S${String(data.seasonNumber).padStart(2, "0")}E${String(data.episodeNumber).padStart(2, "0")}</span>
        <h3 class="episode-title">${escapeHtml(data.title as string)}</h3>
        ${data.originalAirDate ? `<span class="air-date">Original Air Date: ${data.originalAirDate}</span>` : ""}
      </div>
      ${data.centralQuestion ? `<blockquote class="central-question">${escapeHtml(data.centralQuestion as string)}</blockquote>` : ""}
      ${renderField("Summary", data.summary as string)}
      ${renderField("Main Subjects", data.mainSubjects as string)}
      ${renderField("Conventional Explanations", data.conventionalExplanations as string)}
      ${renderClaims((data.claims as Array<Record<string, unknown>>) || [])}
    </section>`;
}

export function renderEntryPage(data: Record<string, unknown>): string {
  return `
    <section class="entry-page" id="entry-${escapeHtml(data.slug as string)}">
      <h3 class="entry-title">${escapeHtml(data.title as string)}</h3>
      ${data.alternateNames ? `<p class="alternate-names"><em>Also known as:</em> ${escapeHtml(data.alternateNames as string)}</p>` : ""}
      ${renderField("Overview", data.briefOverview as string)}
      ${renderField("Historical Background", data.historicalBackground as string)}
      ${renderField("Ancient Astronaut Interpretation", data.ancientAstronautView as string)}
      ${renderField("Mainstream Scholarly Interpretation", data.mainstreamView as string)}
      ${renderField("Evidence Commonly Cited", data.evidenceCited as string)}
      ${renderField("Unresolved Questions", data.unresolvedQuestions as string)}
      ${renderClaims((data.claims as Array<Record<string, unknown>>) || [])}
    </section>`;
}

export function renderPersonPage(data: Record<string, unknown>): string {
  return `
    <section class="person-page" id="person-${escapeHtml(data.slug as string)}">
      <h3 class="person-name">${escapeHtml(data.name as string)}</h3>
      ${renderField("Biography", data.biography as string)}
      ${renderField("Main Theories", data.mainTheories as string)}
      ${renderField("Published Works", data.publishedWorks as string)}
      ${renderField("Support & Criticism", data.supportAndCriticism as string)}
    </section>`;
}

export function renderLocationPage(data: Record<string, unknown>): string {
  return `
    <section class="location-page" id="location-${escapeHtml(data.slug as string)}">
      <h3 class="location-name">${escapeHtml(data.name as string)}</h3>
      <div class="location-meta">
        ${data.country ? `<span class="meta-item">${escapeHtml(data.country as string)}</span>` : ""}
        ${data.historicalPeriod ? `<span class="meta-item">${escapeHtml(data.historicalPeriod as string)}</span>` : ""}
        ${data.latitude && data.longitude ? `<span class="meta-item">${data.latitude}°, ${data.longitude}°</span>` : ""}
      </div>
      ${renderField("Description", data.description as string)}
      ${renderField("Archaeological Consensus", data.archaeologicalConsensus as string)}
      ${renderField("Ancient Astronaut Interpretation", data.ancientAstronautView as string)}
      ${renderField("Unresolved Questions", data.unresolvedQuestions as string)}
    </section>`;
}

export function renderTheoryPage(data: Record<string, unknown>): string {
  return `
    <section class="theory-page" id="theory-${escapeHtml(data.slug as string)}">
      <h3 class="theory-title">${escapeHtml(data.title as string)}</h3>
      ${renderField("Overview", data.overview as string)}
      ${renderField("Historical Context", data.historicalContext as string)}
      ${renderField("Key Arguments", data.keyArguments as string)}
      ${renderField("Supporting Evidence", data.supportingEvidence as string)}
      ${renderField("Counter Arguments", data.counterArguments as string)}
    </section>`;
}

export function renderGenericPage(data: Record<string, unknown>): string {
  const title = (data.title || data.name || "Untitled") as string;
  return `
    <section class="generic-page">
      <h3>${escapeHtml(title)}</h3>
      ${data.description ? `<p>${escapeHtml(data.description as string)}</p>` : ""}
    </section>`;
}

export function renderChapterItem(item: ChapterItemContent): string {
  switch (item.type) {
    case "episode": return renderEpisodePage(item.data);
    case "entry": return renderEntryPage(item.data);
    case "person": return renderPersonPage(item.data);
    case "location": return renderLocationPage(item.data);
    case "theory": return renderTheoryPage(item.data);
    default: return renderGenericPage(item.data);
  }
}

export function renderFrontMatter(content: BookContent): string {
  const { edition, frontMatter, chapters } = content;
  let html = "";

  for (const page of frontMatter) {
    if (!page.isIncluded) continue;

    switch (page.type) {
      case "COVER":
        html += `
          <section class="page-cover">
            <div class="cover-content">
              <p class="cover-label">An Independent Reference</p>
              <h1 class="cover-title">${escapeHtml(edition.title)}</h1>
              ${edition.subtitle ? `<p class="cover-subtitle">${escapeHtml(edition.subtitle)}</p>` : ""}
              ${edition.author ? `<p class="cover-author">${escapeHtml(edition.author)}</p>` : ""}
            </div>
          </section>`;
        break;

      case "TITLE_PAGE":
        html += `
          <section class="page-title">
            <h1>${escapeHtml(edition.title)}</h1>
            ${edition.subtitle ? `<p class="subtitle">${escapeHtml(edition.subtitle)}</p>` : ""}
            ${edition.author ? `<p class="author">${escapeHtml(edition.author)}</p>` : ""}
            ${edition.publisher ? `<p class="publisher">${escapeHtml(edition.publisher)}</p>` : ""}
          </section>`;
        break;

      case "COPYRIGHT":
        html += `
          <section class="page-copyright">
            <p>&copy; ${new Date().getFullYear()} ${edition.author || "The Author"}. All rights reserved.</p>
            ${edition.isbn ? `<p>ISBN: ${edition.isbn}</p>` : ""}
            ${edition.publisher ? `<p>Published by ${escapeHtml(edition.publisher)}</p>` : ""}
            <p>This is an independent publication.</p>
          </section>`;
        break;

      case "DISCLAIMER":
        html += `
          <section class="page-disclaimer">
            <h2>Independent Publication Notice</h2>
            <p>This is an independent reference work. It is not endorsed by, affiliated with, authorized by, or connected in any way to the History Channel, A+E Networks, Prometheus Entertainment, or any producers, participants, or distributors of the Ancient Aliens television program.</p>
            <p>All original commentary, summaries, and analysis in this work represent the views of the author(s). Episode descriptions are original summaries written for reference purposes. No transcripts, copyrighted descriptions, or unauthorized media are reproduced herein.</p>
            <p>Trademarks and program titles are the property of their respective owners and are used solely for identification and reference purposes.</p>
          </section>`;
        break;

      case "TOC":
        html += `
          <section class="page-toc" id="toc">
            <h2>Table of Contents</h2>
            <nav class="toc-list">
              ${chapters.map((ch, i) => `
                <div class="toc-entry">
                  <span class="toc-number">${i + 1}</span>
                  <span class="toc-title"><a href="#chapter-${i}">${escapeHtml(ch.title)}</a></span>
                  <span class="toc-dots"></span>
                </div>
              `).join("")}
            </nav>
          </section>`;
        break;

      default:
        html += `
          <section class="page-${page.type.toLowerCase()}">
            <h2>${page.type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</h2>
            ${page.content ? `<div>${page.content}</div>` : `<p><em>Content to be added.</em></p>`}
          </section>`;
    }
  }

  return html;
}

export function renderFullBook(content: BookContent): string {
  let body = "";

  // Front matter
  body += renderFrontMatter(content);

  // Chapters
  content.chapters.forEach((chapter, i) => {
    body += `
      <section class="chapter-title-page" id="chapter-${i}">
        <p class="chapter-number">Chapter ${i + 1}</p>
        <h2 class="chapter-heading">${escapeHtml(chapter.title)}</h2>
        ${chapter.subtitle ? `<p class="chapter-subtitle">${escapeHtml(chapter.subtitle)}</p>` : ""}
      </section>`;

    for (const item of chapter.items) {
      body += renderChapterItem(item);
    }
  });

  // Appendices placeholder
  for (const appendix of content.appendices) {
    if (!appendix.isIncluded) continue;
    body += `
      <section class="appendix-page">
        <h2>${appendix.type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</h2>
        <p><em>Auto-generated index content.</em></p>
      </section>`;
  }

  return body;
}
