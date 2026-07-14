"use client";

import { useState } from "react";
import { Plus, GripVertical, Trash2, ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { createChapter, deleteChapter, toggleChapterIncluded, updateChapterOrder, removeChapterItem } from "@/lib/actions/book-editions";

interface ChapterItem {
  id: string;
  sortOrder: number;
  isIncluded: boolean;
  episode?: { id: string; title: string; seasonNumber: number; episodeNumber: number; status: string } | null;
  entry?: { id: string; title: string; status: string } | null;
  person?: { id: string; name: string; status: string } | null;
  location?: { id: string; name: string; status: string } | null;
  theory?: { id: string; title: string; status: string } | null;
  artifact?: { id: string; name: string; status: string } | null;
  civilization?: { id: string; name: string; status: string } | null;
  deity?: { id: string; name: string; status: string } | null;
  ancientText?: { id: string; title: string; status: string } | null;
}

interface Chapter {
  id: string;
  title: string;
  chapterType: string;
  sortOrder: number;
  isDivider: boolean;
  isIncluded: boolean;
  items: ChapterItem[];
}

interface ChapterManagerProps {
  editionId: string;
  chapters: Chapter[];
}

const CHAPTER_TYPES = [
  { value: "EPISODE_GUIDE", label: "Episode Guide" },
  { value: "ENCYCLOPEDIA", label: "Encyclopedia A-Z" },
  { value: "THEORY", label: "Theory / Theme" },
  { value: "PEOPLE", label: "People & Researchers" },
  { value: "LOCATIONS", label: "Locations & Atlas" },
  { value: "CUSTOM", label: "Custom Chapter" },
  { value: "DIVIDER", label: "Section Divider" },
];

function getItemLabel(item: ChapterItem): string {
  if (item.episode) return `S${item.episode.seasonNumber}E${item.episode.episodeNumber}: ${item.episode.title}`;
  if (item.entry) return item.entry.title;
  if (item.person) return item.person.name;
  if (item.location) return item.location.name;
  if (item.theory) return item.theory.title;
  if (item.artifact) return item.artifact.name;
  if (item.civilization) return item.civilization.name;
  if (item.deity) return item.deity.name;
  if (item.ancientText) return item.ancientText.title;
  return "Unknown item";
}

function getItemStatus(item: ChapterItem): string {
  return item.episode?.status || item.entry?.status || item.person?.status || item.location?.status || item.theory?.status || item.artifact?.status || item.civilization?.status || item.deity?.status || item.ancientText?.status || "DRAFT";
}

export function ChapterManager({ editionId, chapters }: ChapterManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("EPISODE_GUIDE");
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(chapters.map(c => c.id)));

  const toggleExpanded = (id: string) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const ids = chapters.map(c => c.id);
    [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
    await updateChapterOrder(editionId, ids);
  };

  const handleMoveDown = async (index: number) => {
    if (index >= chapters.length - 1) return;
    const ids = chapters.map(c => c.id);
    [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
    await updateChapterOrder(editionId, ids);
  };

  return (
    <Card>
      <CardHeader
        title="Chapters"
        description="Organize your book content into chapters"
        action={
          <Button size="sm" variant="secondary" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-3.5 w-3.5" />Add Chapter
          </Button>
        }
      />

      {/* Add Chapter Form */}
      {showAddForm && (
        <form
          className="flex gap-2 items-end mb-4 p-3 bg-parchment rounded-lg"
          action={async () => {
            if (!newTitle.trim()) return;
            await createChapter(editionId, newTitle, newType);
            setNewTitle("");
            setShowAddForm(false);
          }}
        >
          <div className="flex-1">
            <Input
              label="Chapter Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Season 1 Episodes"
              required
            />
          </div>
          <div className="w-48">
            <Select
              label="Type"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              options={CHAPTER_TYPES}
            />
          </div>
          <Button type="submit" size="sm">Add</Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>Cancel</Button>
        </form>
      )}

      {/* Chapter List */}
      {chapters.length === 0 ? (
        <p className="text-sm text-charcoal-lighter italic py-4">
          No chapters yet. Add chapters to organize your book content.
        </p>
      ) : (
        <div className="space-y-2">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className={`border rounded-lg ${chapter.isIncluded ? "border-parchment-darker bg-white" : "border-dashed border-parchment-darker bg-parchment/50 opacity-60"}`}
            >
              {/* Chapter Header */}
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="text-charcoal-lighter hover:text-charcoal disabled:opacity-30 text-xs"
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index >= chapters.length - 1}
                    className="text-charcoal-lighter hover:text-charcoal disabled:opacity-30 text-xs"
                    title="Move down"
                  >
                    ▼
                  </button>
                </div>

                <GripVertical className="h-4 w-4 text-charcoal-lighter flex-shrink-0" />

                <button
                  onClick={() => toggleExpanded(chapter.id)}
                  className="text-charcoal-lighter hover:text-charcoal"
                >
                  {expandedChapters.has(chapter.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>

                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-charcoal">{chapter.title}</span>
                  <span className="text-xs text-charcoal-lighter ml-2">
                    ({CHAPTER_TYPES.find(t => t.value === chapter.chapterType)?.label || chapter.chapterType})
                  </span>
                  <span className="text-xs text-charcoal-lighter ml-2">
                    {chapter.items.length} items
                  </span>
                </div>

                <form action={async () => { await toggleChapterIncluded(editionId, chapter.id, !chapter.isIncluded); }}>
                  <button type="submit" className="text-charcoal-lighter hover:text-charcoal p-1" title={chapter.isIncluded ? "Exclude" : "Include"}>
                    {chapter.isIncluded ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                </form>

                <form action={async () => { await deleteChapter(editionId, chapter.id); }}>
                  <button type="submit" className="text-charcoal-lighter hover:text-error p-1" title="Delete chapter">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>

              {/* Chapter Items (expanded) */}
              {expandedChapters.has(chapter.id) && chapter.items.length > 0 && (
                <div className="border-t border-parchment-darker px-3 py-2 space-y-1">
                  {chapter.items.map((item) => {
                    const status = getItemStatus(item);
                    return (
                      <div key={item.id} className="flex items-center gap-2 px-2 py-1 rounded bg-parchment/50 text-sm">
                        <GripVertical className="h-3 w-3 text-charcoal-lighter flex-shrink-0" />
                        <span className="flex-1 text-charcoal text-xs">{getItemLabel(item)}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${status === "PUBLISHED" ? "bg-green-100 text-green-700" : status === "APPROVED" ? "bg-blue-100 text-blue-700" : "bg-stone-100 text-stone-600"}`}>
                          {status}
                        </span>
                        <form action={async () => { await removeChapterItem(item.id); }}>
                          <button type="submit" className="text-charcoal-lighter hover:text-error" title="Remove">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </form>
                      </div>
                    );
                  })}
                </div>
              )}

              {expandedChapters.has(chapter.id) && chapter.items.length === 0 && (
                <div className="border-t border-parchment-darker px-3 py-2">
                  <p className="text-xs text-charcoal-lighter italic">No items in this chapter yet.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
