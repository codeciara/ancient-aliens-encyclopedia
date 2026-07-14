// Export engine abstraction layer
// Allows swapping PDF/EPUB engines without changing application code

export interface BookContent {
  edition: {
    title: string;
    subtitle: string | null;
    author: string | null;
    publisher: string | null;
    isbn: string | null;
    publicationDate: string | null;
    language: string;
    pageSize: string;
    marginPreset: string;
    mirroredMargins: boolean;
    bleedMm: number;
  };
  frontMatter: FrontMatterPage[];
  chapters: BookChapterContent[];
  appendices: AppendixContent[];
}

export interface FrontMatterPage {
  type: string;
  content?: string | null;
  isIncluded: boolean;
}

export interface BookChapterContent {
  title: string;
  subtitle?: string | null;
  chapterType: string;
  items: ChapterItemContent[];
}

export interface ChapterItemContent {
  type: "episode" | "entry" | "person" | "location" | "theory" | "artifact" | "civilization" | "deity" | "ancientText";
  data: Record<string, unknown>;
}

export interface AppendixContent {
  type: string;
  isIncluded: boolean;
}

export interface ExportOptions {
  format: "PDF" | "EPUB";
  pageSize: string;
  marginPreset: string;
  mirroredMargins: boolean;
  bleedMm: number;
  includeBookmarks: boolean;
  optimizeFor: "print" | "web";
}

export interface ExportResult {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  pageCount?: number;
}

export interface ValidationIssue {
  severity: "error" | "warning";
  message: string;
  location?: string;
}

export interface ExportEngine {
  generate(content: BookContent, options: ExportOptions): Promise<ExportResult>;
  validate(content: BookContent): ValidationIssue[];
}
