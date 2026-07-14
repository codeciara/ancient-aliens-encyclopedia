import { PageHeader } from "@/components/ui/page-header";
import { LocationForm } from "@/components/forms/location-form";
import { createLocation } from "@/lib/actions/locations";

export default function NewLocationPage() {
  return (
    <div>
      <PageHeader title="Add New Location" description="Add an ancient site, monument, or mysterious location" />
      <LocationForm action={createLocation} submitLabel="Create Location" />
    </div>
  );
}
