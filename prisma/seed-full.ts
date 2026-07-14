import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import slugify from "slugify";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

function generateSlug(text: string): string {
  return slugify(text, { lower: true, strict: true, trim: true });
}

interface EpisodeData {
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  originalAirDate: string;
}

// All Ancient Aliens episodes - factual reference data (titles and air dates)
const allEpisodes: EpisodeData[] = [

  // Season 1 (2010)
  { seasonNumber: 1, episodeNumber: 1, title: "The Evidence", originalAirDate: "2010-04-20" },
  { seasonNumber: 1, episodeNumber: 2, title: "The Visitors", originalAirDate: "2010-04-27" },
  { seasonNumber: 1, episodeNumber: 3, title: "The Mission", originalAirDate: "2010-05-04" },
  { seasonNumber: 1, episodeNumber: 4, title: "Closer Encounters", originalAirDate: "2010-05-18" },
  { seasonNumber: 1, episodeNumber: 5, title: "The Return", originalAirDate: "2010-05-25" },

  // Season 2 (2010)
  { seasonNumber: 2, episodeNumber: 1, title: "Mysterious Places", originalAirDate: "2010-10-28" },
  { seasonNumber: 2, episodeNumber: 2, title: "Gods & Aliens", originalAirDate: "2010-11-04" },
  { seasonNumber: 2, episodeNumber: 3, title: "Underwater Worlds", originalAirDate: "2010-11-11" },
  { seasonNumber: 2, episodeNumber: 4, title: "Underground Aliens", originalAirDate: "2010-11-18" },
  { seasonNumber: 2, episodeNumber: 5, title: "Aliens and the Third Reich", originalAirDate: "2010-11-25" },
  { seasonNumber: 2, episodeNumber: 6, title: "Alien Tech", originalAirDate: "2010-12-02" },
  { seasonNumber: 2, episodeNumber: 7, title: "Angels and Aliens", originalAirDate: "2010-12-09" },
  { seasonNumber: 2, episodeNumber: 8, title: "Unexplained Structures", originalAirDate: "2010-12-16" },
  { seasonNumber: 2, episodeNumber: 9, title: "Alien Devastations", originalAirDate: "2010-12-23" },
  { seasonNumber: 2, episodeNumber: 10, title: "Alien Contacts", originalAirDate: "2010-12-30" },

  // Season 3 (2011)
  { seasonNumber: 3, episodeNumber: 1, title: "Aliens and the Old West", originalAirDate: "2011-07-28" },
  { seasonNumber: 3, episodeNumber: 2, title: "Aliens and Monsters", originalAirDate: "2011-08-04" },
  { seasonNumber: 3, episodeNumber: 3, title: "Aliens and Sacred Places", originalAirDate: "2011-08-11" },
  { seasonNumber: 3, episodeNumber: 4, title: "Aliens and Temples of Gold", originalAirDate: "2011-08-18" },
  { seasonNumber: 3, episodeNumber: 5, title: "Aliens and Mysterious Rituals", originalAirDate: "2011-08-25" },
  { seasonNumber: 3, episodeNumber: 6, title: "Aliens and Ancient Engineers", originalAirDate: "2011-09-01" },
  { seasonNumber: 3, episodeNumber: 7, title: "Aliens, Plagues and Epidemics", originalAirDate: "2011-09-08" },
  { seasonNumber: 3, episodeNumber: 8, title: "Aliens and Lost Worlds", originalAirDate: "2011-09-15" },
  { seasonNumber: 3, episodeNumber: 9, title: "Aliens and Deadly Weapons", originalAirDate: "2011-09-22" },
  { seasonNumber: 3, episodeNumber: 10, title: "Aliens and Evil Places", originalAirDate: "2011-09-28" },
  { seasonNumber: 3, episodeNumber: 11, title: "Aliens and the Founding Fathers", originalAirDate: "2011-10-05" },
  { seasonNumber: 3, episodeNumber: 12, title: "Aliens and Deadly Cults", originalAirDate: "2011-10-12" },
  { seasonNumber: 3, episodeNumber: 13, title: "Aliens and the Secret Code", originalAirDate: "2011-10-19" },
  { seasonNumber: 3, episodeNumber: 14, title: "Aliens and the Undead", originalAirDate: "2011-10-26" },
  { seasonNumber: 3, episodeNumber: 15, title: "Aliens, Gods and Heroes", originalAirDate: "2011-11-16" },
  { seasonNumber: 3, episodeNumber: 16, title: "Aliens and the Creation of Man", originalAirDate: "2011-11-23" },

  // Season 4 (2012)
  { seasonNumber: 4, episodeNumber: 1, title: "The Mayan Conspiracy", originalAirDate: "2012-02-17" },
  { seasonNumber: 4, episodeNumber: 2, title: "The Doomsday Prophecies", originalAirDate: "2012-02-17" },
  { seasonNumber: 4, episodeNumber: 3, title: "The Greys", originalAirDate: "2012-02-24" },
  { seasonNumber: 4, episodeNumber: 4, title: "Aliens and Mega-Disasters", originalAirDate: "2012-03-02" },
  { seasonNumber: 4, episodeNumber: 5, title: "The NASA Connection", originalAirDate: "2012-03-09" },
  { seasonNumber: 4, episodeNumber: 6, title: "The Mystery of Puma Punku", originalAirDate: "2012-03-16" },
  { seasonNumber: 4, episodeNumber: 7, title: "Aliens and Bigfoot", originalAirDate: "2012-03-23" },
  { seasonNumber: 4, episodeNumber: 8, title: "The Da Vinci Conspiracy", originalAirDate: "2012-04-06" },
  { seasonNumber: 4, episodeNumber: 9, title: "The Time Travelers", originalAirDate: "2012-04-27" },
  { seasonNumber: 4, episodeNumber: 10, title: "Aliens and Dinosaurs", originalAirDate: "2012-05-04" },

  // Season 5 (2012-2013)
  { seasonNumber: 5, episodeNumber: 1, title: "Secrets of the Pyramids", originalAirDate: "2012-12-21" },
  { seasonNumber: 5, episodeNumber: 2, title: "Aliens and Cover-Ups", originalAirDate: "2012-12-28" },
  { seasonNumber: 5, episodeNumber: 3, title: "Alien Power Plants", originalAirDate: "2013-01-04" },
  { seasonNumber: 5, episodeNumber: 4, title: "Destination Orion", originalAirDate: "2013-01-11" },
  { seasonNumber: 5, episodeNumber: 5, title: "The Einstein Factor", originalAirDate: "2013-01-18" },
  { seasonNumber: 5, episodeNumber: 6, title: "Secrets of the Tombs", originalAirDate: "2013-01-25" },
  { seasonNumber: 5, episodeNumber: 7, title: "Prophets and Prophecies", originalAirDate: "2013-02-08" },
  { seasonNumber: 5, episodeNumber: 8, title: "Beyond Nazca", originalAirDate: "2013-02-15" },
  { seasonNumber: 5, episodeNumber: 9, title: "Strange Abductions", originalAirDate: "2013-02-22" },
  { seasonNumber: 5, episodeNumber: 10, title: "The von Daniken Legacy", originalAirDate: "2013-04-05" },
  { seasonNumber: 5, episodeNumber: 11, title: "The Viking Gods", originalAirDate: "2013-04-12" },
  { seasonNumber: 5, episodeNumber: 12, title: "The Monoliths", originalAirDate: "2013-04-19" },

  // Season 6 (2013)
  { seasonNumber: 6, episodeNumber: 1, title: "The Power of Three", originalAirDate: "2013-09-30" },
  { seasonNumber: 6, episodeNumber: 2, title: "The Crystal Skulls", originalAirDate: "2013-10-07" },
  { seasonNumber: 6, episodeNumber: 3, title: "The Anunnaki Connection", originalAirDate: "2013-10-14" },
  { seasonNumber: 6, episodeNumber: 4, title: "Magic of the Gods", originalAirDate: "2013-10-21" },
  { seasonNumber: 6, episodeNumber: 5, title: "The Satan Conspiracy", originalAirDate: "2013-10-28" },
  { seasonNumber: 6, episodeNumber: 6, title: "Alien Operations", originalAirDate: "2013-11-01" },
  { seasonNumber: 6, episodeNumber: 7, title: "Emperors, Kings and Pharaohs", originalAirDate: "2013-11-08" },
  { seasonNumber: 6, episodeNumber: 8, title: "Mysterious Relics", originalAirDate: "2013-11-15" },
  { seasonNumber: 6, episodeNumber: 9, title: "Aliens and Forbidden Islands", originalAirDate: "2013-11-29" },
  { seasonNumber: 6, episodeNumber: 10, title: "Aliens and the Lost Ark", originalAirDate: "2013-12-06" },
  { seasonNumber: 6, episodeNumber: 11, title: "Aliens and Mysterious Mountains", originalAirDate: "2013-12-13" },

  // Season 7 (2014)
  { seasonNumber: 7, episodeNumber: 1, title: "Aliens and Stargates", originalAirDate: "2014-01-24" },
  { seasonNumber: 7, episodeNumber: 2, title: "Aliens in America", originalAirDate: "2014-01-31" },
  { seasonNumber: 7, episodeNumber: 3, title: "The Star Children", originalAirDate: "2014-02-07" },
  { seasonNumber: 7, episodeNumber: 4, title: "Treasures of the Gods", originalAirDate: "2014-02-14" },
  { seasonNumber: 7, episodeNumber: 5, title: "Aliens and the Red Planet", originalAirDate: "2014-02-21" },
  { seasonNumber: 7, episodeNumber: 6, title: "The Shamans", originalAirDate: "2014-02-28" },
  { seasonNumber: 7, episodeNumber: 7, title: "Aliens and Insects", originalAirDate: "2014-03-07" },
  { seasonNumber: 7, episodeNumber: 8, title: "Alien Breeders", originalAirDate: "2014-03-14" },

  // Season 8 (2014)
  { seasonNumber: 8, episodeNumber: 1, title: "Alien Transports", originalAirDate: "2014-06-13" },
  { seasonNumber: 8, episodeNumber: 2, title: "Mysterious Structures", originalAirDate: "2014-06-20" },
  { seasonNumber: 8, episodeNumber: 3, title: "Mysterious Devices", originalAirDate: "2014-06-27" },
  { seasonNumber: 8, episodeNumber: 4, title: "Faces of the Gods", originalAirDate: "2014-07-25" },
  { seasonNumber: 8, episodeNumber: 5, title: "The Reptilians", originalAirDate: "2014-07-25" },
  { seasonNumber: 8, episodeNumber: 6, title: "The Tesla Experiment", originalAirDate: "2014-08-01" },
  { seasonNumber: 8, episodeNumber: 7, title: "The God Particle", originalAirDate: "2014-08-08" },
  { seasonNumber: 8, episodeNumber: 8, title: "Alien Encounters", originalAirDate: "2014-08-15" },
  { seasonNumber: 8, episodeNumber: 9, title: "Aliens and Superheroes", originalAirDate: "2014-08-22" },

  // Season 9 (2014-2015)
  { seasonNumber: 9, episodeNumber: 1, title: "Forbidden Caves", originalAirDate: "2014-10-31" },
  { seasonNumber: 9, episodeNumber: 2, title: "Mysteries of the Sphinx", originalAirDate: "2014-11-07" },
  { seasonNumber: 9, episodeNumber: 3, title: "Aliens Among Us", originalAirDate: "2014-11-14" },
  { seasonNumber: 9, episodeNumber: 4, title: "The Genius Factor", originalAirDate: "2014-11-21" },
  { seasonNumber: 9, episodeNumber: 5, title: "Secrets of the Mummies", originalAirDate: "2014-11-28" },
  { seasonNumber: 9, episodeNumber: 6, title: "Alien Resurrections", originalAirDate: "2014-12-05" },
  { seasonNumber: 9, episodeNumber: 7, title: "Alien Messages", originalAirDate: "2014-12-19" },
  { seasonNumber: 9, episodeNumber: 8, title: "The Great Flood", originalAirDate: "2014-12-23" },
  { seasonNumber: 9, episodeNumber: 9, title: "Aliens and the Civil War", originalAirDate: "2015-04-10" },
  { seasonNumber: 9, episodeNumber: 10, title: "Hidden Pyramids", originalAirDate: "2015-04-17" },
  { seasonNumber: 9, episodeNumber: 11, title: "The Vanishings", originalAirDate: "2015-04-24" },
  { seasonNumber: 9, episodeNumber: 12, title: "The Alien Agenda", originalAirDate: "2015-05-01" },

  // Season 10 (2015)
  { seasonNumber: 10, episodeNumber: 1, title: "Aliens B.C.", originalAirDate: "2015-07-24" },
  { seasonNumber: 10, episodeNumber: 2, title: "NASA's Secret Agenda", originalAirDate: "2015-07-31" },
  { seasonNumber: 10, episodeNumber: 3, title: "Aliens and Robots", originalAirDate: "2015-08-07" },
  { seasonNumber: 10, episodeNumber: 4, title: "Dark Forces", originalAirDate: "2015-08-14" },
  { seasonNumber: 10, episodeNumber: 5, title: "The Alien Evolution", originalAirDate: "2015-08-21" },
  { seasonNumber: 10, episodeNumber: 6, title: "The Other Earth", originalAirDate: "2015-08-28" },
  { seasonNumber: 10, episodeNumber: 7, title: "Creatures of the Deep", originalAirDate: "2015-09-04" },
  { seasonNumber: 10, episodeNumber: 8, title: "Circles from the Sky", originalAirDate: "2015-09-18" },
  { seasonNumber: 10, episodeNumber: 9, title: "The Alien Wars", originalAirDate: "2015-10-02" },
  { seasonNumber: 10, episodeNumber: 10, title: "The Forbidden Zones", originalAirDate: "2015-10-09" },

  // Season 11 (2016)
  { seasonNumber: 11, episodeNumber: 1, title: "Pyramids of Antarctica", originalAirDate: "2016-05-06" },
  { seasonNumber: 11, episodeNumber: 2, title: "Destination Mars", originalAirDate: "2016-05-13" },
  { seasonNumber: 11, episodeNumber: 3, title: "The Next Humans", originalAirDate: "2016-05-20" },
  { seasonNumber: 11, episodeNumber: 4, title: "The New Evidence", originalAirDate: "2016-05-27" },
  { seasonNumber: 11, episodeNumber: 5, title: "The Visionaries", originalAirDate: "2016-06-10" },
  { seasonNumber: 11, episodeNumber: 6, title: "Decoding the Cosmic Egg", originalAirDate: "2016-06-17" },
  { seasonNumber: 11, episodeNumber: 7, title: "The Wisdom Keepers", originalAirDate: "2016-06-24" },
  { seasonNumber: 11, episodeNumber: 8, title: "The Mysterious Nine", originalAirDate: "2016-07-08" },
  { seasonNumber: 11, episodeNumber: 9, title: "The Hidden Empire", originalAirDate: "2016-07-15" },
  { seasonNumber: 11, episodeNumber: 10, title: "The Prototypes", originalAirDate: "2016-07-22" },
  { seasonNumber: 11, episodeNumber: 11, title: "Space Station Moon", originalAirDate: "2016-07-29" },
  { seasonNumber: 11, episodeNumber: 12, title: "Russia's Secret Files", originalAirDate: "2016-08-12" },
  { seasonNumber: 11, episodeNumber: 13, title: "Beyond Roswell", originalAirDate: "2016-08-19" },
  { seasonNumber: 11, episodeNumber: 14, title: "The Returned", originalAirDate: "2016-08-26" },
  { seasonNumber: 11, episodeNumber: 15, title: "Shiva the Destroyer", originalAirDate: "2016-09-02" },

  // Season 12 (2017)
  { seasonNumber: 12, episodeNumber: 1, title: "The Alien Hunters", originalAirDate: "2017-04-28" },
  { seasonNumber: 12, episodeNumber: 2, title: "Forged by the Gods", originalAirDate: "2017-05-05" },
  { seasonNumber: 12, episodeNumber: 3, title: "The Mystery of Rudloe Manor", originalAirDate: "2017-05-12" },
  { seasonNumber: 12, episodeNumber: 4, title: "The Alien Architects", originalAirDate: "2017-05-19" },
  { seasonNumber: 12, episodeNumber: 5, title: "The Pharaohs' Curse", originalAirDate: "2017-05-26" },
  { seasonNumber: 12, episodeNumber: 6, title: "The Science Wars", originalAirDate: "2017-06-02" },
  { seasonNumber: 12, episodeNumber: 7, title: "City of the Gods", originalAirDate: "2017-06-09" },
  { seasonNumber: 12, episodeNumber: 8, title: "The Alien Frequency", originalAirDate: "2017-06-16" },
  { seasonNumber: 12, episodeNumber: 9, title: "The Majestic Twelve", originalAirDate: "2017-07-07" },
  { seasonNumber: 12, episodeNumber: 10, title: "The Akashic Record", originalAirDate: "2017-07-14" },
  { seasonNumber: 12, episodeNumber: 11, title: "Voices of the Gods", originalAirDate: "2017-07-21" },
  { seasonNumber: 12, episodeNumber: 12, title: "The Animal Agenda", originalAirDate: "2017-07-28" },
  { seasonNumber: 12, episodeNumber: 13, title: "The Replicants", originalAirDate: "2017-08-04" },
  { seasonNumber: 12, episodeNumber: 14, title: "A Spaceship Made of Stone", originalAirDate: "2017-08-11" },
  { seasonNumber: 12, episodeNumber: 15, title: "The Alien Disks", originalAirDate: "2017-09-08" },
  { seasonNumber: 12, episodeNumber: 16, title: "Return to Gobekli Tepe", originalAirDate: "2017-09-15" },

  // Season 13 (2018-2019)
  { seasonNumber: 13, episodeNumber: 1, title: "The UFO Conspiracy", originalAirDate: "2018-04-27" },
  { seasonNumber: 13, episodeNumber: 2, title: "Da Vinci's Forbidden Codes", originalAirDate: "2018-05-04" },
  { seasonNumber: 13, episodeNumber: 3, title: "The Alien Protocols", originalAirDate: "2018-05-11" },
  { seasonNumber: 13, episodeNumber: 4, title: "Earth's Black Holes", originalAirDate: "2018-05-18" },
  { seasonNumber: 13, episodeNumber: 5, title: "The Desert Codes", originalAirDate: "2018-05-25" },
  { seasonNumber: 13, episodeNumber: 6, title: "Area 52", originalAirDate: "2018-06-01" },
  { seasonNumber: 13, episodeNumber: 7, title: "Earth Station Egypt", originalAirDate: "2018-07-20" },
  { seasonNumber: 13, episodeNumber: 8, title: "Island of the Giants", originalAirDate: "2018-07-27" },
  { seasonNumber: 13, episodeNumber: 9, title: "The Taken", originalAirDate: "2018-08-03" },
  { seasonNumber: 13, episodeNumber: 10, title: "The Sentinels", originalAirDate: "2018-08-10" },
  { seasonNumber: 13, episodeNumber: 11, title: "Russia Declassified", originalAirDate: "2018-08-17" },
  { seasonNumber: 13, episodeNumber: 12, title: "They Came from the Sky", originalAirDate: "2018-08-24" },
  { seasonNumber: 13, episodeNumber: 13, title: "The Artificial Human", originalAirDate: "2018-08-31" },
  { seasonNumber: 13, episodeNumber: 14, title: "The Alien Phenomenon", originalAirDate: "2019-01-04" },
  { seasonNumber: 13, episodeNumber: 15, title: "Return to Mars", originalAirDate: "2019-01-07" },

  // Season 14 (2019)
  { seasonNumber: 14, episodeNumber: 1, title: "Return to Antarctica", originalAirDate: "2019-05-31" },
  { seasonNumber: 14, episodeNumber: 2, title: "The Badlands Guardian", originalAirDate: "2019-06-07" },
  { seasonNumber: 14, episodeNumber: 3, title: "Element 115", originalAirDate: "2019-06-14" },
  { seasonNumber: 14, episodeNumber: 4, title: "The Star Gods of Sirius", originalAirDate: "2019-06-21" },
  { seasonNumber: 14, episodeNumber: 5, title: "They Came from the Sea", originalAirDate: "2019-06-28" },
  { seasonNumber: 14, episodeNumber: 6, title: "Secrets of the Maya", originalAirDate: "2019-07-05" },
  { seasonNumber: 14, episodeNumber: 7, title: "The Druid Connection", originalAirDate: "2019-07-19" },
  { seasonNumber: 14, episodeNumber: 8, title: "The Reptilian Agenda", originalAirDate: "2019-07-26" },
  { seasonNumber: 14, episodeNumber: 9, title: "The Alien Infection", originalAirDate: "2019-08-02" },
  { seasonNumber: 14, episodeNumber: 10, title: "Project Hybrid", originalAirDate: "2019-08-09" },
  { seasonNumber: 14, episodeNumber: 11, title: "The Trans-Dimensionals", originalAirDate: "2019-08-16" },
  { seasonNumber: 14, episodeNumber: 12, title: "Islands of Fire", originalAirDate: "2019-08-23" },
  { seasonNumber: 14, episodeNumber: 13, title: "The Constellation Code", originalAirDate: "2019-08-30" },
  { seasonNumber: 14, episodeNumber: 14, title: "The Nuclear Agenda", originalAirDate: "2019-09-06" },
  { seasonNumber: 14, episodeNumber: 15, title: "The Alien Mountain", originalAirDate: "2019-10-04" },
  { seasonNumber: 14, episodeNumber: 16, title: "The Alien Brain", originalAirDate: "2019-10-11" },
  { seasonNumber: 14, episodeNumber: 17, title: "The Secrets of Stonehenge", originalAirDate: "2019-10-18" },
  { seasonNumber: 14, episodeNumber: 18, title: "Food of the Gods", originalAirDate: "2019-11-01" },
  { seasonNumber: 14, episodeNumber: 19, title: "Human Hieroglyphs", originalAirDate: "2019-11-08" },
  { seasonNumber: 14, episodeNumber: 20, title: "The Storming of Area 51", originalAirDate: "2019-11-15" },
  { seasonNumber: 14, episodeNumber: 21, title: "Countdown to Disclosure", originalAirDate: "2019-11-22" },
  { seasonNumber: 14, episodeNumber: 22, title: "Secrets of the Exoplanets", originalAirDate: "2019-11-29" },

  // Season 15 (2020)
  { seasonNumber: 15, episodeNumber: 1, title: "The Mystery of Nan Madol", originalAirDate: "2020-01-25" },
  { seasonNumber: 15, episodeNumber: 2, title: "The Relics of Roswell", originalAirDate: "2020-02-01" },
  { seasonNumber: 15, episodeNumber: 3, title: "Destination Chile", originalAirDate: "2020-02-08" },
  { seasonNumber: 15, episodeNumber: 4, title: "The Real Men in Black", originalAirDate: "2020-02-15" },
  { seasonNumber: 15, episodeNumber: 5, title: "The Mystery of the Stone Giants", originalAirDate: "2020-02-22" },
  { seasonNumber: 15, episodeNumber: 6, title: "The World Before Time", originalAirDate: "2020-02-29" },
  { seasonNumber: 15, episodeNumber: 7, title: "They Came from the Pleiades", originalAirDate: "2020-03-07" },
  { seasonNumber: 15, episodeNumber: 8, title: "The Immortality Machine", originalAirDate: "2020-03-14" },
  { seasonNumber: 15, episodeNumber: 9, title: "The Shapeshifters", originalAirDate: "2020-03-21" },
  { seasonNumber: 15, episodeNumber: 10, title: "The Mystery of Skinwalker Ranch", originalAirDate: "2020-03-28" },
  { seasonNumber: 15, episodeNumber: 11, title: "The Ultimate Guide to UFOs", originalAirDate: "2020-04-11" },
  { seasonNumber: 15, episodeNumber: 12, title: "Aliens and the Presidents", originalAirDate: "2020-04-18" },

  // Season 16 (2020-2021)
  { seasonNumber: 16, episodeNumber: 1, title: "The Divine Number", originalAirDate: "2020-11-13" },
  { seasonNumber: 16, episodeNumber: 2, title: "The Lost Kingdom", originalAirDate: "2020-11-20" },
  { seasonNumber: 16, episodeNumber: 3, title: "The Galactic Keyhole", originalAirDate: "2020-12-04" },
  { seasonNumber: 16, episodeNumber: 4, title: "Giants of the Mediterranean", originalAirDate: "2020-12-11" },
  { seasonNumber: 16, episodeNumber: 5, title: "The Forbidden Bible", originalAirDate: "2020-12-18" },
  { seasonNumber: 16, episodeNumber: 6, title: "William Shatner Meets Ancient Aliens", originalAirDate: "2021-02-12" },
  { seasonNumber: 16, episodeNumber: 7, title: "Impossible Artifacts", originalAirDate: "2021-02-19" },
  { seasonNumber: 16, episodeNumber: 8, title: "The Space Travelers", originalAirDate: "2021-02-26" },
  { seasonNumber: 16, episodeNumber: 9, title: "The UFO Pioneers", originalAirDate: "2021-03-05" },
  { seasonNumber: 16, episodeNumber: 10, title: "The Harmonic Code", originalAirDate: "2021-03-12" },

  // Season 17 (2021)
  { seasonNumber: 17, episodeNumber: 1, title: "The Lost City of Peru", originalAirDate: "2021-08-06" },
  { seasonNumber: 17, episodeNumber: 2, title: "Top Ten Mysterious Sites", originalAirDate: "2021-08-13" },
  { seasonNumber: 17, episodeNumber: 3, title: "Top Ten Alien Cover-Ups", originalAirDate: "2021-08-20" },
  { seasonNumber: 17, episodeNumber: 4, title: "The Mystery of Mount Shasta", originalAirDate: "2021-09-17" },
  { seasonNumber: 17, episodeNumber: 5, title: "The Human Experiment", originalAirDate: "2021-09-24" },
  { seasonNumber: 17, episodeNumber: 6, title: "Top Ten Alien Encounters", originalAirDate: "2021-10-01" },
  { seasonNumber: 17, episodeNumber: 7, title: "Top Ten Alien Artifacts", originalAirDate: "2021-10-08" },

  // Season 18 (2022)
  { seasonNumber: 18, episodeNumber: 1, title: "The Disclosure Event", originalAirDate: "2022-01-07" },
  { seasonNumber: 18, episodeNumber: 2, title: "Mystery of the Standing Stones", originalAirDate: "2022-01-14" },
  { seasonNumber: 18, episodeNumber: 3, title: "Beneath the Sacred Temples", originalAirDate: "2022-01-21" },
  { seasonNumber: 18, episodeNumber: 4, title: "The World on Alert", originalAirDate: "2022-01-28" },
  { seasonNumber: 18, episodeNumber: 5, title: "Recovering the Ark of the Covenant", originalAirDate: "2022-02-11" },
  { seasonNumber: 18, episodeNumber: 6, title: "Secrets of the Star Ancestors", originalAirDate: "2022-02-18" },
  { seasonNumber: 18, episodeNumber: 7, title: "Alien Air Force", originalAirDate: "2022-02-25" },
  { seasonNumber: 18, episodeNumber: 8, title: "The Shadow People", originalAirDate: "2022-03-04" },
  { seasonNumber: 18, episodeNumber: 9, title: "Decoding the Dragon Gods", originalAirDate: "2022-03-11" },
  { seasonNumber: 18, episodeNumber: 10, title: "The Time Benders", originalAirDate: "2022-03-18" },
  { seasonNumber: 18, episodeNumber: 11, title: "On Location: Incredible Structures", originalAirDate: "2022-07-08" },
  { seasonNumber: 18, episodeNumber: 12, title: "On Location: Extraordinary Encounters", originalAirDate: "2022-07-15" },
  { seasonNumber: 18, episodeNumber: 13, title: "On Location: Decoding The Alien Glyphs", originalAirDate: "2022-07-22" },
  { seasonNumber: 18, episodeNumber: 14, title: "On Location: The UFO Investigations", originalAirDate: "2022-07-29" },
  { seasonNumber: 18, episodeNumber: 15, title: "On Location: Mysterious Artifacts", originalAirDate: "2022-08-05" },
  { seasonNumber: 18, episodeNumber: 16, title: "On Location: Evidence of Alien Life", originalAirDate: "2022-08-12" },
  { seasonNumber: 18, episodeNumber: 17, title: "The Shining Ones", originalAirDate: "2022-08-19" },
  { seasonNumber: 18, episodeNumber: 18, title: "The Journey to Immortality", originalAirDate: "2022-08-26" },
  { seasonNumber: 18, episodeNumber: 19, title: "Secrets of Inner Earth", originalAirDate: "2022-09-09" },
  { seasonNumber: 18, episodeNumber: 20, title: "Return of the Egyptian Gods", originalAirDate: "2022-09-16" },

  // Season 19 (2023)
  { seasonNumber: 19, episodeNumber: 1, title: "The Hotspots Connection", originalAirDate: "2023-01-06" },
  { seasonNumber: 19, episodeNumber: 2, title: "The Crop Circle Code", originalAirDate: "2023-01-13" },
  { seasonNumber: 19, episodeNumber: 3, title: "Mystery of the Lost Civilization", originalAirDate: "2023-01-20" },
  { seasonNumber: 19, episodeNumber: 4, title: "The Power of the Obelisks", originalAirDate: "2023-02-03" },
  { seasonNumber: 19, episodeNumber: 5, title: "The MUFON Files", originalAirDate: "2023-02-10" },
  { seasonNumber: 19, episodeNumber: 6, title: "Cosmic Impacts", originalAirDate: "2023-02-17" },
  { seasonNumber: 19, episodeNumber: 7, title: "Close Encounters of the Fifth Kind", originalAirDate: "2023-02-24" },
  { seasonNumber: 19, episodeNumber: 8, title: "The Mysteries of Alaska", originalAirDate: "2023-03-03" },
  { seasonNumber: 19, episodeNumber: 9, title: "Aliens in our Airspace", originalAirDate: "2023-03-10" },
  { seasonNumber: 19, episodeNumber: 10, title: "The Giants of Malta", originalAirDate: "2023-03-17" },
  { seasonNumber: 19, episodeNumber: 11, title: "The Top Ten Pyramid Sites", originalAirDate: "2023-06-30" },
  { seasonNumber: 19, episodeNumber: 12, title: "The Top Ten Mysterious Devices", originalAirDate: "2023-07-07" },
  { seasonNumber: 19, episodeNumber: 13, title: "The Top Ten Mysterious Islands", originalAirDate: "2023-07-14" },
  { seasonNumber: 19, episodeNumber: 14, title: "The Top Ten Alien Craft", originalAirDate: "2023-07-21" },
  { seasonNumber: 19, episodeNumber: 15, title: "Edgar Cayce: The Sleeping Prophet", originalAirDate: "2023-08-04" },
  { seasonNumber: 19, episodeNumber: 16, title: "The Gods of Greece", originalAirDate: "2023-08-11" },
  { seasonNumber: 19, episodeNumber: 17, title: "The New UFO Hunters", originalAirDate: "2023-08-18" },
  { seasonNumber: 19, episodeNumber: 18, title: "Power of the Talisman", originalAirDate: "2023-08-25" },
  { seasonNumber: 19, episodeNumber: 19, title: "The Top Ten Mysteries of the Deep", originalAirDate: "2023-09-08" },
  { seasonNumber: 19, episodeNumber: 20, title: "The Top Ten Alien Petroglyphs", originalAirDate: "2023-09-15" },

  // Season 20 (2024)
  { seasonNumber: 20, episodeNumber: 1, title: "The Top Ten Alien Influencers", originalAirDate: "2024-01-05" },
  { seasonNumber: 20, episodeNumber: 2, title: "The Top Ten Extraordinary Creatures", originalAirDate: "2024-01-12" },
  { seasonNumber: 20, episodeNumber: 3, title: "The Top Ten Hidden Alien Bases", originalAirDate: "2024-01-19" },
  { seasonNumber: 20, episodeNumber: 4, title: "The Top Ten Scariest Encounters", originalAirDate: "2024-02-02" },
  { seasonNumber: 20, episodeNumber: 5, title: "The Top Ten Alien Codes", originalAirDate: "2024-02-09" },
  { seasonNumber: 20, episodeNumber: 6, title: "The Top Ten Alien Disasters", originalAirDate: "2024-02-16" },
  { seasonNumber: 20, episodeNumber: 7, title: "Secrets of the Sumerians", originalAirDate: "2024-02-23" },
  { seasonNumber: 20, episodeNumber: 8, title: "The UFO Superhighway", originalAirDate: "2024-03-01" },
  { seasonNumber: 20, episodeNumber: 9, title: "Mysteries of Scotland", originalAirDate: "2024-03-08" },
  { seasonNumber: 20, episodeNumber: 10, title: "Mystery of the Stone Spheres", originalAirDate: "2024-03-15" },
  { seasonNumber: 20, episodeNumber: 11, title: "Mysteries of the Maya", originalAirDate: "2024-06-28" },
  { seasonNumber: 20, episodeNumber: 12, title: "Unlocking The Stargates", originalAirDate: "2024-07-05" },
  { seasonNumber: 20, episodeNumber: 13, title: "The Whistleblowers", originalAirDate: "2024-07-12" },
  { seasonNumber: 20, episodeNumber: 14, title: "The Search for Extraterrestrial Intelligence", originalAirDate: "2024-07-19" },
  { seasonNumber: 20, episodeNumber: 15, title: "Jacques Vallee: UFO Pioneer", originalAirDate: "2024-08-09" },
  { seasonNumber: 20, episodeNumber: 16, title: "The Teachers", originalAirDate: "2024-08-16" },
  { seasonNumber: 20, episodeNumber: 17, title: "Egypt's Giant Tombs", originalAirDate: "2024-08-23" },
  { seasonNumber: 20, episodeNumber: 18, title: "The Linda Moulton Howe Files", originalAirDate: "2024-08-30" },
  { seasonNumber: 20, episodeNumber: 19, title: "The Chosen", originalAirDate: "2024-09-06" },
  { seasonNumber: 20, episodeNumber: 20, title: "Resurrecting Puma Punku", originalAirDate: "2024-09-13" },

  // Season 21 (2025)
  { seasonNumber: 21, episodeNumber: 1, title: "The Top Ten Extraordinary Discoveries", originalAirDate: "2025-02-07" },
  { seasonNumber: 21, episodeNumber: 2, title: "The Top Ten Mysterious Monoliths", originalAirDate: "2025-02-14" },
  { seasonNumber: 21, episodeNumber: 3, title: "The Top Ten UFO Crashes", originalAirDate: "2025-02-21" },
  { seasonNumber: 21, episodeNumber: 4, title: "The Top Ten Unexplained Technologies", originalAirDate: "2025-02-28" },
  { seasonNumber: 21, episodeNumber: 5, title: "The Top Ten Secret Projects", originalAirDate: "2025-03-07" },
  { seasonNumber: 21, episodeNumber: 6, title: "The Top Ten Mysterious Mountains", originalAirDate: "2025-03-14" },
  { seasonNumber: 21, episodeNumber: 7, title: "Mysteries of the Aztecs", originalAirDate: "2025-03-21" },
  { seasonNumber: 21, episodeNumber: 8, title: "The Glowing Orb Phenomenon", originalAirDate: "2025-03-28" },

  // Season 22 (2026)
  { seasonNumber: 22, episodeNumber: 1, title: "Skulls of the Gods", originalAirDate: "2026-01-15" },
  { seasonNumber: 22, episodeNumber: 2, title: "Egypt's Lost Pyramid", originalAirDate: "2026-01-22" },
  { seasonNumber: 22, episodeNumber: 3, title: "Islands of the Gods", originalAirDate: "2026-01-29" },
  { seasonNumber: 22, episodeNumber: 4, title: "Extraterrestrial Engineering", originalAirDate: "2026-02-05" },
  { seasonNumber: 22, episodeNumber: 5, title: "UFO Hot Spots", originalAirDate: "2026-02-26" },
  { seasonNumber: 22, episodeNumber: 6, title: "Mysterious Monuments", originalAirDate: "2026-03-05" },
  { seasonNumber: 22, episodeNumber: 7, title: "Underwater Alien Bases", originalAirDate: "2026-06-11" },
  { seasonNumber: 22, episodeNumber: 8, title: "Secrets of the Vedas", originalAirDate: "2026-06-18" },
  { seasonNumber: 22, episodeNumber: 9, title: "Wars of the Gods", originalAirDate: "2026-06-25" },
  { seasonNumber: 22, episodeNumber: 10, title: "UFO Sightings", originalAirDate: "2026-07-02" },
  { seasonNumber: 22, episodeNumber: 11, title: "Alien A.I.", originalAirDate: "2026-07-09" },
];


