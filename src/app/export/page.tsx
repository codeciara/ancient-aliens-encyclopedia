"use client";

import { Download } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";

const EXPORT_TYPES = [
  { key: "full", label: "Full Database", description: "All content including episodes, entries, people, locations, and more" },
  { key: "episodes", label: "Episodes Only", description: "All episode guide entries" },
  { key: "entries", label: "Encyclopedia Only", description: "All A-Z encyclopedia entries" },
  { key: "people", label: "People Only", description: "All researcher and figure profiles" },
  { key: "locations", label: "Locations Only", description: "All location entries" },
  { key: "theories", label: "Theories Only", description: "All theory and theme chapters" },
  { key: "sources", label: "Sources Only", description: "Bibliography and source library" },
];

export default function ExportPage() {
  const handleExport = (type: string) => {
    window.location.href = `/api/export/json?type=${type}`;
  };

  return (
    <div>
      <PageHeader title="Export Content" description="Download your content as JSON for backup or transfer" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
        {EXPORT_TYPES.map((t) => (
          <Card key={t.key}>
            <CardHeader title={t.label} description={t.description} />
            <Button onClick={() => handleExport(t.key)} variant="secondary" size="sm" className="w-full">
              <Download className="h-3.5 w-3.5" />
              Download JSON
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
