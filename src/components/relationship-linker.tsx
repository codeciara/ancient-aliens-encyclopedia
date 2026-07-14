"use client";

import { useState } from "react";
import { Plus, X, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";

interface LinkableItem {
  id: string;
  label: string;
}

interface RelationshipLinkerProps {
  title: string;
  description?: string;
  currentLinks: { id: string; label: string; sublabel?: string }[];
  availableItems: LinkableItem[];
  onLink: (itemId: string) => Promise<void>;
  onUnlink: (itemId: string) => Promise<void>;
}

export function RelationshipLinker({
  title,
  description,
  currentLinks,
  availableItems,
  onLink,
  onUnlink,
}: RelationshipLinkerProps) {
  const [showSelector, setShowSelector] = useState(false);
  const [search, setSearch] = useState("");

  const linkedIds = new Set(currentLinks.map((l) => l.id));
  const filtered = availableItems
    .filter((item) => !linkedIds.has(item.id))
    .filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <Card padding="sm">
      <CardHeader
        title={title}
        description={description}
        action={
          <Button size="sm" variant="ghost" onClick={() => setShowSelector(!showSelector)}>
            {showSelector ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </Button>
        }
      />

      {/* Current Links */}
      {currentLinks.length > 0 && (
        <div className="space-y-1 mb-3">
          {currentLinks.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between gap-2 px-2 py-1.5 rounded bg-parchment"
            >
              <div className="flex items-center gap-2 min-w-0">
                <LinkIcon className="h-3 w-3 text-sandstone flex-shrink-0" />
                <span className="text-sm text-charcoal truncate">{link.label}</span>
                {link.sublabel && (
                  <span className="text-xs text-charcoal-lighter">{link.sublabel}</span>
                )}
              </div>
              <form action={async () => { await onUnlink(link.id); }}>
                <button
                  type="submit"
                  className="text-charcoal-lighter hover:text-error transition-colors p-0.5"
                  title="Remove link"
                >
                  <X className="h-3 w-3" />
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      {currentLinks.length === 0 && !showSelector && (
        <p className="text-xs text-charcoal-lighter italic mb-2">No links yet</p>
      )}

      {/* Selector */}
      {showSelector && (
        <div className="border border-parchment-darker rounded p-2 bg-white">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full px-2 py-1 text-sm border border-parchment-darker rounded mb-2 focus:outline-none focus:border-gold"
          />
          <div className="max-h-32 overflow-y-auto space-y-0.5">
            {filtered.length === 0 ? (
              <p className="text-xs text-charcoal-lighter p-1">No items available</p>
            ) : (
              filtered.slice(0, 20).map((item) => (
                <form key={item.id} action={async () => { await onLink(item.id); }}>
                  <button
                    type="submit"
                    className="w-full text-left px-2 py-1 text-sm text-charcoal hover:bg-parchment rounded transition-colors"
                  >
                    + {item.label}
                  </button>
                </form>
              ))
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
