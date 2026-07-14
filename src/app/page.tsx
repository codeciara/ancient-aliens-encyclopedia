import Link from "next/link";
import { Tv, BookOpen, MapPin, Users, Lightbulb, Gem, Building2, Flame, ScrollText, Plus, Library } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/db";

async function getDashboardStats() {
  const [episodes, entries, locations, people, theories, artifacts, civilizations, deities, texts, sources] = await Promise.all([
    prisma.episode.count(),
    prisma.encyclopediaEntry.count(),
    prisma.location.count(),
    prisma.person.count(),
    prisma.theory.count(),
    prisma.artifact.count(),
    prisma.civilization.count(),
    prisma.deity.count(),
    prisma.ancientText.count(),
    prisma.source.count(),
  ]);
  return { episodes, entries, locations, people, theories, artifacts, civilizations, deities, texts, sources };
}

async function getRecentActivity() {
  const [recentEpisodes, recentEntries] = await Promise.all([
    prisma.episode.findMany({ orderBy: { updatedAt: "desc" }, take: 5, select: { slug: true, title: true, status: true, updatedAt: true } }),
    prisma.encyclopediaEntry.findMany({ orderBy: { updatedAt: "desc" }, take: 5, select: { slug: true, title: true, status: true, updatedAt: true } }),
  ]);
  return { recentEpisodes, recentEntries };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const activity = await getRecentActivity();

  const statCards = [
    { label: "Episodes", count: stats.episodes, icon: Tv, href: "/episodes", color: "text-blue-700" },
    { label: "Encyclopedia", count: stats.entries, icon: BookOpen, href: "/encyclopedia", color: "text-emerald-700" },
    { label: "Locations", count: stats.locations, icon: MapPin, href: "/locations", color: "text-red-700" },
    { label: "People", count: stats.people, icon: Users, href: "/people", color: "text-purple-700" },
    { label: "Theories", count: stats.theories, icon: Lightbulb, href: "/theories", color: "text-amber-700" },
    { label: "Artifacts", count: stats.artifacts, icon: Gem, href: "/artifacts", color: "text-teal-700" },
    { label: "Civilizations", count: stats.civilizations, icon: Building2, href: "/civilizations", color: "text-orange-700" },
    { label: "Deities", count: stats.deities, icon: Flame, href: "/deities", color: "text-rose-700" },
    { label: "Ancient Texts", count: stats.texts, icon: ScrollText, href: "/texts", color: "text-indigo-700" },
    { label: "Sources", count: stats.sources, icon: Library, href: "/sources", color: "text-stone-700" },
  ];

  return (
    <div>
      <PageHeader
        title="The Ancient Aliens Encyclopedia"
        description="A Guide to the Episodes, Civilizations, Artifacts, Gods, Locations, and Theories"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card padding="sm" className="hover:border-gold transition-colors text-center cursor-pointer">
              <stat.icon className={`h-5 w-5 mx-auto mb-1 ${stat.color}`} />
              <p className="text-2xl font-display text-charcoal">{stat.count}</p>
              <p className="text-xs text-charcoal-lighter">{stat.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Create */}
      <Card className="mb-8">
        <CardHeader title="Quick Create" description="Jump to creating a new entry" />
        <div className="flex flex-wrap gap-2">
          <Link href="/episodes/new"><Button size="sm" variant="secondary"><Plus className="h-3 w-3" />Episode</Button></Link>
          <Link href="/encyclopedia/new"><Button size="sm" variant="secondary"><Plus className="h-3 w-3" />Entry</Button></Link>
          <Link href="/locations/new"><Button size="sm" variant="secondary"><Plus className="h-3 w-3" />Location</Button></Link>
          <Link href="/people/new"><Button size="sm" variant="secondary"><Plus className="h-3 w-3" />Person</Button></Link>
          <Link href="/theories/new"><Button size="sm" variant="secondary"><Plus className="h-3 w-3" />Theory</Button></Link>
          <Link href="/artifacts/new"><Button size="sm" variant="secondary"><Plus className="h-3 w-3" />Artifact</Button></Link>
          <Link href="/sources/new"><Button size="sm" variant="secondary"><Plus className="h-3 w-3" />Source</Button></Link>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Recent Episodes" />
          {activity.recentEpisodes.length === 0 ? (
            <p className="text-sm text-charcoal-lighter">No episodes yet</p>
          ) : (
            <div className="space-y-2">
              {activity.recentEpisodes.map((ep) => (
                <Link key={ep.slug} href={`/episodes/${ep.slug}`} className="block text-sm text-charcoal hover:text-deep-blue">
                  {ep.title}
                  <span className="text-xs text-charcoal-lighter ml-2">{ep.status}</span>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Recent Entries" />
          {activity.recentEntries.length === 0 ? (
            <p className="text-sm text-charcoal-lighter">No entries yet</p>
          ) : (
            <div className="space-y-2">
              {activity.recentEntries.map((entry) => (
                <Link key={entry.slug} href={`/encyclopedia/${entry.slug}`} className="block text-sm text-charcoal hover:text-deep-blue">
                  {entry.title}
                  <span className="text-xs text-charcoal-lighter ml-2">{entry.status}</span>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
