"use client";

import { useState } from "react";
import { Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";

type ImportStatus = "idle" | "validating" | "preview" | "importing" | "success" | "error";

interface Preview {
  episodes: number; entries: number; people: number;
  locations: number; theories: number; artifacts: number;
  civilizations: number; deities: number; ancientTexts: number; sources: number;
}

export default function ImportPage() {
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [result, setResult] = useState<{ created: number; skipped: number; errors: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setStatus("idle"); setPreview(null); setResult(null); setError(null); }
  };

  const handleValidate = async () => {
    if (!file) return;
    setStatus("validating");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/import?dryRun=true", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) { setError(data.issues?.join(", ") || data.error); setStatus("error"); return; }
      setPreview(data.preview); setStatus("preview");
    } catch (e) { setError((e as Error).message); setStatus("error"); }
  };

  const handleImport = async () => {
    if (!file) return;
    setStatus("importing");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/import", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) { setError(data.issues?.join(", ") || data.error); setStatus("error"); return; }
      setResult(data); setStatus("success");
    } catch (e) { setError((e as Error).message); setStatus("error"); }
  };

  return (
    <div>
      <PageHeader title="Import Content" description="Import episodes, entries, and other content from JSON files" />
      <div className="max-w-3xl space-y-6">
        {/* File Upload */}
        <Card>
          <CardHeader title="Upload JSON File" description="Select a structured JSON file to import" />
          <div className="space-y-4">
            <input type="file" accept=".json" onChange={handleFileSelect}
              className="block w-full text-sm text-charcoal file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-parchment file:text-charcoal hover:file:bg-parchment-dark cursor-pointer" />
            {file && <p className="text-sm text-charcoal-lighter">Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)</p>}
            {file && status === "idle" && (
              <Button onClick={handleValidate} variant="secondary">Validate &amp; Preview</Button>
            )}
          </div>
        </Card>

        {/* Validating */}
        {status === "validating" && (
          <div className="flex items-center gap-2 p-4 bg-parchment rounded-lg">
            <Loader2 className="h-4 w-4 animate-spin text-gold" />
            <span className="text-sm">Validating file structure...</span>
          </div>
        )}

        {/* Preview */}
        {status === "preview" && preview && (
          <Card>
            <CardHeader title="Import Preview" description="This data will be imported as DRAFT entries" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
              {Object.entries(preview).filter(([, v]) => v > 0).map(([key, value]) => (
                <div key={key} className="text-center p-2 bg-parchment rounded">
                  <p className="text-lg font-display text-charcoal">{value}</p>
                  <p className="text-xs text-charcoal-lighter">{key}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button onClick={handleImport} variant="gold">Import Now</Button>
              <Button onClick={() => { setStatus("idle"); setPreview(null); }} variant="secondary">Cancel</Button>
            </div>
          </Card>
        )}

        {/* Importing */}
        {status === "importing" && (
          <div className="flex items-center gap-2 p-4 bg-parchment rounded-lg">
            <Loader2 className="h-4 w-4 animate-spin text-gold" />
            <span className="text-sm">Importing content...</span>
          </div>
        )}

        {/* Success */}
        {status === "success" && result && (
          <Card className="border-green-200 bg-green-50/50">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Import complete!</p>
                <p className="text-sm text-green-700 mt-1">{result.created} records created, {result.skipped} duplicates skipped</p>
                {result.errors.length > 0 && (
                  <div className="mt-2"><p className="text-xs text-red-700 font-medium">Errors:</p>
                    {result.errors.map((e, i) => <p key={i} className="text-xs text-red-600">{e}</p>)}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Error */}
        {status === "error" && error && (
          <Card className="border-red-200 bg-red-50/50">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Import failed</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
            <Button onClick={() => setStatus("idle")} variant="secondary" size="sm" className="mt-3">Try Again</Button>
          </Card>
        )}

        {/* Format Guide */}
        <Card>
          <CardHeader title="JSON Format" description="Expected structure for import files" />
          <pre className="text-xs bg-charcoal text-parchment p-4 rounded overflow-x-auto">{`{
  "episodes": [
    { "title": "...", "seasonNumber": 1, "episodeNumber": 1, "originalAirDate": "2010-04-20", "summary": "..." }
  ],
  "entries": [
    { "title": "...", "category": "Monument", "briefOverview": "..." }
  ],
  "people": [{ "name": "...", "biography": "..." }],
  "locations": [{ "name": "...", "country": "...", "latitude": 29.97 }],
  "theories": [{ "title": "...", "overview": "..." }],
  "artifacts": [{ "name": "...", "civilization": "..." }],
  "civilizations": [{ "name": "...", "timeRange": "..." }],
  "deities": [{ "name": "...", "mythology": "..." }],
  "ancientTexts": [{ "title": "...", "civilization": "..." }],
  "sources": [{ "title": "...", "author": "...", "publicationYear": 1968 }]
}`}</pre>
        </Card>
      </div>
    </div>
  );
}
