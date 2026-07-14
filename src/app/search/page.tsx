import { prisma } from "@/lib/db";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PublicationStatus } from "@/types";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; type?: string; status?: string }>;
}

interface SearchResult {
  id: string;
  title: string;
  type: string;
  href: string;
  status: string;
  subtitle?: string;
}

async function search(query: string, type?: string, status?: string): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  if (!query || query.length < 2) return results;

  const statusFilter = status ? { status } : {};
  const shouldSearch = (t: string) => !type || type === "all" || type === t;

  if (shouldSearch("episode")) {
    const episodes = await prisma.episode.findMany({
      where: { ...statusFilter, OR: [{ title: { contains: query } }, { summary: { contains: query } }] },
      select: { id: true, title: true, slug: true, seasonNumber: true, episodeNumber: true, status: true },
      take: 20,
    });
    results.push(...episodes.map(e => ({
      id: e.id, title: e.title, type: "Episode", href: `/episodes/${e.slug}`, status: e.status,
      subtitle: `S${e.seasonNumber}E${e.episodeNumber}`,
    })));
  }

  if (shouldSearch("entry")) {
    const entries = await prisma.encyclopediaEntry.findMany({
      where: { ...statusFilter, OR: [{ title: { contains: query } }, { briefOverview: { contains: query } }, { alternateNames: { contains: query } }] },
      select: { id: true, title: true, slug: true, category: true, status: true },
      take: 20,
    });
    results.push(...entries.map(e => ({
      id: e.id, title: e.title, type: "Encyclopedia", href: `/encyclopedia/${e.slug}`, status: e.status,
      subtitle: e.category || undefined,
    })));
  }

  if (shouldSearch("person")) {
    const people = await prisma.person.findMany({
      where: { ...statusFilter, OR: [{ name: { contains: query } }, { biography: { contains: query } }] },
      select: { id: true, name: true, slug: true, status: true },
      take: 20,
    });
    results.push(...people.map(p => ({ id: p.id, title: p.name, type: "Person", href: `/people/${p.slug}`, status: p.status })));
  }

  if (shouldSearch("location")) {
    const locations = await prisma.location.findMany({
      where: { ...statusFilter, OR: [{ name: { contains: query } }, { country: { contains: query } }, { description: { contains: query } }] },
      select: { id: true, name: true, slug: true, country: true, status: true },
      take: 20,
    });
    results.push(...locations.map(l => ({ id: l.id, title: l.name, type: "Location", href: `/locations/${l.slug}`, status: l.status, subtitle: l.country || undefined })));
  }

  if (shouldSearch("theory")) {
    const theories = await prisma.theory.findMany({
      where: { ...statusFilter, OR: [{ title: { contains: query } }, { overview: { contains: query } }] },
      select: { id: true, title: true, slug: true, status: true },
      take: 20,
    });
    results.push(...theories.map(t => ({ id: t.id, title: t.title, type: "Theory", href: `/theories/${t.slug}`, status: t.status })));
  }

  if (shouldSearch("artifact")) {
    const artifacts = await prisma.artifact.findMany({
      where: { ...statusFilter, OR: [{ name: { contains: query } }, { description: { contains: query } }] },
      select: { id: true, name: true, slug: true, civilization: true, status: true },
      take: 20,
    });
    results.push(...artifacts.map(a => ({ id: a.id, title: a.name, type: "Artifact", href: `/artifacts/${a.slug}`, status: a.status, subtitle: a.civilization || undefined })));
  }

  return results;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, type, status } = await searchParams;
  const results = q ? await search(q, type, status) : [];

  return (
    <div>
      <PageHeader title="Search" description="Search across all content" />

      {/* Search Form */}
      <form method="GET" className="mb-6 max-w-2xl">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-lighter" />
            <input
              type="text" name="q" defaultValue={q || ""}
              placeholder="Search episodes, entries, people, locations..."
              className="w-full pl-10 pr-4 py-2.5 rounded-md border border-parchment-darker bg-white text-sm focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
            />
          </div>
          <select name="type" defaultValue={type || "all"} className="px-3 py-2 rounded-md border border-parchment-darker bg-white text-sm">
            <option value="all">All Types</option>
            <option value="episode">Episodes</option>
            <option value="entry">Encyclopedia</option>
            <option value="person">People</option>
            <option value="location">Locations</option>
            <option value="theory">Theories</option>
            <option value="artifact">Artifacts</option>
          </select>
          <select name="status" defaultValue={status || ""} className="px-3 py-2 rounded-md border border-parchment-darker bg-white text-sm">
            <option value="">Any Status</option>
            <option value="DRAFT">Draft</option>
            <option value="REVIEW">Review</option>
            <option value="APPROVED">Approved</option>
            <option value="PUBLISHED">Published</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-deep-blue text-white rounded-md text-sm font-medium hover:bg-deep-blue/90">Search</button>
        </div>
      </form>

      {/* Results */}
      {q && results.length === 0 && (
        <EmptyState icon={SearchIcon} title="No results found" description={`No content matching "${q}" was found.`} />
      )}

      {results.length > 0 && (
        <div className="space-y-2 max-w-3xl">
          <p className="text-sm text-charcoal-lighter mb-3">{results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;</p>
          {results.map((r) => (
            <Link key={r.id} href={r.href}>
              <Card padding="sm" className="hover:border-gold transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-charcoal text-sm">{r.title}</span>
                    {r.subtitle && <span className="ml-2 text-xs text-charcoal-lighter">{r.subtitle}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-parchment text-charcoal-lighter rounded">{r.type}</span>
                    <StatusBadge status={r.status as PublicationStatus} />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!q && (
        <div className="text-center py-12 text-charcoal-lighter">
          <SearchIcon className="h-8 w-8 mx-auto mb-3 text-sandstone" />
          <p className="text-sm">Enter a search term to find content across the encyclopedia.</p>
        </div>
      )}
    </div>
  );
}