async function main() {
  console.log("Seeding database with comprehensive data (all 22 seasons)...");

  // Clear existing data to avoid duplicates
  console.log("Clearing existing data...");
  await prisma.bookChapterItem.deleteMany();
  await prisma.bookChapter.deleteMany();
  await prisma.bookFrontMatter.deleteMany();
  await prisma.bookAppendix.deleteMany();
  await prisma.bookEdition.deleteMany();
  await prisma.tagOnEntity.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.citation.deleteMany();
  await prisma.source.deleteMany();
  await prisma.claimArtifact.deleteMany();
  await prisma.claim.deleteMany();
  await prisma.imageAsset.deleteMany();
  await prisma.episodeEntry.deleteMany();
  await prisma.episodePerson.deleteMany();
  await prisma.episodeLocation.deleteMany();
  await prisma.episodeArtifact.deleteMany();
  await prisma.episodeCivilization.deleteMany();
  await prisma.entryPerson.deleteMany();
  await prisma.entryLocation.deleteMany();
  await prisma.entryArtifact.deleteMany();
  await prisma.entryRelation.deleteMany();
  await prisma.personTheory.deleteMany();
  await prisma.locationArtifact.deleteMany();
  await prisma.locationCivilization.deleteMany();
  await prisma.civilizationDeity.deleteMany();
  await prisma.timelineEvent.deleteMany();
  await prisma.episode.deleteMany();
  await prisma.encyclopediaEntry.deleteMany();
  await prisma.person.deleteMany();
  await prisma.location.deleteMany();
  await prisma.theory.deleteMany();
  await prisma.artifact.deleteMany();
  await prisma.civilization.deleteMany();
  await prisma.deity.deleteMany();
  await prisma.ancientText.deleteMany();
  console.log("Existing data cleared.");


  // Seed all episodes
  console.log(`Seeding ${allEpisodes.length} episodes across 22 seasons...`);
  for (const ep of allEpisodes) {
    const seasonStr = String(ep.seasonNumber).padStart(2, "0");
    const episodeStr = String(ep.episodeNumber).padStart(2, "0");
    const titleSlug = generateSlug(ep.title);
    const slug = `s${seasonStr}e${episodeStr}-${titleSlug}`;
    await prisma.episode.create({
      data: {
        seasonNumber: ep.seasonNumber,
        episodeNumber: ep.episodeNumber,
        title: ep.title,
        slug,
        originalAirDate: ep.originalAirDate,
        status: "DRAFT",
      },
    });
  }
  console.log(`  Created ${allEpisodes.length} episodes.`);


  // Seed Sources
  console.log("Seeding sources...");
  await prisma.source.create({
    data: { title: "Chariots of the Gods?", author: "Erich von Daniken", publicationYear: 1968, publisher: "Putnam", sourceType: "Book" },
  });
  await prisma.source.create({
    data: { title: "Fingerprints of the Gods", author: "Graham Hancock", publicationYear: 1995, publisher: "Crown", sourceType: "Book" },
  });
  await prisma.source.create({
    data: { title: "The Sirius Mystery", author: "Robert Temple", publicationYear: 1976, publisher: "Sidgwick & Jackson", sourceType: "Book" },
  });

  // Seed Encyclopedia Entries
  console.log("Seeding encyclopedia entries...");
  const entries = [
    { title: "Great Pyramid of Giza", slug: "great-pyramid-of-giza", category: "Monument", briefOverview: "The largest of the three pyramids on the Giza Plateau." },
    { title: "Nazca Lines", slug: "nazca-lines", category: "Geoglyph", briefOverview: "Ancient geoglyphs in the Nazca Desert of southern Peru." },
    { title: "Puma Punku", slug: "puma-punku", category: "Monument", briefOverview: "Megalithic site near Tiwanaku, Bolivia." },
    { title: "Vimana", slug: "vimana", category: "Concept", briefOverview: "Flying vehicles described in ancient Indian texts." },
    { title: "Anunnaki", slug: "anunnaki", category: "Beings", briefOverview: "Deities in ancient Sumerian mythology." },
    { title: "Crystal Skulls", slug: "crystal-skulls", category: "Artifact", briefOverview: "Quartz crystal carvings of human skulls." },
    { title: "Stonehenge", slug: "stonehenge", category: "Monument", briefOverview: "Prehistoric stone circle in Wiltshire, England." },
    { title: "Machu Picchu", slug: "machu-picchu", category: "Monument", briefOverview: "Incan citadel in the Andes Mountains of Peru." },
    { title: "Easter Island Moai", slug: "easter-island-moai", category: "Monument", briefOverview: "Monolithic human figures on Rapa Nui." },
    { title: "Baghdad Battery", slug: "baghdad-battery", category: "Artifact", briefOverview: "Ancient electrochemical cell found near Baghdad." },
  ];
  for (const entry of entries) {
    await prisma.encyclopediaEntry.create({ data: { ...entry, status: "DRAFT" } });
  }


  // Seed Locations
  console.log("Seeding locations...");
  const locations = [
    { name: "Giza Plateau", slug: "giza-plateau", country: "Egypt", region: "Greater Cairo", latitude: 29.9792, longitude: 31.1342, historicalPeriod: "c. 2560 BCE" },
    { name: "Nazca Desert", slug: "nazca-desert", country: "Peru", region: "Ica", latitude: -14.735, longitude: -75.13, historicalPeriod: "500 BCE - 500 CE" },
    { name: "Tiwanaku", slug: "tiwanaku", country: "Bolivia", region: "La Paz", latitude: -16.5553, longitude: -68.6733, historicalPeriod: "c. 300 - 1000 CE" },
    { name: "Gobekli Tepe", slug: "gobekli-tepe", country: "Turkey", region: "Southeastern Anatolia", latitude: 37.2233, longitude: 38.9225, historicalPeriod: "c. 9500 BCE" },
    { name: "Baalbek", slug: "baalbek", country: "Lebanon", region: "Beqaa Valley", latitude: 34.0065, longitude: 36.2042, historicalPeriod: "c. 7000 BCE - Roman era" },
  ];
  for (const loc of locations) {
    await prisma.location.create({ data: { ...loc, status: "DRAFT" } });
  }

  // Seed People
  console.log("Seeding people...");
  const people = [
    { name: "Erich von Daniken", slug: "erich-von-daniken", biography: "Swiss author of Chariots of the Gods? (1968)." },
    { name: "Giorgio A. Tsoukalos", slug: "giorgio-tsoukalos", biography: "Publisher of Legendary Times magazine and Ancient Aliens presenter." },
    { name: "Graham Hancock", slug: "graham-hancock", biography: "British writer and journalist, author of Fingerprints of the Gods." },
    { name: "Zecharia Sitchin", slug: "zecharia-sitchin", biography: "Author of The 12th Planet and the Earth Chronicles series." },
    { name: "David Childress", slug: "david-childress", biography: "Author and publisher specializing in alternative history." },
  ];
  for (const person of people) {
    await prisma.person.create({ data: { ...person, status: "DRAFT" } });
  }


  // Seed Theories
  console.log("Seeding theories...");
  const theories = [
    { title: "Ancient Astronaut Theory", slug: "ancient-astronaut-theory", overview: "The hypothesis that extraterrestrial beings visited Earth in antiquity and influenced human civilizations." },
    { title: "Lost Advanced Civilizations", slug: "lost-advanced-civilizations", overview: "The idea that technologically advanced human civilizations existed before recorded history." },
    { title: "Genetic Manipulation", slug: "genetic-manipulation", overview: "The claim that extraterrestrials genetically engineered or modified early humans." },
    { title: "Megalithic Engineering", slug: "megalithic-engineering", overview: "Questions about how ancient peoples built massive stone structures." },
    { title: "Ancient Flying Machines", slug: "ancient-flying-machines", overview: "References to aircraft and flight in ancient texts and art." },
  ];
  for (const theory of theories) {
    await prisma.theory.create({ data: { ...theory, status: "DRAFT" } });
  }

  // Seed Artifacts
  console.log("Seeding artifacts...");
  const artifacts = [
    { name: "Antikythera Mechanism", slug: "antikythera-mechanism", civilization: "Ancient Greek", historicalPeriod: "c. 100 BCE" },
    { name: "Dendera Light", slug: "dendera-light", civilization: "Ancient Egyptian", historicalPeriod: "c. 50 BCE" },
    { name: "Saqqara Bird", slug: "saqqara-bird", civilization: "Ancient Egyptian", historicalPeriod: "c. 200 BCE" },
    { name: "Tolima Artifacts", slug: "tolima-artifacts", civilization: "Pre-Columbian", historicalPeriod: "c. 500-800 CE" },
    { name: "Iron Pillar of Delhi", slug: "iron-pillar-of-delhi", civilization: "Gupta Empire", historicalPeriod: "c. 402 CE" },
  ];
  for (const artifact of artifacts) {
    await prisma.artifact.create({ data: { ...artifact, status: "DRAFT" } });
  }


  // Seed Civilizations
  console.log("Seeding civilizations...");
  const civilizations = [
    { name: "Sumerian", slug: "sumerian", timeRange: "c. 4500-1900 BCE", region: "Mesopotamia" },
    { name: "Ancient Egyptian", slug: "ancient-egyptian", timeRange: "c. 3100-30 BCE", region: "Nile Valley" },
    { name: "Maya", slug: "maya", timeRange: "c. 2000 BCE-1500 CE", region: "Mesoamerica" },
    { name: "Inca", slug: "inca", timeRange: "c. 1400-1533 CE", region: "Andes, South America" },
    { name: "Indus Valley", slug: "indus-valley", timeRange: "c. 3300-1300 BCE", region: "South Asia" },
  ];
  for (const civ of civilizations) {
    await prisma.civilization.create({ data: { ...civ, status: "DRAFT" } });
  }

  // Seed Deities
  console.log("Seeding deities...");
  const deities = [
    { name: "Enki", slug: "enki", mythology: "Sumerian", description: "God of water, knowledge, and creation." },
    { name: "Ra", slug: "ra", mythology: "Egyptian", description: "Sun god who traveled the sky in a solar barque." },
    { name: "Quetzalcoatl", slug: "quetzalcoatl", mythology: "Aztec/Mesoamerican", description: "Feathered serpent deity." },
    { name: "Viracocha", slug: "viracocha", mythology: "Inca", description: "Creator deity who emerged from Lake Titicaca." },
    { name: "Thoth", slug: "thoth", mythology: "Egyptian", description: "God of wisdom, writing, and magic." },
  ];
  for (const deity of deities) {
    await prisma.deity.create({ data: { ...deity, status: "DRAFT" } });
  }


  // Seed Ancient Texts
  console.log("Seeding ancient texts...");
  const texts = [
    { title: "Epic of Gilgamesh", slug: "epic-of-gilgamesh", civilization: "Sumerian/Babylonian", approximateDate: "c. 2100 BCE" },
    { title: "Book of Enoch", slug: "book-of-enoch", civilization: "Jewish/Ethiopian", approximateDate: "c. 300-100 BCE" },
    { title: "Mahabharata", slug: "mahabharata", civilization: "Indian", approximateDate: "c. 400 BCE" },
    { title: "Popol Vuh", slug: "popol-vuh", civilization: "Maya", approximateDate: "c. 1554-1558 CE (written)" },
    { title: "Egyptian Book of the Dead", slug: "egyptian-book-of-the-dead", civilization: "Egyptian", approximateDate: "c. 1550 BCE" },
  ];
  for (const text of texts) {
    await prisma.ancientText.create({ data: { ...text, status: "DRAFT" } });
  }

  // Seed Tags
  console.log("Seeding tags...");
  const tags = [
    "Pyramids", "Megalithic", "Flight", "Genetics", "Star Maps",
    "Underground", "Sacred Geometry", "Energy", "Portal", "Flood",
    "Giants", "Elongated Skulls", "Gold", "Crystal", "Mars",
  ];
  for (const tag of tags) {
    await prisma.tag.create({
      data: { name: tag, slug: generateSlug(tag) },
    });
  }

  console.log("\nSeed complete!");
  console.log("Created:");
  console.log(`  - ${allEpisodes.length} episodes (all 22 seasons)`);
  console.log(`  - ${entries.length} encyclopedia entries`);
  console.log(`  - ${locations.length} locations`);
  console.log(`  - ${people.length} people`);
  console.log(`  - ${theories.length} theories`);
  console.log(`  - ${artifacts.length} artifacts`);
  console.log(`  - ${civilizations.length} civilizations`);
  console.log(`  - ${deities.length} deities`);
  console.log(`  - ${texts.length} ancient texts`);
  console.log(`  - 3 sources`);
  console.log(`  - ${tags.length} tags`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
