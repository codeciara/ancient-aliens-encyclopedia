"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EvidenceTypeBadge, EvidenceLevelBadge } from "@/components/ui/evidence-badge";
import { ClaimForm } from "@/components/forms/claim-form";
import { createClaim, deleteClaim } from "@/lib/actions/claims";
import { EvidenceType } from "@/types";

interface Claim {
  id: string;
  statement: string;
  evidenceType: string;
  contextLevel: number;
  explanation: string | null;
  sourceText: string | null;
  notes: string | null;
}

interface ClaimsPanelProps {
  claims: Claim[];
  parentType: "episode" | "entry" | "theory";
  parentId: string;
}

export function ClaimsPanel({ claims, parentType, parentId }: ClaimsPanelProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <Card>
      <CardHeader
        title={`Claims & Evidence (${claims.length})`}
        description="Tagged assertions with evidence labels and context levels"
        action={
          <Button size="sm" variant="secondary" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-3.5 w-3.5" />
            Add Claim
          </Button>
        }
      />

      {showForm && (
        <div className="mb-4">
          <ClaimForm
            action={createClaim}
            parentType={parentType}
            parentId={parentId}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {claims.length === 0 && !showForm ? (
        <p className="text-sm text-charcoal-lighter italic">
          No claims added yet. Add claims to label the evidence presented in this content.
        </p>
      ) : (
        <div className="space-y-3">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="border border-parchment-darker rounded-md p-3 bg-white"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-charcoal flex-1">{claim.statement}</p>
                <form action={async () => { await deleteClaim(claim.id); }}>
                  <button
                    type="submit"
                    className="text-charcoal-lighter hover:text-error transition-colors p-1"
                    title="Delete claim"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>

              <div className="flex gap-2 flex-wrap mt-2">
                <EvidenceTypeBadge type={claim.evidenceType as EvidenceType} />
                <EvidenceLevelBadge level={claim.contextLevel} />
              </div>

              {claim.explanation && (
                <p className="text-xs text-charcoal-lighter mt-2 italic">{claim.explanation}</p>
              )}

              {claim.sourceText && (
                <p className="text-xs text-charcoal-lighter mt-1">
                  <span className="font-medium">Source:</span> {claim.sourceText}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
