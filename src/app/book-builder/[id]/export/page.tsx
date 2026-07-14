"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";

type ExportStatus = "idle" | "generating" | "success" | "error";

function EpubExportCard({ editionId }: { editionId: string }) {
  const [status, setStatus] = useState<ExportStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);

  const handleExportEpub = async () => {
    setStatus("generating");
    setError(null);
    setDownloadUrl(null);

    try {
      const response = await fetch(`/api/export/epub?editionId=${editionId}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Export failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const disposition = response.headers.get("Content-Disposition");
      const fname = disposition?.match(/filename="(.+)"/)?.[1] || "book.epub";

      setDownloadUrl(url);
      setFilename(fname);
      setStatus("success");
    } catch (err) {
      setError((err as Error).message);
      setStatus("error");
    }
  };

  return (
    <Card>
      <CardHeader
        title="EPUB Export"
        description="Reflowable ebook for Kindle, Apple Books, Kobo"
      />
      <div className="space-y-4">
        <div className="text-sm text-charcoal-lighter space-y-1">
          <p>Includes:</p>
          <ul className="list-disc pl-5 space-y-0.5 text-xs">
            <li>EPUB 3 reflowable format</li>
            <li>Adjustable text size</li>
            <li>Navigation document &amp; clickable TOC</li>
            <li>Internal cross-references</li>
            <li>Semantic headings &amp; accessibility</li>
            <li>Cover and metadata</li>
          </ul>
        </div>

        {status === "idle" && (
          <Button onClick={handleExportEpub} variant="gold" className="w-full">
            <FileText className="h-4 w-4" />
            Generate EPUB
          </Button>
        )}

        {status === "generating" && (
          <div className="flex items-center gap-2 p-3 bg-parchment rounded-lg">
            <Loader2 className="h-4 w-4 animate-spin text-gold" />
            <span className="text-sm text-charcoal">Generating EPUB...</span>
          </div>
        )}

        {status === "success" && downloadUrl && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800">EPUB generated!</span>
            </div>
            <a href={downloadUrl} download={filename || "book.epub"}>
              <Button variant="primary" className="w-full">
                <Download className="h-4 w-4" />
                Download {filename}
              </Button>
            </a>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => setStatus("idle")}>
              Generate Again
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800 font-medium">Export failed</p>
                <p className="text-xs text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setStatus("idle")}>
              Try Again
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function ExportPage() {
  const params = useParams();
  const id = params.id as string;
  const [status, setStatus] = useState<ExportStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);

  const handleExportPdf = async () => {
    setStatus("generating");
    setError(null);
    setDownloadUrl(null);

    try {
      const response = await fetch(`/api/export/pdf?editionId=${id}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Export failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const disposition = response.headers.get("Content-Disposition");
      const fname = disposition?.match(/filename="(.+)"/)?.[1] || "book.pdf";

      setDownloadUrl(url);
      setFilename(fname);
      setStatus("success");
    } catch (err) {
      setError((err as Error).message);
      setStatus("error");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Link href={`/book-builder/${id}`} className="inline-flex items-center gap-1 text-sm text-charcoal-lighter hover:text-charcoal">
          <ArrowLeft className="h-3 w-3" /> Back to Edition
        </Link>
      </div>

      <PageHeader
        title="Export Book"
        description="Generate PDF or EPUB from your edition"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* PDF Export */}
        <Card>
          <CardHeader
            title="PDF Export"
            description="Full-color designed PDF with professional typesetting"
          />

          <div className="space-y-4">
            <div className="text-sm text-charcoal-lighter space-y-1">
              <p>Includes:</p>
              <ul className="list-disc pl-5 space-y-0.5 text-xs">
                <li>Page numbers and running headers</li>
                <li>Chapter title pages</li>
                <li>Table of contents</li>
                <li>Evidence badges and labels</li>
                <li>Print-ready margins</li>
                <li>Cross-references</li>
              </ul>
            </div>

            {status === "idle" && (
              <Button onClick={handleExportPdf} variant="gold" className="w-full">
                <FileText className="h-4 w-4" />
                Generate PDF
              </Button>
            )}

            {status === "generating" && (
              <div className="flex items-center gap-2 p-3 bg-parchment rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin text-gold" />
                <span className="text-sm text-charcoal">Generating PDF... This may take a moment.</span>
              </div>
            )}

            {status === "success" && downloadUrl && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">PDF generated successfully!</span>
                </div>
                <a href={downloadUrl} download={filename || "book.pdf"}>
                  <Button variant="primary" className="w-full">
                    <Download className="h-4 w-4" />
                    Download {filename}
                  </Button>
                </a>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setStatus("idle")}>
                  Generate Again
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-800 font-medium">Export failed</p>
                    <p className="text-xs text-red-700 mt-0.5">{error}</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setStatus("idle")}>
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* EPUB Export */}
        <EpubExportCard editionId={id} />
      </div>
    </div>
  );
}
