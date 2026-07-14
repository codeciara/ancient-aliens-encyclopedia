import { PageHeader } from "@/components/ui/page-header";
import { EpisodeForm } from "@/components/forms/episode-form";
import { createEpisode } from "@/lib/actions/episodes";

export default function NewEpisodePage() {
  return (
    <div>
      <PageHeader
        title="Add New Episode"
        description="Create a new episode entry for the guide"
      />
      <EpisodeForm action={createEpisode} submitLabel="Create Episode" />
    </div>
  );
}
