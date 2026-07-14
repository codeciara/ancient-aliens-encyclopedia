import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import path from "path";
import { BookContent, ExportOptions, ExportResult, ExportEngine, ValidationIssue } from "./types";
import { renderFullBook } from "./html-renderer";

// Page size configurations
const PAGE_SIZES: Record<string, { width: string; height: string }> = {
  US_LETTER: { width: "8.5in", height: "11in" },
  TRIM_6x9: { width: "6in", height: "9in" },
  A4: { width: "210mm", height: "297mm" },
};

// Margin presets (inner/outer for mirrored, or uniform)
const MARGIN_PRESETS: Record<string, { inner: string; outer: string; top: string; bottom: string }> = {
  STANDARD: { inner: "1in", outer: "0.75in", top: "0.75in", bottom: "0.75in" },
  NARROW: { inner: "0.75in", outer: "0.5in", top: "0.5in", bottom: "0.5in" },
  WIDE: { inner: "1.25in", outer: "1in", top: "1in", bottom: "1in" },
  PRINT: { inner: "1.5in", outer: "0.75in", top: "0.75in", bottom: "0.75in" },
};

function buildFullHtml(content: BookContent, options: ExportOptions): string {
  const pageSize = PAGE_SIZES[options.pageSize] || PAGE_SIZES.US_LETTER;
  const margins = MARGIN_PRESETS[options.marginPreset] || MARGIN_PRESETS.STANDARD;

  // Load the CSS file
  const cssPath = path.join(process.cwd(), "src", "lib", "export", "book-styles.css");
  let css = "";
  try {
    css = readFileSync(cssPath, "utf-8");
  } catch {
    // Fallback: use inline critical styles
    css = "body { font-family: serif; font-size: 10.5pt; line-height: 1.5; }";
  }

  // Override page size variables
  const cssOverrides = `
    :root {
      --page-width: ${pageSize.width};
      --page-height: ${pageSize.height};
      --margin-inner: ${margins.inner};
      --margin-outer: ${margins.outer};
    }
    @page {
      size: ${pageSize.width} ${pageSize.height};
      margin-top: ${margins.top};
      margin-bottom: ${margins.bottom};
    }
    ${options.mirroredMargins ? `
    @page :left {
      margin-left: ${margins.outer};
      margin-right: ${margins.inner};
    }
    @page :right {
      margin-left: ${margins.inner};
      margin-right: ${margins.outer};
    }
    ` : `
    @page {
      margin-left: ${margins.inner};
      margin-right: ${margins.outer};
    }
    `}
  `;

  const body = renderFullBook(content);

  return `<!DOCTYPE html>
<html lang="${content.edition.language || "en"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.edition.title}</title>
  <style>${css}</style>
  <style>${cssOverrides}</style>
</head>
<body>
  ${body}
</body>
</html>`;
}

export class PagedJsPdfEngine implements ExportEngine {
  async generate(content: BookContent, options: ExportOptions): Promise<ExportResult> {
    const html = buildFullHtml(content, options);
    const pageSize = PAGE_SIZES[options.pageSize] || PAGE_SIZES.US_LETTER;

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    try {
      const page = await browser.newPage();

      await page.setContent(html, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      // Wait a moment for any CSS to fully process
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500)));

      const pdfBuffer = await page.pdf({
        width: pageSize.width,
        height: pageSize.height,
        printBackground: true,
        preferCSSPageSize: true,
        displayHeaderFooter: false,
        margin: { top: "0", bottom: "0", left: "0", right: "0" },
      });

      const slug = content.edition.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      return {
        buffer: Buffer.from(pdfBuffer),
        filename: `${slug}.pdf`,
        mimeType: "application/pdf",
      };
    } finally {
      await browser.close();
    }
  }

  validate(content: BookContent): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (!content.edition.title) {
      issues.push({ severity: "error", message: "Edition title is required" });
    }

    if (content.chapters.length === 0) {
      issues.push({ severity: "error", message: "At least one chapter is required" });
    }

    const totalItems = content.chapters.reduce((sum, ch) => sum + ch.items.length, 0);
    if (totalItems === 0) {
      issues.push({ severity: "warning", message: "No content items in any chapter" });
    }

    const hasToc = content.frontMatter.some(fm => fm.type === "TOC" && fm.isIncluded);
    if (!hasToc) {
      issues.push({ severity: "warning", message: "Table of contents is not included" });
    }

    return issues;
  }
}
