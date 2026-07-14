# The Ancient Aliens Encyclopedia — Implementation Specification

**Document Version:** 1.0  
**Date:** July 13, 2026  
**Status:** Draft — Pending Review  

---

## Table of Contents

1. [Repository Assessment](#1-repository-assessment)
2. [Existing Architecture Summary](#2-existing-architecture-summary)
3. [Gap Analysis](#3-gap-analysis)
4. [Proposed Requirements](#4-proposed-requirements)
5. [Data-Model Proposal](#5-data-model-proposal)
6. [User-Flow Proposal](#6-user-flow-proposal)
7. [Export-Engine Recommendation](#7-export-engine-recommendation)
8. [Risks and Assumptions](#8-risks-and-assumptions)
9. [Phased Task Plan](#9-phased-task-plan)

---

## 1. Repository Assessment

### Finding

**No existing codebase is available for inspection.**

- The workspace (`/projects/sandbox/`) was empty at session start.
- No GitHub repository was provided or referenced.
- The user confirmed no remote repository exists.

- A previous session may have produced work that was saved locally but not persisted to version control.
- A reference PDF ("Ancient Aliens — Encyclopedic Atlas: Glossary + Cast + Timeline + Complete Series") was provided as content reference.

### Conclusion

This specification treats the project as **greenfield** while designing for the content structure evident in the reference PDF (episodes organized by season, glossary entries, cast profiles, and chronological timeline data).

---

## 2. Existing Architecture Summary

Since no codebase exists, this section documents the **assumed prior intent** based on the user's description of "an existing Ancient Aliens encyclopedia/episode-guide project":

| Aspect | Assumed Prior State |
|--------|-------------------|
| Purpose | Episode guide + encyclopedia reference |
| Content | Episodes by season, glossary, cast, timeline |
| Format | Web application (likely React/Next.js) |
| Database | Local or file-based |
| Export | None or minimal |

### Reference PDF Content Structure Observed

The attached PDF contains:
- Complete series episode listings organized by season
- Glossary of terms
- Cast/contributor profiles
- Chronological timeline
- Cross-referenced topics

This structure directly informs the data models proposed below.

---

## 3. Gap Analysis

| Capability | Current State | Required State | Gap |
|-----------|--------------|----------------|-----|
| Data models | None | Full relational schema with 15+ entity types | Full build |
| Content admin | None | CRUD + rich editing + statuses + validation | Full build |
| Episode guide | None (PDF reference only) | Structured, searchable, relational | Full build |
| Encyclopedia A-Z | None | Alphabetical entries with cross-references | Full build |
| Evidence labels | None | Reusable label system with confidence scale | Full build |
| Book Builder | None | Edition management, chapter ordering, presets | Full build |
| PDF export | None | Professional typeset output via CSS Paged Media | Full build |
| EPUB export | None | Reflowable EPUB 3 with navigation | Full build |
| Browser preview | None | Paginated book preview | Full build |
| Search/filter | None | Multi-field search with status filters | Full build |
| Import/export | None | JSON, CSV, Markdown, backup | Full build |
| Design system | None | Archaeological/cosmic tokens + print styles | Full build |
| Testing | None | Unit, integration, export validation | Full build |
| Accessibility | None | WCAG 2.1 AA compliance | Full build |

### Summary

This is effectively a **complete new build**. No existing functionality needs to be preserved or migrated. The risk of breaking existing features is zero.

---

## 4. Proposed Requirements

### 4.1 Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Framework | Next.js 15 (App Router) | Full-stack React, server components, API routes, TypeScript-native |
| Language | TypeScript (strict) | Type safety, IDE support, refactoring confidence |
| Database | SQLite via Prisma ORM | Zero-config, file-based, portable, upgradeable to PostgreSQL |
| ORM | Prisma 6+ | Type-safe queries, migrations, schema-as-code |
| Styling | Tailwind CSS 4 + CSS Modules (print) | Utility-first for admin UI, dedicated print stylesheets |
| Rich Editor | TipTap (ProseMirror-based) | Extensible, Markdown-compatible, headless |
| PDF Engine | Paged.js + Puppeteer | CSS Paged Media standard, professional book typesetting |
| EPUB Engine | @lesjoursfr/html-to-epub | Maintained, EPUB 3 support, HTML input |
| State | React Server Components + Server Actions | Minimal client state, form handling |
| Validation | Zod | Runtime + compile-time schema validation |
| Testing | Vitest + Playwright | Unit/integration + E2E + export validation |
| Drag & Drop | @dnd-kit | Accessible, composable, React-native |

### 4.2 Functional Requirements

#### FR-1: Content Management
- FR-1.1: CRUD operations for all entity types (episodes, entries, locations, people, theories, artifacts)
- FR-1.2: Publication statuses: Draft, Review, Approved, Published, Archived
- FR-1.3: Rich-text/Markdown editing with autosave
- FR-1.4: Slug auto-generation with manual override
- FR-1.5: Tagging and category management
- FR-1.6: Source/citation management per entity
- FR-1.7: Image credit fields with license tracking
- FR-1.8: Internal notes (not exported)
- FR-1.9: Duplicate detection (title similarity, slug collision)
- FR-1.10: Bulk status changes, tagging, deletion


#### FR-2: Evidence Label System
- FR-2.1: Predefined labels: Historical Record, Archaeological Evidence, Ancient Text, Oral Tradition, Scientific Interpretation, Speculative Theory, Disputed Claim, Unresolved Mystery
- FR-2.2: Evidence Context scale (1-5, not called "truth score")
- FR-2.3: Per-claim metadata: label, explanation, source, confidence, notes, date reviewed
- FR-2.4: Reusable across all content types
- FR-2.5: Filterable in admin and rendered in exports

#### FR-3: Content Relationships
- FR-3.1: Episodes ↔ Encyclopedia entries (many-to-many)
- FR-3.2: Entries ↔ Locations (many-to-many)
- FR-3.3: Claims ↔ Artifacts (many-to-many)
- FR-3.4: People ↔ Theories (many-to-many)
- FR-3.5: Civilizations ↔ Deities, Monuments, Texts, Locations
- FR-3.6: Entries ↔ Sources (many-to-many)
- FR-3.7: Topics appearing in multiple chapters (via junction tables)
- FR-3.8: Automatic "See also" generation from relationships
- FR-3.9: Automatic index generation from entity references
- FR-3.10: Unique IDs for all entities; no content duplication

#### FR-4: Book Builder
- FR-4.1: Create/manage multiple editions and volumes
- FR-4.2: Select and arrange chapters via drag-and-drop
- FR-4.3: Add divider pages between sections
- FR-4.4: Choose front matter components to include
- FR-4.5: Choose appendix components to include
- FR-4.6: Reorder entries within chapters
- FR-4.7: Exclude unfinished/unapproved content
- FR-4.8: Cover image selection
- FR-4.9: Author, publisher, ISBN, publication date metadata
- FR-4.10: Choose PDF or EPUB output format
- FR-4.11: Save reusable publication presets
- FR-4.12: Support named editions (Volume 1, Complete Guide, Annual Update, etc.)


#### FR-5: PDF Generation
- FR-5.1: Full-color designed output
- FR-5.2: Page size presets: US Letter (8.5×11") and 6×9" trim
- FR-5.3: Configurable margins with mirrored (recto/verso) support
- FR-5.4: Bleed settings (3mm default)
- FR-5.5: Page numbers, running headers with chapter titles
- FR-5.6: Chapter title pages and section dividers
- FR-5.7: Two-column encyclopedia layout option
- FR-5.8: One- or two-page episode layouts
- FR-5.9: Tables, maps, timelines, figure captions
- FR-5.10: Footnotes or endnotes
- FR-5.11: Clickable internal links and TOC
- FR-5.12: PDF bookmarks (outline)
- FR-5.13: Cross-references resolved to page numbers
- FR-5.14: High-resolution image handling (300 DPI target)
- FR-5.15: Print-optimized and web-optimized variants
- FR-5.16: Widows/orphans control
- FR-5.17: Prevent heading/table splits across pages
- FR-5.18: Automatic index with page numbers
- FR-5.19: Browser-based print preview approximating pagination

#### FR-6: EPUB Generation
- FR-6.1: EPUB 3 reflowable format
- FR-6.2: Adjustable text size (no fixed dimensions)
- FR-6.3: Semantic headings (h1-h6 proper hierarchy)
- FR-6.4: Navigation document (NCX + nav)
- FR-6.5: Clickable table of contents
- FR-6.6: Internal cross-references (href-based, no page numbers)
- FR-6.7: Alt text on all images
- FR-6.8: Simplified responsive tables
- FR-6.9: Image captions
- FR-6.10: Full metadata: cover, author, publisher, language, date, description, subjects
- FR-6.11: EPUB accessibility metadata (WCAG references)


#### FR-7: Search and Filtering
- FR-7.1: Full-text search across titles, keywords, content
- FR-7.2: Filter by entity type, season, location, civilization, person, theory, artifact, deity, text, evidence label, status
- FR-7.3: Filter by: draft status, evidence level, missing citations, missing images, missing credits, edition inclusion, last reviewed date
- FR-7.4: Sortable results (title, date, status, last modified)
- FR-7.5: Saved filter presets

#### FR-8: Import/Export
- FR-8.1: JSON export (full project, per-entity, per-edition)
- FR-8.2: JSON import with validation
- FR-8.3: CSV import for structured tabular data
- FR-8.4: Markdown import for text-heavy content
- FR-8.5: Full project backup (database + assets)
- FR-8.6: Bibliography export (BibTeX, plain text)
- FR-8.7: Content manifest export
- FR-8.8: Validation before committing imported data
- FR-8.9: Import preview with diff display

#### FR-9: Publication Checklist
- FR-9.1: Required front matter existence check
- FR-9.2: All selected chapters approved
- FR-9.3: Citations present on all claims
- FR-9.4: Images have credits or license records
- FR-9.5: Internal links resolve
- FR-9.6: TOC generated
- FR-9.7: Indexes generated
- FR-9.8: Page breaks valid
- FR-9.9: No placeholder content remains
- FR-9.10: Export metadata complete (author, title, ISBN if applicable)

#### FR-10: Administration
- FR-10.1: Dashboard with content statistics and recent activity
- FR-10.2: Autosave with conflict detection
- FR-10.3: Preview mode (styled as final output)
- FR-10.4: Validation warnings inline and on save
- FR-10.5: Responsive admin pages (desktop-optimized, tablet-usable)

### 4.3 Non-Functional Requirements

| ID | Requirement | Target |
|----|------------|--------|
| NFR-1 | Page load time (admin) | < 2 seconds |
| NFR-2 | PDF generation (100-page book) | < 60 seconds |
| NFR-3 | EPUB generation | < 30 seconds |
| NFR-4 | Search response | < 500ms |
| NFR-5 | Autosave interval | 30 seconds |
| NFR-6 | Database size support | Up to 10,000 entries |
| NFR-7 | Image support | Up to 50MB per image |
| NFR-8 | Concurrent admin users | Single user (local-first) |
| NFR-9 | Accessibility | WCAG 2.1 AA |
| NFR-10 | Browser support | Chrome, Firefox, Safari (latest) |

---

## 5. Data-Model Proposal

### 5.1 Entity Relationship Overview

```
┌─────────────┐     ┌──────────────────┐     ┌───────────────┐
│   Episode   │────▶│ EpisodeEntry     │◀────│ Encyclopedia  │
│             │     │ (junction)       │     │ Entry         │
└─────────────┘     └──────────────────┘     └───────────────┘
       │                                            │
       │            ┌──────────────────┐            │
       ├───────────▶│ EpisodePerson    │            │
       │            └──────────────────┘            │
       │                    ▲                       │
       │                    │                       │
       │            ┌───────────────┐               │
       │            │    Person     │◀──────────────┤
       │            └───────────────┘               │
       │                    │                       │
       │            ┌───────────────┐               │
       │            │   Theory      │◀──────────────┤
       │            └───────────────┘               │
       │                                            │
       │            ┌───────────────┐               │
       ├───────────▶│   Location    │◀──────────────┤
       │            └───────────────┘               │
       │                    │                       │
       │            ┌───────────────┐               │
       │            │ Civilization  │◀──────────────┤
       │            └───────────────┘               │
       │                    │                       │
       │            ┌───────────────┐               │
       │            │   Artifact    │◀──────────────┤
       │            └───────────────┘               │
       │                                            │
       │            ┌───────────────┐               │
       └───────────▶│    Claim      │◀──────────────┘
                    │ (with label)  │
                    └───────────────┘
                            │
                    ┌───────────────┐
                    │EvidenceLabel  │
                    └───────────────┘
```

### 5.2 Core Entities (Prisma Schema)

```prisma
// ============================================================
// ENUMS
// ============================================================

enum PublicationStatus {
  DRAFT
  REVIEW
  APPROVED
  PUBLISHED
  ARCHIVED
}

enum EvidenceType {
  HISTORICAL_RECORD
  ARCHAEOLOGICAL_EVIDENCE
  ANCIENT_TEXT
  ORAL_TRADITION
  SCIENTIFIC_INTERPRETATION
  SPECULATIVE_THEORY
  DISPUTED_CLAIM
  UNRESOLVED_MYSTERY
}

enum EvidenceContextLevel {
  PRIMARILY_SPECULATIVE        // 1
  DISPUTED_INTERPRETATION      // 2
  GENUINE_UNANSWERED           // 3
  MEANINGFUL_EVIDENCE          // 4
  MAINSTREAM_ESTABLISHED       // 5
}


// ============================================================
// CONTENT ENTITIES
// ============================================================

model Episode {
  id                String            @id @default(cuid())
  slug              String            @unique
  seasonNumber      Int
  episodeNumber     Int
  title             String
  originalAirDate   DateTime?
  summary           String?           // Original summary (not copied)
  centralQuestion   String?
  mainSubjects      String?           // JSON array
  conventionalExplanations String?
  internalNotes     String?
  status            PublicationStatus  @default(DRAFT)
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  lastReviewedAt    DateTime?

  // Relations
  civilizations     EpisodeCivilization[]
  locations         EpisodeLocation[]
  artifacts         EpisodeArtifact[]
  people            EpisodePerson[]
  claims            Claim[]
  entries           EpisodeEntry[]
  citations         Citation[]
  tags              TagOnEntity[]
  images            ImageAsset[]
  bookChapterItems  BookChapterItem[]

  @@unique([seasonNumber, episodeNumber])
}

model EncyclopediaEntry {
  id                    String            @id @default(cuid())
  slug                  String            @unique
  title                 String
  alternateNames        String?           // JSON array
  category              String?
  briefOverview         String?
  historicalBackground  String?
  ancientAstronautView  String?
  mainstreamView        String?
  evidenceCited         String?
  unresolvedQuestions   String?
  internalNotes         String?
  status                PublicationStatus  @default(DRAFT)
  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt
  lastReviewedAt        DateTime?

  // Relations
  episodes        EpisodeEntry[]
  locations       EntryLocation[]
  people          EntryPerson[]
  artifacts       EntryArtifact[]
  relatedEntries  EntryRelation[]     @relation("source")
  relatedBy       EntryRelation[]     @relation("target")
  claims          Claim[]
  citations       Citation[]
  tags            TagOnEntity[]
  images          ImageAsset[]
  bookChapterItems BookChapterItem[]
}


model Person {
  id                String            @id @default(cuid())
  slug              String            @unique
  name              String
  biography         String?
  mainTheories      String?
  publishedWorks    String?           // JSON array
  associatedTopics  String?           // JSON array
  supportAndCriticism String?
  internalNotes     String?
  status            PublicationStatus  @default(DRAFT)
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  // Relations
  episodes          EpisodePerson[]
  entries           EntryPerson[]
  theories          PersonTheory[]
  citations         Citation[]
  tags              TagOnEntity[]
  images            ImageAsset[]
  bookChapterItems  BookChapterItem[]
}

model Location {
  id                    String            @id @default(cuid())
  slug                  String            @unique
  name                  String
  country               String?
  region                String?
  latitude              Float?
  longitude             Float?
  civilization          String?
  historicalPeriod      String?
  knownBuilders         String?
  description           String?
  archaeologicalConsensus String?
  ancientAstronautView  String?
  unresolvedQuestions   String?
  mapReference          String?
  internalNotes         String?
  status                PublicationStatus  @default(DRAFT)
  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt

  // Relations
  episodes          EpisodeLocation[]
  entries           EntryLocation[]
  artifacts         LocationArtifact[]
  civilizations     LocationCivilization[]
  citations         Citation[]
  tags              TagOnEntity[]
  images            ImageAsset[]
  bookChapterItems  BookChapterItem[]
}

model Theory {
  id                String            @id @default(cuid())
  slug              String            @unique
  title             String
  overview          String?
  historicalContext  String?
  keyArguments      String?
  supportingEvidence String?
  counterArguments  String?
  relatedTexts      String?           // JSON array
  internalNotes     String?
  status            PublicationStatus  @default(DRAFT)
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  // Relations
  people            PersonTheory[]
  claims            Claim[]
  citations         Citation[]
  tags              TagOnEntity[]
  bookChapterItems  BookChapterItem[]
}


model Artifact {
  id                    String            @id @default(cuid())
  slug                  String            @unique
  name                  String
  alternateNames        String?           // JSON array
  description           String?
  civilization          String?
  historicalPeriod      String?
  discoveryContext      String?
  archaeologicalConsensus String?
  ancientAstronautView  String?
  currentLocation       String?
  internalNotes         String?
  status                PublicationStatus  @default(DRAFT)
  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt

  // Relations
  episodes          EpisodeArtifact[]
  entries           EntryArtifact[]
  locations         LocationArtifact[]
  claims            ClaimArtifact[]
  citations         Citation[]
  tags              TagOnEntity[]
  images            ImageAsset[]
  bookChapterItems  BookChapterItem[]
}

model Civilization {
  id                String            @id @default(cuid())
  slug              String            @unique
  name              String
  alternateNames    String?           // JSON array
  timeRange         String?
  region            String?
  description       String?
  notableAchievements String?
  internalNotes     String?
  status            PublicationStatus  @default(DRAFT)
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  // Relations
  episodes          EpisodeCivilization[]
  locations         LocationCivilization[]
  deities           CivilizationDeity[]
  citations         Citation[]
  tags              TagOnEntity[]
  bookChapterItems  BookChapterItem[]
}

model Deity {
  id                String            @id @default(cuid())
  slug              String            @unique
  name              String
  alternateNames    String?           // JSON array
  mythology         String?
  description       String?
  ancientAstronautView String?
  internalNotes     String?
  status            PublicationStatus  @default(DRAFT)
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  // Relations
  civilizations     CivilizationDeity[]
  citations         Citation[]
  tags              TagOnEntity[]
  bookChapterItems  BookChapterItem[]
}


model AncientText {
  id                String            @id @default(cuid())
  slug              String            @unique
  title             String
  alternateNames    String?           // JSON array
  origin            String?
  civilization      String?
  approximateDate   String?
  description       String?
  relevantPassages  String?
  ancientAstronautView String?
  scholarlyConsensus String?
  internalNotes     String?
  status            PublicationStatus  @default(DRAFT)
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  // Relations
  citations         Citation[]
  tags              TagOnEntity[]
  bookChapterItems  BookChapterItem[]
}

// ============================================================
// EVIDENCE & CLAIMS
// ============================================================

model Claim {
  id                String              @id @default(cuid())
  statement         String
  evidenceType      EvidenceType
  contextLevel      EvidenceContextLevel
  explanation       String?
  sourceText        String?
  notes             String?
  lastReviewedAt    DateTime?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt

  // Parent references (polymorphic via nullable FKs)
  episodeId         String?
  episode           Episode?            @relation(fields: [episodeId], references: [id])
  entryId           String?
  entry             EncyclopediaEntry?  @relation(fields: [entryId], references: [id])
  theoryId          String?
  theory            Theory?             @relation(fields: [theoryId], references: [id])

  // Relations
  artifacts         ClaimArtifact[]
  citations         Citation[]
}


// ============================================================
// CITATIONS & SOURCES
// ============================================================

model Source {
  id            String      @id @default(cuid())
  title         String
  author        String?
  publicationYear Int?
  publisher     String?
  url           String?
  isbn          String?
  sourceType    String?     // Book, Journal, Website, Documentary, etc.
  notes         String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  citations     Citation[]
}

model Citation {
  id            String      @id @default(cuid())
  sourceId      String
  source        Source      @relation(fields: [sourceId], references: [id])
  pageNumbers   String?
  chapter       String?
  quote         String?     // Brief attributed quote only
  note          String?
  accessDate    DateTime?

  // Polymorphic parent (nullable FKs)
  episodeId     String?
  episode       Episode?    @relation(fields: [episodeId], references: [id])
  entryId       String?
  entry         EncyclopediaEntry? @relation(fields: [entryId], references: [id])
  personId      String?
  person        Person?     @relation(fields: [personId], references: [id])
  locationId    String?
  location      Location?   @relation(fields: [locationId], references: [id])
  artifactId    String?
  artifact      Artifact?   @relation(fields: [artifactId], references: [id])
  civilizationId String?
  civilization  Civilization? @relation(fields: [civilizationId], references: [id])
  deityId       String?
  deity         Deity?      @relation(fields: [deityId], references: [id])
  ancientTextId String?
  ancientText   AncientText? @relation(fields: [ancientTextId], references: [id])
  claimId       String?
  claim         Claim?      @relation(fields: [claimId], references: [id])
  theoryId      String?
  theory        Theory?     @relation(fields: [theoryId], references: [id])

  createdAt     DateTime    @default(now())
}


// ============================================================
// IMAGES & ASSETS
// ============================================================

model ImageAsset {
  id            String      @id @default(cuid())
  filename      String
  altText       String?
  caption       String?
  credit        String?
  license       String?
  licenseUrl    String?
  width         Int?
  height        Int?
  fileSizeBytes Int?
  mimeType      String?
  filePath      String

  // Polymorphic parent
  episodeId     String?
  episode       Episode?    @relation(fields: [episodeId], references: [id])
  entryId       String?
  entry         EncyclopediaEntry? @relation(fields: [entryId], references: [id])
  personId      String?
  person        Person?     @relation(fields: [personId], references: [id])
  locationId    String?
  location      Location?   @relation(fields: [locationId], references: [id])
  artifactId    String?
  artifact      Artifact?   @relation(fields: [artifactId], references: [id])

  createdAt     DateTime    @default(now())
}

// ============================================================
// TAGGING
// ============================================================

model Tag {
  id        String        @id @default(cuid())
  name      String        @unique
  slug      String        @unique
  category  String?       // Topic, Period, Region, etc.
  entities  TagOnEntity[]
}

model TagOnEntity {
  id            String      @id @default(cuid())
  tagId         String
  tag           Tag         @relation(fields: [tagId], references: [id])

  // Polymorphic
  episodeId     String?
  episode       Episode?    @relation(fields: [episodeId], references: [id])
  entryId       String?
  entry         EncyclopediaEntry? @relation(fields: [entryId], references: [id])
  personId      String?
  person        Person?     @relation(fields: [personId], references: [id])
  locationId    String?
  location      Location?   @relation(fields: [locationId], references: [id])
  artifactId    String?
  artifact      Artifact?   @relation(fields: [artifactId], references: [id])

  @@unique([tagId, episodeId])
  @@unique([tagId, entryId])
  @@unique([tagId, personId])
  @@unique([tagId, locationId])
  @@unique([tagId, artifactId])
}


// ============================================================
// JUNCTION TABLES (Many-to-Many)
// ============================================================

model EpisodeEntry {
  episodeId   String
  episode     Episode           @relation(fields: [episodeId], references: [id])
  entryId     String
  entry       EncyclopediaEntry @relation(fields: [entryId], references: [id])
  @@id([episodeId, entryId])
}

model EpisodePerson {
  episodeId   String
  episode     Episode   @relation(fields: [episodeId], references: [id])
  personId    String
  person      Person    @relation(fields: [personId], references: [id])
  role        String?   // "Commentator", "Subject", etc.
  @@id([episodeId, personId])
}

model EpisodeLocation {
  episodeId   String
  episode     Episode   @relation(fields: [episodeId], references: [id])
  locationId  String
  location    Location  @relation(fields: [locationId], references: [id])
  @@id([episodeId, locationId])
}

model EpisodeArtifact {
  episodeId   String
  episode     Episode   @relation(fields: [episodeId], references: [id])
  artifactId  String
  artifact    Artifact  @relation(fields: [artifactId], references: [id])
  @@id([episodeId, artifactId])
}

model EpisodeCivilization {
  episodeId       String
  episode         Episode       @relation(fields: [episodeId], references: [id])
  civilizationId  String
  civilization    Civilization  @relation(fields: [civilizationId], references: [id])
  @@id([episodeId, civilizationId])
}

model EntryLocation {
  entryId     String
  entry       EncyclopediaEntry @relation(fields: [entryId], references: [id])
  locationId  String
  location    Location          @relation(fields: [locationId], references: [id])
  @@id([entryId, locationId])
}

model EntryPerson {
  entryId     String
  entry       EncyclopediaEntry @relation(fields: [entryId], references: [id])
  personId    String
  person      Person            @relation(fields: [personId], references: [id])
  @@id([entryId, personId])
}

model EntryArtifact {
  entryId     String
  entry       EncyclopediaEntry @relation(fields: [entryId], references: [id])
  artifactId  String
  artifact    Artifact          @relation(fields: [artifactId], references: [id])
  @@id([entryId, artifactId])
}

model EntryRelation {
  sourceId    String
  source      EncyclopediaEntry @relation("source", fields: [sourceId], references: [id])
  targetId    String
  target      EncyclopediaEntry @relation("target", fields: [targetId], references: [id])
  relationType String?          // "See also", "Contrast", "Subtopic"
  @@id([sourceId, targetId])
}

model PersonTheory {
  personId    String
  person      Person    @relation(fields: [personId], references: [id])
  theoryId    String
  theory      Theory    @relation(fields: [theoryId], references: [id])
  role        String?   // "Proponent", "Critic", "Researcher"
  @@id([personId, theoryId])
}

model ClaimArtifact {
  claimId     String
  claim       Claim     @relation(fields: [claimId], references: [id])
  artifactId  String
  artifact    Artifact  @relation(fields: [artifactId], references: [id])
  @@id([claimId, artifactId])
}

model LocationArtifact {
  locationId  String
  location    Location  @relation(fields: [locationId], references: [id])
  artifactId  String
  artifact    Artifact  @relation(fields: [artifactId], references: [id])
  @@id([locationId, artifactId])
}

model LocationCivilization {
  locationId      String
  location        Location      @relation(fields: [locationId], references: [id])
  civilizationId  String
  civilization    Civilization  @relation(fields: [civilizationId], references: [id])
  @@id([locationId, civilizationId])
}

model CivilizationDeity {
  civilizationId  String
  civilization    Civilization  @relation(fields: [civilizationId], references: [id])
  deityId         String
  deity           Deity         @relation(fields: [deityId], references: [id])
  @@id([civilizationId, deityId])
}
```


### 5.3 Book Builder Models

```prisma
// ============================================================
// BOOK BUILDER
// ============================================================

model BookEdition {
  id                String      @id @default(cuid())
  title             String
  subtitle          String?
  slug              String      @unique
  description       String?
  author            String?
  publisher         String?
  isbn              String?
  publicationDate   DateTime?
  language          String      @default("en")
  coverImagePath    String?
  pageSize          String      @default("US_LETTER") // US_LETTER, TRIM_6x9
  marginPreset      String      @default("STANDARD")
  mirroredMargins   Boolean     @default(true)
  bleedMm           Float       @default(3.0)
  outputFormat      String      @default("PDF")       // PDF, EPUB, BOTH
  status            PublicationStatus @default(DRAFT)
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  // Relations
  chapters          BookChapter[]
  frontMatter       BookFrontMatter[]
  appendices        BookAppendix[]
  presets           PublicationPreset[]
}

model BookChapter {
  id            String          @id @default(cuid())
  editionId     String
  edition       BookEdition     @relation(fields: [editionId], references: [id], onDelete: Cascade)
  title         String
  subtitle      String?
  chapterType   String          // EPISODE_GUIDE, ENCYCLOPEDIA, THEORY, PEOPLE, LOCATIONS, CUSTOM
  sortOrder     Int
  isDivider     Boolean         @default(false)
  isIncluded    Boolean         @default(true)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  items         BookChapterItem[]
}

model BookChapterItem {
  id            String          @id @default(cuid())
  chapterId     String
  chapter       BookChapter     @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  sortOrder     Int
  isIncluded    Boolean         @default(true)

  // Polymorphic content reference
  episodeId     String?
  episode       Episode?        @relation(fields: [episodeId], references: [id])
  entryId       String?
  entry         EncyclopediaEntry? @relation(fields: [entryId], references: [id])
  personId      String?
  person        Person?         @relation(fields: [personId], references: [id])
  locationId    String?
  location      Location?       @relation(fields: [locationId], references: [id])
  theoryId      String?
  theory        Theory?         @relation(fields: [theoryId], references: [id])
  artifactId    String?
  artifact      Artifact?       @relation(fields: [artifactId], references: [id])
  civilizationId String?
  civilization  Civilization?   @relation(fields: [civilizationId], references: [id])
  deityId       String?
  deity         Deity?          @relation(fields: [deityId], references: [id])
  ancientTextId String?
  ancientText   AncientText?    @relation(fields: [ancientTextId], references: [id])

  createdAt     DateTime        @default(now())
}

model BookFrontMatter {
  id            String      @id @default(cuid())
  editionId     String
  edition       BookEdition @relation(fields: [editionId], references: [id], onDelete: Cascade)
  type          String      // COVER, TITLE_PAGE, COPYRIGHT, DISCLAIMER, DEDICATION, PREFACE, INTRODUCTION, HOW_TO_USE, EVIDENCE_EXPLANATION, TOC
  content       String?     // Custom content override
  sortOrder     Int
  isIncluded    Boolean     @default(true)
}

model BookAppendix {
  id            String      @id @default(cuid())
  editionId     String
  edition       BookEdition @relation(fields: [editionId], references: [id], onDelete: Cascade)
  type          String      // TIMELINE, EPISODE_INDEX, SUBJECT_INDEX, LOCATION_INDEX, CIVILIZATION_INDEX, RESEARCHER_INDEX, ARTIFACT_INDEX, DEITY_INDEX, ANCIENT_TEXT_INDEX, BIBLIOGRAPHY, IMAGE_CREDITS, GLOSSARY
  sortOrder     Int
  isIncluded    Boolean     @default(true)
}

model PublicationPreset {
  id            String      @id @default(cuid())
  name          String
  editionId     String
  edition       BookEdition @relation(fields: [editionId], references: [id], onDelete: Cascade)
  settings      String      // JSON blob of all export settings
  createdAt     DateTime    @default(now())
}
```

### 5.4 Timeline Model

```prisma
model TimelineEvent {
  id            String      @id @default(cuid())
  title         String
  description   String?
  dateDisplay   String      // "2500 BCE", "c. 10000 BCE", etc.
  sortYear      Int         // Numeric for sorting (negative = BCE)
  category      String?     // Archaeological, Mythological, Modern, etc.
  status        PublicationStatus @default(DRAFT)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  tags          TagOnEntity[]
}
```

---

## 6. User-Flow Proposal

### 6.1 Application Routes (Next.js App Router)

```
/                           → Dashboard
/episodes                   → Episode list (filterable, sortable)
/episodes/new               → Create episode
/episodes/[slug]            → View/edit episode
/encyclopedia               → Encyclopedia entry list (A-Z browsing)
/encyclopedia/new           → Create entry
/encyclopedia/[slug]        → View/edit entry
/locations                  → Location list + map view
/locations/new              → Create location
/locations/[slug]           → View/edit location
/people                     → People/researchers list
/people/new                 → Create person
/people/[slug]              → View/edit person
/theories                   → Theories & themes list
/theories/new               → Create theory
/theories/[slug]            → View/edit theory
/artifacts                  → Artifacts list
/artifacts/new              → Create artifact
/artifacts/[slug]           → View/edit artifact
/civilizations              → Civilizations list
/civilizations/[slug]       → View/edit civilization
/deities                    → Deities list
/deities/[slug]             → View/edit deity
/texts                      → Ancient texts list
/texts/[slug]               → View/edit ancient text
/timeline                   → Timeline view/management
/sources                    → Source/citation library
/sources/new                → Add source
/tags                       → Tag management
/book-builder               → Book editions list
/book-builder/[id]          → Edition editor (chapters, ordering)
/book-builder/[id]/preview  → Browser book preview
/book-builder/[id]/checklist → Publication checklist
/book-builder/[id]/export   → Export (PDF/EPUB generation)
/import                     → Import wizard
/export                     → Bulk export tools
/search                     → Global search
/settings                   → Application settings
```

### 6.2 Core User Flows

#### Flow 1: Content Creation
```
Dashboard → Select entity type → Fill form → Add relationships →
Add claims with evidence labels → Add citations → Save as Draft →
Review → Approve → Available for book inclusion
```

#### Flow 2: Book Assembly
```
Book Builder → Create Edition → Add metadata →
Select front matter → Create/arrange chapters →
Add content items to chapters (drag-drop) →
Configure page layout → Run publication checklist →
Fix validation issues → Export PDF/EPUB
```

#### Flow 3: PDF Export
```
Edition ready → Choose export settings (page size, margins) →
Generate HTML from content → Apply Paged.js CSS →
Render in Puppeteer → Generate TOC + indexes →
Resolve cross-references → Output PDF → Download
```

#### Flow 4: Import
```
Import page → Select format (JSON/CSV/MD) → Upload file →
Validate structure → Preview parsed data → Show warnings →
Map fields → Confirm → Commit to database
```

### 6.3 Dashboard Widgets

- Total content count by type and status
- Recently modified items
- Items pending review
- Publication checklist summary per edition
- Content with missing citations
- Content with missing image credits
- Quick-create buttons for all entity types

---

## 7. Export-Engine Recommendation

### 7.1 PDF Engine Comparison

| Criterion | Paged.js + Puppeteer | @react-pdf/renderer | PDFKit | Prince XML |
|-----------|---------------------|---------------------|--------|-----------|
| **CSS Paged Media support** | Full polyfill | None | None | Native |
| **Running headers/footers** | Yes (CSS) | Manual | Manual | Yes |
| **Multi-column layout** | Yes (CSS columns) | No | No | Yes |
| **Footnotes** | Yes (CSS footnotes) | No | Manual | Yes |
| **Widows/orphans** | Yes | No | No | Yes |
| **Page break control** | Full (break-before/after/inside) | Manual | Manual | Full |
| **Cross-references with page numbers** | Yes (target-counter) | No | No | Yes |
| **Bookmarks/outlines** | Via Puppeteer | Yes | Yes | Yes |
| **Clickable TOC** | Yes | Yes | Manual | Yes |
| **Image quality** | High (full Chrome rendering) | Good | Good | High |
| **Existing web skills reusable** | Yes (HTML+CSS) | Partial (JSX subset) | No (API-driven) | Yes |
| **License** | MIT (Paged.js) + Apache (Puppeteer) | MIT | MIT | Commercial ($$$) |
| **Maintenance** | Active | Active | Active | Active |
| **Learning curve** | Low (CSS) | Medium (custom API) | High | Low |
| **Cost** | Free | Free | Free | $3,800+/year |

### 7.2 PDF Engine Decision

**Selected: Paged.js + Puppeteer**

**Rationale:**
1. Uses standard CSS Paged Media specifications — the W3C standard for print formatting
2. HTML/CSS skills transfer directly; no proprietary API to learn
3. Full support for book-quality typesetting: running headers, footnotes, multi-column, widows/orphans
4. Browser-based preview works with the same CSS (preview ≈ final output)
5. Free and open-source (MIT + Apache licenses)
6. Active maintenance with growing community
7. Can be replaced later with Prince XML if budget allows (same CSS input)

**Architecture:**
```
Content (DB) → HTML Templates → Paged.js CSS → 
  ├── Browser Preview (Paged.js in-browser)
  └── PDF Export (Paged.js + Puppeteer headless)
```

### 7.3 EPUB Engine Comparison

| Criterion | @lesjoursfr/html-to-epub | epub-gen-memory | nodepub |
|-----------|------------------------|-----------------|---------|
| **EPUB version** | 2 and 3 | 3 | 2 only |
| **Input format** | HTML | HTML | HTML |
| **Image handling** | Auto-download + embed | In-memory | Manual |
| **Metadata support** | Full | Full | Basic |
| **Maintenance** | Active (2025 releases) | Active | Active |
| **Dependencies** | Moderate | Minimal (JSZip) | Minimal |
| **License** | MIT | MIT | MIT |
| **TypeScript** | Yes | Yes | No |
| **Cover support** | Yes | Yes | Yes |
| **TOC generation** | Auto | Auto | Manual |

### 7.4 EPUB Engine Decision

**Selected: @lesjoursfr/html-to-epub**

**Rationale:**
1. Maintained fork with active 2025 releases
2. EPUB 3 support (required for modern readers and accessibility)
3. TypeScript definitions included
4. Handles image embedding automatically
5. Generates navigation documents
6. HTML input aligns with our content rendering pipeline (same HTML used for preview and PDF)

**Alternative considered:** `epub-gen-memory` is lighter-weight and could work in-browser, but `@lesjoursfr/html-to-epub` has better EPUB 3 metadata support and is more actively maintained with a clear issue/PR history.

### 7.5 Abstraction Layer

Both engines will be accessed through an abstraction layer:

```typescript
// lib/export/types.ts
interface ExportEngine {
  generate(content: BookContent, options: ExportOptions): Promise<Buffer>;
  validate(content: BookContent): ValidationResult;
  getCapabilities(): EngineCapabilities;
}

// lib/export/pdf-engine.ts
class PagedJsPdfEngine implements ExportEngine { ... }

// lib/export/epub-engine.ts  
class HtmlToEpubEngine implements ExportEngine { ... }
```

This allows swapping engines (e.g., to Prince XML for PDF or epub-gen-memory for EPUB) without changing application code.

---

## 8. Risks and Assumptions

### 8.1 Assumptions

| # | Assumption | Impact if Wrong |
|---|-----------|-----------------|
| A1 | Single administrator (no multi-user auth needed) | Would need to add authentication, RBAC, conflict resolution |
| A2 | Local-first deployment (dev machine or single server) | Cloud deployment would need different DB, file storage |
| A3 | Content volume: <10,000 entries, <500 episodes | SQLite may need PostgreSQL upgrade at scale |
| A4 | Images stored on local filesystem | Cloud would need S3/equivalent |
| A5 | No real-time collaboration needed | Would need WebSocket/CRDT if multiple editors |
| A6 | English-language primary (with i18n structure for future) | Full i18n would add significant complexity |
| A7 | PDF generation can run synchronously (user waits) | Large books may need background job queue |
| A8 | The reference PDF content will be manually entered/imported | No automated OCR/scraping of the PDF |
| A9 | No external API consumers initially | Would need REST/GraphQL API layer |
| A10 | Node.js 20+ runtime available | Puppeteer requires recent Node |

### 8.2 Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| R1 | Paged.js CSS incompatibilities with complex layouts | Medium | Medium | Test each layout type early; fallback CSS for unsupported features |
| R2 | Puppeteer memory issues with 500+ page books | Medium | High | Chunk generation by chapter; stream pages; set memory limits |
| R3 | EPUB reader inconsistencies (Kindle, Kobo, Apple Books) | High | Medium | Test across readers; use minimal CSS; progressive enhancement |
| R4 | SQLite write contention during concurrent operations | Low | Low | Single-user assumption; can add WAL mode |
| R5 | Large image files slow down generation | Medium | Medium | Image optimization pipeline; resolution variants |
| R6 | Paged.js target-counter (cross-refs) unreliable | Medium | Medium | Fallback to section-based references; test early |
| R7 | Scope creep from extensive feature list | High | High | Strict phase adherence; defer nice-to-haves |
| R8 | Font licensing for print output | Medium | Medium | Use open-source fonts (Source Serif, Inter) |
| R9 | Content enters as unstructured text, hard to relate | Medium | Medium | Validation on save; relationship suggestions |
| R10 | Browser preview differs from final PDF | Medium | Low | Same CSS pipeline; accept minor pagination differences |

### 8.3 Out of Scope (Deferred)

- Multi-user authentication and authorization
- Cloud deployment infrastructure
- Mobile application
- Public-facing website generation
- Automated content scraping or AI generation
- Payment processing or e-commerce
- Print-on-demand integration
- Translation/localization
- API for third-party consumers
- Real-time collaborative editing

---

## 9. Phased Task Plan

### Phase 1: Foundation & Data Models
**Goal:** Establish project structure, database schema, and core content CRUD

| Task | Description | Deliverable |
|------|------------|-------------|
| 1.1 | Initialize Next.js 15 project with TypeScript strict mode | Working `next dev` |
| 1.2 | Configure Tailwind CSS 4 with design tokens | Token file + base styles |
| 1.3 | Set up Prisma with SQLite, create full schema | `schema.prisma` + initial migration |
| 1.4 | Create Zod validation schemas matching Prisma models | `lib/validations/` |
| 1.5 | Build reusable form components (input, textarea, select, rich-text, date) | `components/ui/` |
| 1.6 | Create Episode CRUD (form, list, detail, server actions) | `/episodes` routes working |
| 1.7 | Create Encyclopedia Entry CRUD | `/encyclopedia` routes working |
| 1.8 | Create Location CRUD | `/locations` routes working |
| 1.9 | Create Person CRUD | `/people` routes working |
| 1.10 | Create Theory CRUD | `/theories` routes working |
| 1.11 | Create Artifact, Civilization, Deity, Ancient Text CRUD | All entity routes working |
| 1.12 | Implement Evidence Label system + Claim management | Claims with labels on episodes/entries |
| 1.13 | Implement Citation/Source management | Source library + per-entity citations |
| 1.14 | Implement relationship management (junction table UI) | Link entities together |
| 1.15 | Implement Tag system | Tag CRUD + tagging on all entities |
| 1.16 | Implement Image asset management with credit tracking | Upload, metadata, credit fields |
| 1.17 | Implement autosave | Debounced saves on all edit forms |
| 1.18 | Seed database with template records (clearly marked) | 20-30 episodes, 75-100 entries, etc. |

**Estimated effort:** Large (primary phase)  
**Dependencies:** None  
**Exit criteria:** All entity types have working CRUD, relationships can be created, evidence labels function

### Phase 2: Book Builder & Publication Workflow
**Goal:** Edition management, chapter organization, status workflow, preview

| Task | Description | Deliverable |
|------|------------|-------------|
| 2.1 | Create Book Edition CRUD | `/book-builder` routes |
| 2.2 | Implement Chapter management with drag-and-drop ordering | `@dnd-kit` integration |
| 2.3 | Implement content item selection and ordering within chapters | Item-level drag-drop |
| 2.4 | Build front matter configuration UI | Toggleable front matter types |
| 2.5 | Build appendix configuration UI | Toggleable appendix types |
| 2.6 | Implement publication status workflow (Draft→Review→Approved→Published) | Status transitions + validation |
| 2.7 | Build Publication Checklist with automated validation | Checklist page with pass/fail |
| 2.8 | Create browser-based book preview (HTML rendering) | `/book-builder/[id]/preview` |
| 2.9 | Implement publication presets (save/load) | Preset CRUD |
| 2.10 | Build Dashboard | Statistics, recent activity, warnings |

**Estimated effort:** Medium  
**Dependencies:** Phase 1 complete  
**Exit criteria:** Can create editions, arrange chapters, preview in browser, pass checklist


### Phase 3: PDF Generation
**Goal:** Professional-quality PDF output with full book typesetting

| Task | Description | Deliverable |
|------|------------|-------------|
| 3.1 | Install and configure Paged.js + Puppeteer | Working generation pipeline |
| 3.2 | Create CSS Paged Media stylesheets (page sizes, margins, headers) | Print CSS system |
| 3.3 | Build HTML templates for front matter pages | Cover, title, copyright, TOC templates |
| 3.4 | Build HTML templates for episode guide pages | 1-2 page episode layouts |
| 3.5 | Build HTML templates for encyclopedia pages (2-column option) | A-Z entry layouts |
| 3.6 | Build HTML templates for people, locations, theories | Profile page layouts |
| 3.7 | Build chapter title pages and section dividers | Decorative separator pages |
| 3.8 | Implement automatic TOC generation with page numbers | Generated TOC with links |
| 3.9 | Implement automatic index generation | Subject, location, person indexes |
| 3.10 | Implement cross-references with page numbers | target-counter CSS |
| 3.11 | Implement footnotes/endnotes rendering | CSS footnotes or endnote collection |
| 3.12 | Implement PDF bookmarks/outline via Puppeteer | Navigable PDF outline |
| 3.13 | Implement print-optimized and web-optimized variants | Two output modes |
| 3.14 | Implement image handling (resolution, placement, captions) | Image optimization + layout |
| 3.15 | Test widows/orphans and page-break control | CSS refinement |
| 3.16 | Build export progress UI with download | `/book-builder/[id]/export` |

**Estimated effort:** Large  
**Dependencies:** Phase 2 complete  
**Exit criteria:** Can generate a complete multi-chapter PDF with TOC, indexes, page numbers, and professional typesetting

### Phase 4: EPUB Generation
**Goal:** Reflowable EPUB 3 output suitable for all major e-readers

| Task | Description | Deliverable |
|------|------------|-------------|
| 4.1 | Install and configure @lesjoursfr/html-to-epub | Working EPUB pipeline |
| 4.2 | Create EPUB-specific HTML templates (simplified layout) | Reflowable chapter HTML |
| 4.3 | Create EPUB CSS (minimal, reader-friendly) | Responsive EPUB styles |
| 4.4 | Implement navigation document generation | NCX + nav |
| 4.5 | Implement EPUB table of contents | Clickable TOC |
| 4.6 | Implement internal cross-references (href-based, no page numbers) | Working links |
| 4.7 | Implement image embedding with alt text and captions | Accessible images |
| 4.8 | Implement responsive table simplification for e-readers | Scrollable/stacked tables |
| 4.9 | Add EPUB metadata (author, publisher, language, subjects, etc.) | Full OPF metadata |
| 4.10 | Add accessibility metadata (WCAG, a11y features declaration) | EPUB a11y conformance |
| 4.11 | Test across readers (Apple Books structure, Calibre validation) | Validation report |
| 4.12 | Build EPUB export UI alongside PDF | Format selector in export |

**Estimated effort:** Medium  
**Dependencies:** Phase 3 complete (shared HTML pipeline)  
**Exit criteria:** Valid EPUB 3 that passes epubcheck, opens correctly in major readers


### Phase 5: Import/Export, Testing & Polish
**Goal:** Data portability, validation, comprehensive tests, documentation

| Task | Description | Deliverable |
|------|------------|-------------|
| 5.1 | Implement JSON import with validation and preview | Import wizard |
| 5.2 | Implement JSON export (full project + per-entity) | Export page |
| 5.3 | Implement CSV import for tabular data | CSV parser + field mapper |
| 5.4 | Implement Markdown import | MD parser for text content |
| 5.5 | Implement full project backup (DB + assets zip) | Backup/restore flow |
| 5.6 | Implement bibliography export (BibTeX, plain text) | Bibliography formatter |
| 5.7 | Build global search with multi-field filtering | `/search` page |
| 5.8 | Implement advanced filters (missing citations, status, etc.) | Filter sidebar on lists |
| 5.9 | Implement bulk editing (multi-select + action) | Bulk operations UI |
| 5.10 | Add comprehensive form validation with accessible error messages | Zod + aria-invalid |
| 5.11 | Implement keyboard navigation and focus management | Tab order, skip links |
| 5.12 | Write unit tests for data models and validation | Vitest test suite |
| 5.13 | Write integration tests for CRUD operations | API route tests |
| 5.14 | Write export validation tests (PDF structure, EPUB validity) | Export test suite |
| 5.15 | Create sample test data (fictional, clearly marked) | Seed script |
| 5.16 | Write E2E tests for critical flows | Playwright tests |
| 5.17 | Performance optimization (lazy loading, pagination) | Sub-2s page loads |
| 5.18 | Documentation (README, architecture, deployment guide) | Docs |

**Estimated effort:** Medium-Large  
**Dependencies:** Phases 1-4 complete  
**Exit criteria:** All tests pass, import/export works, search functional, documented

---

## 10. Design System Summary

### 10.1 Color Palette (Design Tokens)

```css
:root {
  /* Primary */
  --color-charcoal: #2d2d2d;
  --color-charcoal-light: #3d3d3d;
  --color-parchment: #f4f0e8;
  --color-parchment-dark: #e8e2d6;
  
  /* Accents */
  --color-gold: #b8960c;
  --color-gold-muted: #c4a94d;
  --color-sandstone: #c9a96e;
  --color-deep-blue: #1a2744;
  --color-night-sky: #0f1b2d;
  
  /* Semantic */
  --color-success: #2d6a4f;
  --color-warning: #b8860b;
  --color-error: #8b0000;
  --color-info: #2c5282;
  
  /* Evidence Context Levels */
  --color-evidence-1: #8b4513;  /* Speculative - warm brown */
  --color-evidence-2: #b8860b;  /* Disputed - amber */
  --color-evidence-3: #4a6741;  /* Unanswered - sage */
  --color-evidence-4: #2c5282;  /* Meaningful - deep blue */
  --color-evidence-5: #1a4731;  /* Established - deep green */
}
```

### 10.2 Typography

| Role | Font | Fallback | Weight |
|------|------|----------|--------|
| Display headings | Source Serif 4 | Georgia, serif | 700 |
| Body headings | Source Serif 4 | Georgia, serif | 600 |
| Body text | Source Sans 3 | system-ui, sans-serif | 400 |
| Captions/labels | Source Sans 3 | system-ui, sans-serif | 500 |
| Monospace (code/IDs) | JetBrains Mono | monospace | 400 |
| Print body | Source Serif 4 | Georgia, serif | 400 |

### 10.3 Spacing Scale

```
--space-1: 0.25rem (4px)
--space-2: 0.5rem (8px)
--space-3: 0.75rem (12px)
--space-4: 1rem (16px)
--space-5: 1.5rem (24px)
--space-6: 2rem (32px)
--space-7: 3rem (48px)
--space-8: 4rem (64px)
--space-9: 6rem (96px)
```

### 10.4 Component Tokens

- **Callout boxes:** Parchment background, gold left border, serif heading
- **Evidence labels:** Colored pill badges matching evidence-level palette
- **Tables:** Alternating parchment/white rows, charcoal header
- **Section dividers:** Thin gold rule with optional star-map motif
- **Page headers (print):** Small caps, charcoal, thin bottom border
- **Figure captions:** Italic, smaller size, centered below image

---

## 11. Project Structure

```
ancient-aliens-encyclopedia/
├── .kiro/
│   └── specs/
│       └── IMPLEMENTATION_SPEC.md    (this document)
├── prisma/
│   ├── schema.prisma                 (database schema)
│   ├── migrations/                   (migration history)
│   └── seed.ts                       (template seed data)
├── public/
│   ├── fonts/                        (Source Serif, Source Sans, etc.)
│   ├── images/                       (app assets, decorative elements)
│   └── uploads/                      (user-uploaded content images)
├── src/
│   ├── app/                          (Next.js App Router)
│   │   ├── layout.tsx                (root layout)
│   │   ├── page.tsx                  (dashboard)
│   │   ├── episodes/
│   │   ├── encyclopedia/
│   │   ├── locations/
│   │   ├── people/
│   │   ├── theories/
│   │   ├── artifacts/
│   │   ├── civilizations/
│   │   ├── deities/
│   │   ├── texts/
│   │   ├── timeline/
│   │   ├── sources/
│   │   ├── tags/
│   │   ├── book-builder/
│   │   ├── import/
│   │   ├── export/
│   │   ├── search/
│   │   ├── settings/
│   │   └── api/                      (API routes for export, etc.)
│   ├── components/
│   │   ├── ui/                       (reusable primitives)
│   │   ├── forms/                    (entity-specific forms)
│   │   ├── layouts/                  (page layouts, navigation)
│   │   ├── book-preview/             (browser preview components)
│   │   └── export/                   (export progress, settings)
│   ├── lib/
│   │   ├── db.ts                     (Prisma client singleton)
│   │   ├── validations/              (Zod schemas)
│   │   ├── actions/                  (Server Actions)
│   │   ├── export/
│   │   │   ├── types.ts             (ExportEngine interface)
│   │   │   ├── pdf-engine.ts        (Paged.js + Puppeteer)
│   │   │   ├── epub-engine.ts       (html-to-epub)
│   │   │   ├── html-renderer.ts     (content → HTML)
│   │   │   ├── toc-generator.ts     (table of contents)
│   │   │   └── index-generator.ts   (index generation)
│   │   ├── templates/
│   │   │   ├── pdf/                  (PDF HTML templates)
│   │   │   └── epub/                 (EPUB HTML templates)
│   │   ├── import/                   (JSON/CSV/MD parsers)
│   │   ├── search/                   (search utilities)
│   │   └── utils/                    (slug, date, formatting)
│   ├── styles/
│   │   ├── globals.css               (Tailwind + tokens)
│   │   ├── print/
│   │   │   ├── paged-media.css      (CSS Paged Media rules)
│   │   │   ├── book-layout.css      (chapter, TOC, index styles)
│   │   │   └── typography.css       (print typography)
│   │   └── epub/
│   │       └── epub-styles.css      (EPUB-specific CSS)
│   └── types/                        (TypeScript type definitions)
├── tests/
│   ├── unit/                         (Vitest unit tests)
│   ├── integration/                  (API/action tests)
│   └── e2e/                          (Playwright E2E tests)
├── .env.example                      (environment variable template)
├── .gitignore
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## 12. Legal & Content Compliance

### 12.1 Disclaimer (Front Matter)

The following disclaimer will appear in the front matter of every exported edition:

> **INDEPENDENT PUBLICATION NOTICE**
>
> This is an independent reference work. It is not endorsed by, affiliated with,
> authorized by, or connected in any way to the History Channel, A+E Networks,
> Prometheus Entertainment, or any producers, participants, or distributors of
> the Ancient Aliens television program.
>
> All original commentary, summaries, and analysis in this work represent the
> views of the author(s). Episode descriptions are original summaries written
> for reference purposes. No transcripts, copyrighted descriptions, or
> unauthorized media are reproduced herein.
>
> Trademarks and program titles are the property of their respective owners and
> are used solely for identification and reference purposes.

### 12.2 Content Rules (Enforced in Application)

- No full episode transcripts stored
- No copyrighted descriptions imported without admin confirmation
- Image assets require credit + license fields (enforced by validation)
- Citations required for factual claims (warned by publication checklist)
- Source attribution fields on all entities
- "Original summary" field label reminds admin to write original text
- Publication checklist blocks export if image credits are missing

---

## 13. Dependencies (Initial)

### Production

| Package | Purpose | License |
|---------|---------|---------|
| next@15 | Full-stack React framework | MIT |
| react@19 | UI library | MIT |
| typescript@5 | Type safety | Apache-2.0 |
| @prisma/client | Database ORM client | Apache-2.0 |
| tailwindcss@4 | Utility CSS | MIT |
| zod | Validation | MIT |
| @tiptap/react + extensions | Rich text editor | MIT |
| @dnd-kit/core + sortable | Drag and drop | MIT |
| pagedjs | CSS Paged Media polyfill | MIT |
| puppeteer | Headless Chrome for PDF | Apache-2.0 |
| @lesjoursfr/html-to-epub | EPUB 3 generation | MIT |
| slugify | Slug generation | MIT |
| date-fns | Date formatting | MIT |
| lucide-react | Icons | ISC |

### Development

| Package | Purpose | License |
|---------|---------|---------|
| prisma | ORM CLI + migrations | Apache-2.0 |
| vitest | Unit/integration testing | MIT |
| @playwright/test | E2E testing | Apache-2.0 |
| @types/* | TypeScript definitions | MIT |
| eslint + config | Code quality | MIT |
| prettier | Formatting | MIT |

### No Cloud Services Required

This project runs entirely locally:
- SQLite file database (no cloud DB)
- Local filesystem for images (no S3)
- Puppeteer runs locally (no cloud PDF service)
- No authentication service needed (single admin)

---

## 14. Open Questions for Review

Before implementation begins, please confirm:

1. **Single admin assumption** — Is this correct, or do multiple people need to edit simultaneously?
2. **Deployment target** — Will this run on your local machine only, or should it be deployable to a server?
3. **Content from PDF** — Should I create an import script to parse the attached PDF, or will content be entered manually?
4. **Font licensing** — Are Source Serif 4 and Source Sans 3 (Google Fonts, OFL license) acceptable for the book?
5. **Phase priority** — Should I proceed with Phase 1 immediately after approval, or do you want to adjust the phased plan?
6. **GitHub repository** — Shall I initialize a GitHub repo for version control from the start?
7. **Rich text format** — TipTap editor stores content as JSON. Should Markdown be the primary authoring format instead (stored as text, rendered for export)?

---

## 15. Approval

**This specification requires your approval before implementation begins.**

Please review and confirm:
- [ ] Technology stack acceptable
- [ ] Data model covers all needed entities
- [ ] Export engine choice approved
- [ ] Phase ordering acceptable
- [ ] Design direction approved
- [ ] Open questions answered

---

*Document prepared by Kiro — July 13, 2026*
*Next step: Await review, then begin Phase 1 implementation*
