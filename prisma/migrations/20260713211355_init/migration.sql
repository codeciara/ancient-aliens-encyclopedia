-- CreateTable
CREATE TABLE "Episode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "seasonNumber" INTEGER NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "originalAirDate" TEXT,
    "summary" TEXT,
    "centralQuestion" TEXT,
    "mainSubjects" TEXT,
    "conventionalExplanations" TEXT,
    "internalNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastReviewedAt" DATETIME
);

-- CreateTable
CREATE TABLE "EncyclopediaEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "alternateNames" TEXT,
    "category" TEXT,
    "briefOverview" TEXT,
    "historicalBackground" TEXT,
    "ancientAstronautView" TEXT,
    "mainstreamView" TEXT,
    "evidenceCited" TEXT,
    "unresolvedQuestions" TEXT,
    "internalNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastReviewedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "biography" TEXT,
    "mainTheories" TEXT,
    "publishedWorks" TEXT,
    "associatedTopics" TEXT,
    "supportAndCriticism" TEXT,
    "internalNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "region" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "civilization" TEXT,
    "historicalPeriod" TEXT,
    "knownBuilders" TEXT,
    "description" TEXT,
    "archaeologicalConsensus" TEXT,
    "ancientAstronautView" TEXT,
    "unresolvedQuestions" TEXT,
    "mapReference" TEXT,
    "internalNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Theory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT,
    "historicalContext" TEXT,
    "keyArguments" TEXT,
    "supportingEvidence" TEXT,
    "counterArguments" TEXT,
    "relatedTexts" TEXT,
    "internalNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Artifact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alternateNames" TEXT,
    "description" TEXT,
    "civilization" TEXT,
    "historicalPeriod" TEXT,
    "discoveryContext" TEXT,
    "archaeologicalConsensus" TEXT,
    "ancientAstronautView" TEXT,
    "currentLocation" TEXT,
    "internalNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Civilization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alternateNames" TEXT,
    "timeRange" TEXT,
    "region" TEXT,
    "description" TEXT,
    "notableAchievements" TEXT,
    "internalNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Deity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alternateNames" TEXT,
    "mythology" TEXT,
    "description" TEXT,
    "ancientAstronautView" TEXT,
    "internalNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AncientText" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "alternateNames" TEXT,
    "origin" TEXT,
    "civilization" TEXT,
    "approximateDate" TEXT,
    "description" TEXT,
    "relevantPassages" TEXT,
    "ancientAstronautView" TEXT,
    "scholarlyConsensus" TEXT,
    "internalNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dateDisplay" TEXT NOT NULL,
    "sortYear" INTEGER NOT NULL,
    "category" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "statement" TEXT NOT NULL,
    "evidenceType" TEXT NOT NULL,
    "contextLevel" INTEGER NOT NULL DEFAULT 1,
    "explanation" TEXT,
    "sourceText" TEXT,
    "notes" TEXT,
    "lastReviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "episodeId" TEXT,
    "entryId" TEXT,
    "theoryId" TEXT,
    CONSTRAINT "Claim_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Claim_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "EncyclopediaEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Claim_theoryId_fkey" FOREIGN KEY ("theoryId") REFERENCES "Theory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "publicationYear" INTEGER,
    "publisher" TEXT,
    "url" TEXT,
    "isbn" TEXT,
    "sourceType" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Citation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "pageNumbers" TEXT,
    "chapter" TEXT,
    "quote" TEXT,
    "note" TEXT,
    "accessDate" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "episodeId" TEXT,
    "entryId" TEXT,
    "personId" TEXT,
    "locationId" TEXT,
    "artifactId" TEXT,
    "civilizationId" TEXT,
    "deityId" TEXT,
    "ancientTextId" TEXT,
    "claimId" TEXT,
    "theoryId" TEXT,
    CONSTRAINT "Citation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Citation_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Citation_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "EncyclopediaEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Citation_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Citation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Citation_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Citation_civilizationId_fkey" FOREIGN KEY ("civilizationId") REFERENCES "Civilization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Citation_deityId_fkey" FOREIGN KEY ("deityId") REFERENCES "Deity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Citation_ancientTextId_fkey" FOREIGN KEY ("ancientTextId") REFERENCES "AncientText" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Citation_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Citation_theoryId_fkey" FOREIGN KEY ("theoryId") REFERENCES "Theory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ImageAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "altText" TEXT,
    "caption" TEXT,
    "credit" TEXT,
    "license" TEXT,
    "licenseUrl" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "fileSizeBytes" INTEGER,
    "mimeType" TEXT,
    "filePath" TEXT NOT NULL,
    "episodeId" TEXT,
    "entryId" TEXT,
    "personId" TEXT,
    "locationId" TEXT,
    "artifactId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ImageAsset_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ImageAsset_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "EncyclopediaEntry" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ImageAsset_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ImageAsset_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ImageAsset_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT
);

