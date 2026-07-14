import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database with template records...");
  console.log("NOTE: All entries are TEMPLATES - clearly marked as placeholders.");

  // Sources
  const source1 = await prisma.source.create({
    data: { title: "[TEMPLATE] Chariots of the Gods?", author: "Erich von Daniken", publicationYear: 1968, publisher: "Putnam", sourceType: "Book" },
  });
  const source2 = await prisma.source.create({
    data: { title: "[TEMPLATE] Fingerprints of the Gods", author: "Graham Hancock", publicationYear: 1995, publisher: "Crown", sourceType: "Book" },
  });
  const source3 = await prisma.source.create({
    data: { title: "[TEMPLATE] The Sirius Mystery", author: "Robert Temple", publicationYear: 1976, publisher: "Sidgwick & Jackson", sourceType: "Book" },
  });

  // Episodes (Season 1 templates)
  const episodes = [
    { seasonNumber: 1, episodeNumber: 1, title: "[TEMPLATE] The Evidence", slug: "s01e01-the-evidence", originalAirDate: "2010-04-20", summary: "[TEMPLATE - Replace with original summary] This episode explores the foundational evidence cited by ancient astronaut theorists.", centralQuestion: "Is there physical evidence of extraterrestrial visitation in Earth's ancient past?" },
    { seasonNumber: 1, episodeNumber: 2, title: "[TEMPLATE] The Visitors", slug: "s01e02-the-visitors", originalAirDate: "2010-04-27", summary: "[TEMPLATE - Replace with original summary] Examines accounts of alien visitors in ancient cultures.", centralQuestion: "Did ancient civilizations have contact with beings from other worlds?" },
    { seasonNumber: 1, episodeNumber: 3, title: "[TEMPLATE] The Mission", slug: "s01e03-the-mission", originalAirDate: "2010-05-04", summary: "[TEMPLATE - Replace with original summary] Explores the possible purpose behind alleged alien visits.", centralQuestion: "What was the purpose of extraterrestrial contact with early humans?" },
    { seasonNumber: 1, episodeNumber: 4, title: "[TEMPLATE] Closer Encounters", slug: "s01e04-closer-encounters", originalAirDate: "2010-05-11", summary: "[TEMPLATE - Replace with original summary] Investigates ancient accounts that parallel modern UFO encounters." },
    { seasonNumber: 1, episodeNumber: 5, title: "[TEMPLATE] The Return", slug: "s01e05-the-return", originalAirDate: "2010-05-25", summary: "[TEMPLATE - Replace with original summary] Examines prophecies and predictions of extraterrestrial return." },
  ];

  for (const ep of episodes) {
    await prisma.episode.create({ data: { ...ep, status: "DRAFT" } });
  }

  // Encyclopedia Entries (templates)
  const entries = [
    { title: "[TEMPLATE] Great Pyramid of Giza", slug: "great-pyramid-of-giza", category: "Monument", briefOverview: "[TEMPLATE] The largest of the three pyramids on the Giza Plateau." },
    { title: "[TEMPLATE] Nazca Lines", slug: "nazca-lines", category: "Geoglyph", briefOverview: "[TEMPLATE] Ancient geoglyphs in the Nazca Desert of southern Peru." },
    { title: "[TEMPLATE] Puma Punku", slug: "puma-punku", category: "Monument", briefOverview: "[TEMPLATE] Megalithic site near Tiwanaku, Bolivia." },
    { title: "[TEMPLATE] Vimana", slug: "vimana", category: "Concept", briefOverview: "[TEMPLATE] Flying vehicles described in ancient Indian texts." },
    { title: "[TEMPLATE] Anunnaki", slug: "anunnaki", category: "Beings", briefOverview: "[TEMPLATE] Deities in ancient Sumerian mythology." },
    { title: "[TEMPLATE] Crystal Skulls", slug: "crystal-skulls", category: "Artifact", briefOverview: "[TEMPLATE] Quartz crystal carvings of human skulls." },
    { title: "[TEMPLATE] Stonehenge", slug: "stonehenge", category: "Monument", briefOverview: "[TEMPLATE] Prehistoric stone circle in Wiltshire, England." },
    { title: "[TEMPLATE] Machu Picchu", slug: "machu-picchu", category: "Monument", briefOverview: "[TEMPLATE] Incan citadel in the Andes Mountains of Peru." },
    { title: "[TEMPLATE] Easter Island Moai", slug: "easter-island-moai", category: "Monument", briefOverview: "[TEMPLATE] Monolithic human figures on Rapa Nui." },
    { title: "[TEMPLATE] Baghdad Battery", slug: "baghdad-battery", category: "Artifact", briefOverview: "[TEMPLATE] Ancient electrochemical cell found near Baghdad." },
  ];

  for (const entry of entries) {
    await prisma.encyclopediaEntry.create({ data: { ...entry, status: "DRAFT" } });
  }

  // Locations (templates)
  const locations = [
    { name: "[TEMPLATE] Giza Plateau", slug: "giza-plateau", country: "Egypt", region: "Greater Cairo", latitude: 29.9792, longitude: 31.1342, historicalPeriod: "c. 2560 BCE" },
    { name: "[TEMPLATE] Nazca Desert", slug: "nazca-desert", country: "Peru", region: "Ica", latitude: -14.735, longitude: -75.13, historicalPeriod: "500 BCE - 500 CE" },
    { name: "[TEMPLATE] Tiwanaku", slug: "tiwanaku", country: "Bolivia", region: "La Paz", latitude: -16.5553, longitude: -68.6733, historicalPeriod: "c. 300 - 1000 CE" },
    { name: "[TEMPLATE] Gobekli Tepe", slug: "gobekli-tepe", country: "Turkey", region: "Southeastern Anatolia", latitude: 37.2233, longitude: 38.9225, historicalPeriod: "c. 9500 BCE" },
    { name: "[TEMPLATE] Baalbek", slug: "baalbek", country: "Lebanon", region: "Beqaa Valley", latitude: 34.0065, longitude: 36.2042, historicalPeriod: "c. 7000 BCE - Roman era" },
  ];

  for (const loc of locations) {
    await prisma.location.create({ data: { ...loc, status: "DRAFT" } });
  }

  // People (templates)
  const people = [
    { name: "[TEMPLATE] Erich von Daniken", slug: "erich-von-daniken", biography: "[TEMPLATE] Swiss author of Chariots of the Gods? (1968)." },
    { name: "[TEMPLATE] Giorgio A. Tsoukalos", slug: "giorgio-tsoukalos", biography: "[TEMPLATE] Publisher of Legendary Times magazine and Ancient Aliens presenter." },
    { name: "[TEMPLATE] Graham Hancock", slug: "graham-hancock", biography: "[TEMPLATE] British writer and journalist, author of Fingerprints of the Gods." },
    { name: "[TEMPLATE] Zecharia Sitchin", slug: "zecharia-sitchin", biography: "[TEMPLATE] Author of The 12th Planet and the Earth Chronicles series." },
    { name: "[TEMPLATE] David Childress", slug: "david-childress", biography: "[TEMPLATE] Author and publisher specializing in alternative history." },
  ];

  for (const person of people) {
    await prisma.person.create({ data: { ...person, status: "DRAFT" } });
  }

  // Theories (templates)
  const theories = [
    { title: "[TEMPLATE] Ancient Astronaut Theory", slug: "ancient-astronaut-theory", overview: "[TEMPLATE] The hypothesis that extraterrestrial beings visited Earth in antiquity and influenced human civilizations." },
    { title: "[TEMPLATE] Lost Advanced Civilizations", slug: "lost-advanced-civilizations", overview: "[TEMPLATE] The idea that technologically advanced human civilizations existed before recorded history." },
    { title: "[TEMPLATE] Genetic Manipulation", slug: "genetic-manipulation", overview: "[TEMPLATE] The claim that extraterrestrials genetically engineered or modified early humans." },
    { title: "[TEMPLATE] Megalithic Engineering", slug: "megalithic-engineering", overview: "[TEMPLATE] Questions about how ancient peoples built massive stone structures." },
    { title: "[TEMPLATE] Ancient Flying Machines", slug: "ancient-flying-machines", overview: "[TEMPLATE] References to aircraft and flight in ancient texts and art." },
  ];

  for (const theory of theories) {
    await prisma.theory.create({ data: { ...theory, status: "DRAFT" } });
  }

  // Artifacts (templates)
  const artifacts = [
    { name: "[TEMPLATE] Antikythera Mechanism", slug: "antikythera-mechanism", civilization: "Ancient Greek", historicalPeriod: "c. 100 BCE" },
    { name: "[TEMPLATE] Dendera Light", slug: "dendera-light", civilization: "Ancient Egyptian", historicalPeriod: "c. 50 BCE" },
    { name: "[TEMPLATE] Saqqara Bird", slug: "saqqara-bird", civilization: "Ancient Egyptian", historicalPeriod: "c. 200 BCE" },
    { name: "[TEMPLATE] Tolima Artifacts", slug: "tolima-artifacts", civilization: "Pre-Columbian", historicalPeriod: "c. 500-800 CE" },
    { name: "[TEMPLATE] Iron Pillar of Delhi", slug: "iron-pillar-of-delhi", civilization: "Gupta Empire", historicalPeriod: "c. 402 CE" },
  ];

  for (const artifact of artifacts) {
    await prisma.artifact.create({ data: { ...artifact, status: "DRAFT" } });
  }

  // Civilizations (templates)
  const civilizations = [
    { name: "[TEMPLATE] Sumerian", slug: "sumerian", timeRange: "c. 4500-1900 BCE", region: "Mesopotamia" },
    { name: "[TEMPLATE] Ancient Egyptian", slug: "ancient-egyptian", timeRange: "c. 3100-30 BCE", region: "Nile Valley" },
    { name: "[TEMPLATE] Maya", slug: "maya", timeRange: "c. 2000 BCE-1500 CE", region: "Mesoamerica" },
    { name: "[TEMPLATE] Inca", slug: "inca", timeRange: "c. 1400-1533 CE", region: "Andes, South America" },
    { name: "[TEMPLATE] Indus Valley", slug: "indus-valley", timeRange: "c. 3300-1300 BCE", region: "South Asia" },
  ];

  for (const civ of civilizations) {
    await prisma.civilization.create({ data: { ...civ, status: "DRAFT" } });
  }

  // Deities (templates)
  const deities = [
    { name: "[TEMPLATE] Enki", slug: "enki", mythology: "Sumerian", description: "[TEMPLATE] God of water, knowledge, and creation." },
    { name: "[TEMPLATE] Ra", slug: "ra", mythology: "Egyptian", description: "[TEMPLATE] Sun god who traveled the sky in a solar barque." },
    { name: "[TEMPLATE] Quetzalcoatl", slug: "quetzalcoatl", mythology: "Aztec/Mesoamerican", description: "[TEMPLATE] Feathered serpent deity." },
    { name: "[TEMPLATE] Viracocha", slug: "viracocha", mythology: "Inca", description: "[TEMPLATE] Creator deity who emerged from Lake Titicaca." },
    { name: "[TEMPLATE] Thoth", slug: "thoth", mythology: "Egyptian", description: "[TEMPLATE] God of wisdom, writing, and magic." },
  ];

  for (const deity of deities) {
    await prisma.deity.create({ data: { ...deity, status: "DRAFT" } });
  }

  // Ancient Texts (templates)
  const texts = [
    { title: "[TEMPLATE] Epic of Gilgamesh", slug: "epic-of-gilgamesh", civilization: "Sumerian/Babylonian", approximateDate: "c. 2100 BCE" },
    { title: "[TEMPLATE] Book of Enoch", slug: "book-of-enoch", civilization: "Jewish/Ethiopian", approximateDate: "c. 300-100 BCE" },
    { title: "[TEMPLATE] Mahabharata", slug: "mahabharata", civilization: "Indian", approximateDate: "c. 400 BCE" },
    { title: "[TEMPLATE] Popol Vuh", slug: "popol-vuh", civilization: "Maya", approximateDate: "c. 1554-1558 CE (written)" },
    { title: "[TEMPLATE] Egyptian Book of the Dead", slug: "egyptian-book-of-the-dead", civilization: "Egyptian", approximateDate: "c. 1550 BCE" },
  ];

  for (const text of texts) {
    await prisma.ancientText.create({ data: { ...text, status: "DRAFT" } });
  }

  // Tags
  const tags = [
    "Pyramids", "Megalithic", "Flight", "Genetics", "Star Maps",
    "Underground", "Sacred Geometry", "Energy", "Portal", "Flood",
    "Giants", "Elongated Skulls", "Gold", "Crystal", "Mars",
  ];

  for (const tag of tags) {
    await prisma.tag.create({
      data: { name: tag, slug: tag.toLowerCase().replace(/\s+/g, "-") },
    });
  }

  console.log("Seed complete!");
  console.log("Created:");
  console.log(`  - ${episodes.length} episode templates`);
  console.log(`  - ${entries.length} encyclopedia entry templates`);
  console.log(`  - ${locations.length} location templates`);
  console.log(`  - ${people.length} people templates`);
  console.log(`  - ${theories.length} theory templates`);
  console.log(`  - ${artifacts.length} artifact templates`);
  console.log(`  - ${civilizations.length} civilization templates`);
  console.log(`  - ${deities.length} deity templates`);
  console.log(`  - ${texts.length} ancient text templates`);
  console.log(`  - ${tags.length} tags`);
  console.log(`  - 3 source templates`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
