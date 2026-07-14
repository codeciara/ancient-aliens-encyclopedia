"use client";

import { useActionState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createSource } from "@/lib/actions/sources";

export default function NewSourcePage() {
  const [state, formAction, isPending] = useActionState(createSource, null);
  const errors = (state as { error?: Record<string, string[]> })?.error;

  return (
    <div>
      <PageHeader title="Add New Source" description="Add a book, journal, website, or other reference" />
      <form action={formAction} className="space-y-6 max-w-3xl">
        <Input label="Title" name="title" error={errors?.title?.[0]} required placeholder="Chariots of the Gods?" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Author" name="author" placeholder="Erich von Daniken" />
          <Input label="Publication Year" name="publicationYear" type="number" placeholder="1968" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Publisher" name="publisher" placeholder="Putnam" />
          <Input label="ISBN" name="isbn" placeholder="978-0-425-07481-4" />
        </div>
        <Input label="URL" name="url" placeholder="https://..." />
        <Select label="Source Type" name="sourceType" options={[{value:"",label:"Select..."},{value:"Book",label:"Book"},{value:"Journal",label:"Journal"},{value:"Website",label:"Website"},{value:"Documentary",label:"Documentary"},{value:"Academic Paper",label:"Academic Paper"},{value:"News Article",label:"News Article"},{value:"Other",label:"Other"}]} />
        <Textarea label="Notes" name="notes" rows={3} />
        <div className="flex gap-3 pt-4 border-t border-parchment-darker">
          <Button type="submit" loading={isPending}>Create Source</Button>
          <Button type="button" variant="secondary" onClick={() => window.history.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