-- CreateTable
CREATE TABLE "TagOnEntity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tagId" TEXT NOT NULL,
    "episodeId" TEXT,
    "entryId" TEXT,
    "personId" TEXT,
    "locationId" TEXT,
    "artifactId" TEXT,
    "civilizationId" TEXT,
    "deityId" TEXT,
    "ancientTextId" TEXT,
    "theoryId" TEXT,
    "timelineEventId" TEXT,
    CONSTRAINT "TagOnEntity_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TagOnEntity_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TagOnEntity_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "EncyclopediaEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TagOnEntity_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TagOnEntity_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TagOnEntity_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TagOnEntity_civilizationId_fkey" FOREIGN KEY ("civilizationId") REFERENCES "Civilization" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TagOnEntity_deityId_fkey" FOREIGN KEY ("deityId") REFERENCES "Deity" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TagOnEntity_ancientTextId_fkey" FOREIGN KEY ("ancientTextId") REFERENCES "AncientText" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TagOnEntity_theoryId_fkey" FOREIGN KEY ("theoryId") REFERENCES "Theory" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TagOnEntity_timelineEventId_fkey" FOREIGN KEY ("timelineEventId") REFERENCES "TimelineEvent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EpisodeEntry" (
    "episodeId" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,

    PRIMARY KEY ("episodeId", "entryId"),
    CONSTRAINT "EpisodeEntry_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EpisodeEntry_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "EncyclopediaEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EpisodePerson" (
    "episodeId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "role" TEXT,

    PRIMARY KEY ("episodeId", "personId"),
    CONSTRAINT "EpisodePerson_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EpisodePerson_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EpisodeLocation" (
    "episodeId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    PRIMARY KEY ("episodeId", "locationId"),
    CONSTRAINT "EpisodeLocation_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EpisodeLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EpisodeArtifact" (
    "episodeId" TEXT NOT NULL,
    "artifactId" TEXT NOT NULL,

    PRIMARY KEY ("episodeId", "artifactId"),
    CONSTRAINT "EpisodeArtifact_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EpisodeArtifact_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EpisodeCivilization" (
    "episodeId" TEXT NOT NULL,
    "civilizationId" TEXT NOT NULL,

    PRIMARY KEY ("episodeId", "civilizationId"),
    CONSTRAINT "EpisodeCivilization_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EpisodeCivilization_civilizationId_fkey" FOREIGN KEY ("civilizationId") REFERENCES "Civilization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EntryPerson" (
    "entryId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,

    PRIMARY KEY ("entryId", "personId"),
    CONSTRAINT "EntryPerson_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "EncyclopediaEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EntryPerson_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EntryLocation" (
    "entryId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    PRIMARY KEY ("entryId", "locationId"),
    CONSTRAINT "EntryLocation_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "EncyclopediaEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EntryLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EntryArtifact" (
    "entryId" TEXT NOT NULL,
    "artifactId" TEXT NOT NULL,

    PRIMARY KEY ("entryId", "artifactId"),
    CONSTRAINT "EntryArtifact_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "EncyclopediaEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EntryArtifact_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EntryRelation" (
    "sourceId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "relationType" TEXT,

    PRIMARY KEY ("sourceId", "targetId"),
    CONSTRAINT "EntryRelation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "EncyclopediaEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EntryRelation_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "EncyclopediaEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PersonTheory" (
    "personId" TEXT NOT NULL,
    "theoryId" TEXT NOT NULL,
    "role" TEXT,

    PRIMARY KEY ("personId", "theoryId"),
    CONSTRAINT "PersonTheory_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PersonTheory_theoryId_fkey" FOREIGN KEY ("theoryId") REFERENCES "Theory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClaimArtifact" (
    "claimId" TEXT NOT NULL,
    "artifactId" TEXT NOT NULL,

    PRIMARY KEY ("claimId", "artifactId"),
    CONSTRAINT "ClaimArtifact_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClaimArtifact_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LocationArtifact" (
    "locationId" TEXT NOT NULL,
    "artifactId" TEXT NOT NULL,

    PRIMARY KEY ("locationId", "artifactId"),
    CONSTRAINT "LocationArtifact_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LocationArtifact_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LocationCivilization" (
    "locationId" TEXT NOT NULL,
    "civilizationId" TEXT NOT NULL,

    PRIMARY KEY ("locationId", "civilizationId"),
    CONSTRAINT "LocationCivilization_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LocationCivilization_civilizationId_fkey" FOREIGN KEY ("civilizationId") REFERENCES "Civilization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CivilizationDeity" (
    "civilizationId" TEXT NOT NULL,
    "deityId" TEXT NOT NULL,

    PRIMARY KEY ("civilizationId", "deityId"),
    CONSTRAINT "CivilizationDeity_civilizationId_fkey" FOREIGN KEY ("civilizationId") REFERENCES "Civilization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CivilizationDeity_deityId_fkey" FOREIGN KEY ("deityId") REFERENCES "Deity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BookEdition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "author" TEXT,
    "publisher" TEXT,
    "isbn" TEXT,
    "publicationDate" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "coverImagePath" TEXT,
    "pageSize" TEXT NOT NULL DEFAULT 'US_LETTER',
    "marginPreset" TEXT NOT NULL DEFAULT 'STANDARD',
    "mirroredMargins" BOOLEAN NOT NULL DEFAULT true,
    "bleedMm" REAL NOT NULL DEFAULT 3.0,
    "outputFormat" TEXT NOT NULL DEFAULT 'PDF',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BookChapter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "editionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "chapterType" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "isDivider" BOOLEAN NOT NULL DEFAULT false,
    "isIncluded" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BookChapter_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "BookEdition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BookChapterItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chapterId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "isIncluded" BOOLEAN NOT NULL DEFAULT true,
    "episodeId" TEXT,
    "entryId" TEXT,
    "personId" TEXT,
    "locationId" TEXT,
    "theoryId" TEXT,
    "artifactId" TEXT,
    "civilizationId" TEXT,
    "deityId" TEXT,
    "ancientTextId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BookChapterItem_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "BookChapter" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BookChapterItem_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BookChapterItem_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "EncyclopediaEntry" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BookChapterItem_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BookChapterItem_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BookChapterItem_theoryId_fkey" FOREIGN KEY ("theoryId") REFERENCES "Theory" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BookChapterItem_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BookChapterItem_civilizationId_fkey" FOREIGN KEY ("civilizationId") REFERENCES "Civilization" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BookChapterItem_deityId_fkey" FOREIGN KEY ("deityId") REFERENCES "Deity" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BookChapterItem_ancientTextId_fkey" FOREIGN KEY ("ancientTextId") REFERENCES "AncientText" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BookFrontMatter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "editionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT,
    "sortOrder" INTEGER NOT NULL,
    "isIncluded" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "BookFrontMatter_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "BookEdition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BookAppendix" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "editionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "isIncluded" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "BookAppendix_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "BookEdition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Episode_slug_key" ON "Episode"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Episode_seasonNumber_episodeNumber_key" ON "Episode"("seasonNumber", "episodeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "EncyclopediaEntry_slug_key" ON "EncyclopediaEntry"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Person_slug_key" ON "Person"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Location_slug_key" ON "Location"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Theory_slug_key" ON "Theory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Artifact_slug_key" ON "Artifact"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Civilization_slug_key" ON "Civilization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Deity_slug_key" ON "Deity"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AncientText_slug_key" ON "AncientText"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BookEdition_slug_key" ON "BookEdition"("slug");
