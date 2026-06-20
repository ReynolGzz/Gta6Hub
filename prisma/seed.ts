/**
 * ViceHub seed.
 *
 * ⚠️  ILLUSTRATIVE PLACEHOLDER DATA. GTA 6 is not fully documented, so every
 * stat, price and location below is community-style speculation for demo
 * purposes. Edit freely — this is designed to be replaced with real data.
 *
 * After seeding the DB, this script regenerates src/data/search-index.json,
 * the lightweight index the client uses for instant (Fuse.js) search.
 */
import { PrismaClient } from "@prisma/client";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const db = new PrismaClient();

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// ───────────────────────────────── Cars ─────────────────────────────────

type CarSeed = {
  name: string;
  category: string;
  topSpeed: number;
  acceleration: number;
  braking: number;
  handling: number;
  price: number;
  location?: string;
  unlockMethod?: string;
  realLifeInspiration?: string;
  summary: string;
  popularity?: number;
};

const cars: CarSeed[] = [
  { name: "Cheetah GT", category: "Super", topSpeed: 211, acceleration: 96, braking: 82, handling: 90, price: 1650000, location: "Vice Beach dealership", unlockMethod: "Purchase or win in Beachfront race", realLifeInspiration: "Ferrari SF90", summary: "Flagship hypercar with the highest top speed in the game.", popularity: 98 },
  { name: "Vortex X", category: "Super", topSpeed: 208, acceleration: 99, braking: 80, handling: 88, price: 2100000, location: "Downtown showroom", unlockMethod: "Purchase", realLifeInspiration: "Koenigsegg Jesko", summary: "Brutal acceleration off the line; a drag-strip monster.", popularity: 94 },
  { name: "Reaper S", category: "Super", topSpeed: 205, acceleration: 94, braking: 85, handling: 93, price: 1850000, location: "Online dealer", unlockMethod: "Purchase", realLifeInspiration: "McLaren P1", summary: "Balanced hypercar that corners like it's on rails.", popularity: 90 },
  { name: "Sol Aero", category: "Super", topSpeed: 202, acceleration: 92, braking: 84, handling: 95, price: 1450000, location: "Little Cuba", unlockMethod: "Purchase", realLifeInspiration: "Lamborghini Huracán", summary: "Best handling super; the track-day enthusiast's pick.", popularity: 86 },
  { name: "Marina Spyder", category: "Sports", topSpeed: 192, acceleration: 88, braking: 78, handling: 84, price: 740000, location: "Vice Beach", unlockMethod: "Purchase", realLifeInspiration: "Porsche 911", summary: "Iconic everyday sports car with timeless poise.", popularity: 88 },
  { name: "Neon Z", category: "Sports", topSpeed: 188, acceleration: 86, braking: 76, handling: 86, price: 520000, location: "Downtown", unlockMethod: "Purchase", realLifeInspiration: "Nissan GT-R", summary: "Tuner favorite; massive grip and a loyal following.", popularity: 91 },
  { name: "Strada 90", category: "Sports", topSpeed: 190, acceleration: 84, braking: 75, handling: 82, price: 610000, location: "Italian import lot", unlockMethod: "Purchase", realLifeInspiration: "Alfa Romeo 4C", summary: "Lightweight and nimble retro-modern coupe.", popularity: 74 },
  { name: "Apex RS", category: "Sports", topSpeed: 195, acceleration: 89, braking: 79, handling: 87, price: 880000, location: "Downtown showroom", unlockMethod: "Purchase", realLifeInspiration: "Audi R8", summary: "All-wheel-drive confidence in any weather.", popularity: 80 },
  { name: "Goliath SS", category: "Muscle", topSpeed: 168, acceleration: 90, braking: 64, handling: 60, price: 240000, location: "Junkyard auctions", unlockMethod: "Purchase", realLifeInspiration: "Dodge Challenger", summary: "Tire-shredding straight-line muscle with attitude.", popularity: 83 },
  { name: "Vandal 440", category: "Muscle", topSpeed: 164, acceleration: 88, braking: 62, handling: 58, price: 195000, location: "Highway lot", unlockMethod: "Purchase", realLifeInspiration: "Plymouth Barracuda", summary: "Classic American muscle, all noise and smoke.", popularity: 76 },
  { name: "Stallion GTO", category: "Muscle", topSpeed: 170, acceleration: 87, braking: 66, handling: 63, price: 320000, location: "Collector's garage", unlockMethod: "Complete 'Gold Coast' mission", realLifeInspiration: "Ford Mustang", summary: "Pony-car icon; a crowd-pleaser at any cars & coffee.", popularity: 85 },
  { name: "Titan XLT", category: "SUV", topSpeed: 142, acceleration: 70, braking: 70, handling: 64, price: 165000, location: "Suburban dealer", unlockMethod: "Purchase", realLifeInspiration: "Cadillac Escalade", summary: "Luxury barge with presence and seven seats.", popularity: 70 },
  { name: "Ranger Overland", category: "SUV", topSpeed: 138, acceleration: 66, braking: 72, handling: 68, price: 132000, location: "Everglades outpost", unlockMethod: "Purchase", realLifeInspiration: "Land Rover Defender", summary: "Go-anywhere off-roader for the swamps and beyond.", popularity: 72 },
  { name: "Monarch RST", category: "SUV", topSpeed: 150, acceleration: 78, braking: 68, handling: 66, price: 285000, location: "Downtown", unlockMethod: "Purchase", realLifeInspiration: "Lamborghini Urus", summary: "Super-SUV pace with family practicality.", popularity: 79 },
  { name: "Hornet 1000", category: "Bikes", topSpeed: 186, acceleration: 97, braking: 70, handling: 80, price: 95000, location: "Bike shop, Little Havana", unlockMethod: "Purchase", realLifeInspiration: "Kawasaki Ninja", summary: "Featherweight superbike; fastest 0-60 in the game.", popularity: 82 },
  { name: "Drifter 750", category: "Bikes", topSpeed: 172, acceleration: 92, braking: 66, handling: 88, price: 64000, location: "Boardwalk", unlockMethod: "Purchase", realLifeInspiration: "Ducati Monster", summary: "Flickable naked bike, perfect for canyon carving.", popularity: 75 },
  { name: "Cruiser Royale", category: "Bikes", topSpeed: 148, acceleration: 74, braking: 60, handling: 58, price: 78000, location: "Highway", unlockMethod: "Purchase", realLifeInspiration: "Harley-Davidson", summary: "Laid-back cruiser for coastal sunset rides.", popularity: 68 },
  { name: "Marlin 38", category: "Boats", topSpeed: 92, acceleration: 60, braking: 50, handling: 70, price: 410000, location: "Vice Marina", unlockMethod: "Purchase", realLifeInspiration: "Cigarette racing boat", summary: "Offshore powerboat built for smuggling runs.", popularity: 64 },
  { name: "Sandbar Skiff", category: "Boats", topSpeed: 70, acceleration: 55, braking: 48, handling: 76, price: 88000, location: "Keys dock", unlockMethod: "Purchase", realLifeInspiration: "Center-console fishing boat", summary: "Shallow-draft runabout for the mangroves.", popularity: 52 },
  { name: "Halcyon H1", category: "Aircraft", topSpeed: 240, acceleration: 80, braking: 40, handling: 72, price: 2950000, location: "Escobar Intl. hangar", unlockMethod: "Purchase", realLifeInspiration: "Cessna Citation", summary: "Private jet for crossing Leonida in minutes.", popularity: 71 },
  { name: "Skyblade R", category: "Aircraft", topSpeed: 160, acceleration: 75, braking: 45, handling: 84, price: 1750000, location: "Downtown helipad", unlockMethod: "Purchase", realLifeInspiration: "Eurocopter", summary: "Agile helicopter; the city traffic cheat code.", popularity: 77 },
  { name: "Tempest VTOL", category: "Aircraft", topSpeed: 280, acceleration: 88, braking: 42, handling: 70, price: 4200000, location: "Military surplus (online)", unlockMethod: "Complete 'Black Tide' heist", realLifeInspiration: "Harrier jet", summary: "Vertical-takeoff jet; the ultimate flex purchase.", popularity: 81 },
  { name: "Coastal EV", category: "Sports", topSpeed: 184, acceleration: 95, braking: 80, handling: 83, price: 690000, location: "EV showroom", unlockMethod: "Purchase", realLifeInspiration: "Tesla Roadster", summary: "Silent electric torque with instant response.", popularity: 84 },
];

// ──────────────────────────── Money Methods ─────────────────────────────

type MoneySeed = {
  name: string;
  category: string;
  profitPerHour: number;
  difficulty: string;
  requiredInvestment: number;
  playersRequired: number;
  timeNeeded: string;
  riskLevel: string;
  popularity: number;
  soloFriendly: boolean;
  beginnerFriendly: boolean;
  summary: string;
  guide: string;
};

const money: MoneySeed[] = [
  { name: "Cartel Cargo Runs", category: "Solo", profitPerHour: 480000, difficulty: "Medium", requiredInvestment: 1200000, playersRequired: 1, timeNeeded: "45-60 min/cycle", riskLevel: "Medium", popularity: 95, soloFriendly: true, beginnerFriendly: false, summary: "Buy a warehouse, source product, sell for big margins.", guide: "## Cartel Cargo Runs\n\n1. Buy a coastal **warehouse** (~$1.2M).\n2. Source crates between missions; never let stock idle.\n3. Sell at 100% stock for the bonus multiplier.\n4. Avoid selling during peak online hours to reduce griefing.\n\n**Tip:** Pair with passive businesses so product accrues while you run other content." },
  { name: "Beachfront Nightclub", category: "Passive", profitPerHour: 210000, difficulty: "Easy", requiredInvestment: 1700000, playersRequired: 1, timeNeeded: "5 min upkeep/day", riskLevel: "Low", popularity: 92, soloFriendly: true, beginnerFriendly: true, summary: "The premier passive income engine. Set it and forget it.", guide: "## Beachfront Nightclub\n\nThe nightclub generates income passively while you play other content.\n\n1. Buy the club and assign technicians to high-value goods.\n2. Keep **popularity** topped up with the daily management mission.\n3. Empty the safe before it caps (~$210K).\n\nLowest-effort money in the game — ideal first investment." },
  { name: "Vice Heists", category: "Heist", profitPerHour: 600000, difficulty: "Hard", requiredInvestment: 250000, playersRequired: 2, timeNeeded: "60-90 min", riskLevel: "High", popularity: 97, soloFriendly: false, beginnerFriendly: false, summary: "Highest raw payout in the game with a coordinated crew.", guide: "## Vice Heists\n\nThe biggest scores require a 2-4 player crew.\n\n1. Pay the setup cost and complete prep missions.\n2. Assign roles by skill — driver, hacker, gunner.\n3. Take the **hard** approach for the payout bonus.\n\nMaximum profit per hour, but coordination and skill required." },
  { name: "Taxi Hustle", category: "Solo", profitPerHour: 95000, difficulty: "Easy", requiredInvestment: 0, playersRequired: 1, timeNeeded: "Any", riskLevel: "Low", popularity: 70, soloFriendly: true, beginnerFriendly: true, summary: "Zero investment grind, perfect for brand-new players.", guide: "## Taxi Hustle\n\nNo investment, no risk — just steady cash.\n\n1. Grab a cab from a depot.\n2. Complete fares back-to-back; chain bonuses for tips.\n3. Great while you save for your first real business.\n\nThe classic beginner starter method." },
  { name: "Exotic Export List", category: "Solo", profitPerHour: 260000, difficulty: "Medium", requiredInvestment: 500000, playersRequired: 1, timeNeeded: "30-45 min", riskLevel: "Medium", popularity: 88, soloFriendly: true, beginnerFriendly: true, summary: "Steal listed exotic cars and export them for clean profit.", guide: "## Exotic Export List\n\n1. Buy the **import/export garage**.\n2. Check the daily export list for high-value targets.\n3. Steal, deliver clean (no damage), repeat.\n\nReliable solo income with a satisfying gameplay loop." },
  { name: "Counterfeit Cash Lab", category: "Business", profitPerHour: 170000, difficulty: "Easy", requiredInvestment: 950000, playersRequired: 1, timeNeeded: "10 min upkeep", riskLevel: "Medium", popularity: 78, soloFriendly: true, beginnerFriendly: true, summary: "A semi-passive lab that prints product while you play.", guide: "## Counterfeit Cash Lab\n\n1. Buy a lab in the Everglades for discretion.\n2. Keep supplies stocked (buy, don't steal, to save time).\n3. Sell locally for low-risk deliveries.\n\nGreat second business after the nightclub." },
  { name: "Offshore Smuggling", category: "Co-op", profitPerHour: 420000, difficulty: "Hard", requiredInvestment: 800000, playersRequired: 2, timeNeeded: "50-70 min", riskLevel: "High", popularity: 84, soloFriendly: false, beginnerFriendly: false, summary: "Boat-based contraband runs with high risk and reward.", guide: "## Offshore Smuggling\n\n1. Buy a **dock** and a fast boat (see the Marlin 38).\n2. Run contraband between the Keys and the mainland.\n3. Bring a co-pilot to fend off interceptors.\n\nHigh reward, but you will be a target on the water." },
  { name: "Street Race Circuit", category: "Solo", profitPerHour: 140000, difficulty: "Medium", requiredInvestment: 200000, playersRequired: 1, timeNeeded: "8-12 min/race", riskLevel: "Low", popularity: 80, soloFriendly: true, beginnerFriendly: true, summary: "Win races for cash; rewards driving skill over investment.", guide: "## Street Race Circuit\n\n1. Buy a competitive **Sports** or **Super** car.\n2. Enter circuit races and podium consistently.\n3. Reinvest winnings into upgrades for a better edge.\n\nSkill-based and genuinely fun to grind." },
  { name: "Property Flipping", category: "Passive", profitPerHour: 120000, difficulty: "Medium", requiredInvestment: 2000000, playersRequired: 1, timeNeeded: "Long-term", riskLevel: "Low", popularity: 66, soloFriendly: true, beginnerFriendly: false, summary: "Buy, upgrade and resell properties for appreciation.", guide: "## Property Flipping\n\n1. Buy undervalued properties in up-and-coming districts.\n2. Hold while the area's value rises with story progress.\n3. Sell at peak demand.\n\nA patient, capital-heavy long game." },
  { name: "Bounty Hunting", category: "Solo", profitPerHour: 185000, difficulty: "Hard", requiredInvestment: 50000, playersRequired: 1, timeNeeded: "15-25 min/target", riskLevel: "High", popularity: 73, soloFriendly: true, beginnerFriendly: false, summary: "Track and capture targets for escalating bounties.", guide: "## Bounty Hunting\n\n1. Unlock the bounty board (small license fee).\n2. Accept targets; alive pays more than eliminated.\n3. Chain bounties for a streak multiplier.\n\nLow investment, high skill ceiling." },
];

// ───────────────────────── Generic entities ─────────────────────────────

type GenericSeed = {
  type: string;
  name: string;
  summary: string;
  category?: string;
  data?: Record<string, unknown>;
  lat?: number;
  lng?: number;
  popularity?: number;
};

const generic: GenericSeed[] = [
  // Weapons
  { type: "weapon", name: "Vice Carbine", category: "Rifle", summary: "Versatile assault rifle balancing range and rate of fire.", data: { weaponType: "Assault Rifle", damage: 72, fireRate: 80, range: 65, price: 32000, unlock: "Rank 12 or Ammu-Nation" }, popularity: 90 },
  { type: "weapon", name: "Tidebreaker SMG", category: "SMG", summary: "Compact, high-RPM SMG ideal for close-quarters chaos.", data: { weaponType: "SMG", damage: 48, fireRate: 95, range: 38, price: 18000, unlock: "Ammu-Nation" }, popularity: 82 },
  { type: "weapon", name: "Sundown Magnum", category: "Pistol", summary: "Hard-hitting revolver with stopping power to spare.", data: { weaponType: "Pistol", damage: 88, fireRate: 35, range: 45, price: 12500, unlock: "Complete 'First Blood'" }, popularity: 76 },
  { type: "weapon", name: "Everglade DMR", category: "Sniper", summary: "Semi-auto marksman rifle for mid-to-long range duels.", data: { weaponType: "Marksman", damage: 95, fireRate: 30, range: 92, price: 54000, unlock: "Rank 30" }, popularity: 79 },
  { type: "weapon", name: "Riot 12", category: "Shotgun", summary: "Pump shotgun that ends close encounters instantly.", data: { weaponType: "Shotgun", damage: 90, fireRate: 25, range: 22, price: 26000, unlock: "Ammu-Nation" }, popularity: 71 },
  // Businesses
  { type: "business", name: "Sunset Auto Shop", category: "Vehicle", summary: "Customer car deliveries plus a tuning workshop.", data: { cost: 450000, incomePerDay: 60000, roiDays: 8, location: "Downtown Vice" }, popularity: 84 },
  { type: "business", name: "Neon Arcade", category: "Front", summary: "A retro arcade fronting a more lucrative back room.", data: { cost: 1450000, incomePerDay: 120000, roiDays: 12, location: "Vice Beach" }, popularity: 80 },
  { type: "business", name: "Marina Boatyard", category: "Logistics", summary: "Smuggling hub with sea access for contraband.", data: { cost: 800000, incomePerDay: 95000, roiDays: 9, location: "Vice Marina" }, popularity: 75 },
  { type: "business", name: "Little Havana Bar", category: "Front", summary: "Low-cost passive earner with neighborhood charm.", data: { cost: 320000, incomePerDay: 38000, roiDays: 9, location: "Little Havana" }, popularity: 68 },
  // Properties
  { type: "property", name: "Ocean Drive Penthouse", category: "Apartment", summary: "Top-floor luxury with a 10-car garage and skyline views.", data: { price: 2400000, garageSize: 10, location: "Ocean Drive" }, popularity: 88 },
  { type: "property", name: "Keys Stilt House", category: "Safehouse", summary: "Secluded waterfront safehouse with private dock.", data: { price: 1100000, garageSize: 4, location: "The Keys" }, popularity: 72 },
  { type: "property", name: "Downtown Loft", category: "Apartment", summary: "Affordable starter loft close to the action.", data: { price: 320000, garageSize: 2, location: "Downtown" }, popularity: 70 },
  // Missions
  { type: "mission", name: "Gold Coast", category: "Story", summary: "A daring daytime robbery along the marina strip.", data: { payout: 250000, difficulty: "Medium", giver: "Lucia", duration: "25 min" }, popularity: 86 },
  { type: "mission", name: "Black Tide", category: "Heist", summary: "The game's marquee multi-stage heist finale.", data: { payout: 1500000, difficulty: "Hard", giver: "Jason", duration: "75 min" }, popularity: 96 },
  { type: "mission", name: "Neon Nights", category: "Side", summary: "Protect a nightclub shipment through downtown.", data: { payout: 90000, difficulty: "Easy", giver: "Boomer", duration: "12 min" }, popularity: 64 },
  // Characters
  { type: "character", name: "Lucia", category: "Protagonist", summary: "One of two playable leads; sharp, loyal and dangerous.", data: { role: "Protagonist", affiliation: "The Crew" }, popularity: 99 },
  { type: "character", name: "Jason", category: "Protagonist", summary: "The other playable lead; calm under pressure, deadly.", data: { role: "Protagonist", affiliation: "The Crew" }, popularity: 97 },
  { type: "character", name: "Boomer", category: "Ally", summary: "Eccentric fixer who supplies the crew's wildest jobs.", data: { role: "Fixer", affiliation: "Independent" }, popularity: 78 },
  // Crews
  { type: "crew", name: "Costa Cartel", category: "Cartel", summary: "Controls the coastal smuggling routes with an iron grip.", data: { territory: "The Keys & Marina", specialty: "Smuggling" }, popularity: 80 },
  { type: "crew", name: "Neon Kings", category: "Gang", summary: "Street gang ruling the downtown nightlife scene.", data: { territory: "Downtown", specialty: "Protection rackets" }, popularity: 74 },
  // Locations
  { type: "location", name: "Vice Beach", category: "District", summary: "Sun-soaked beachfront of neon, sand and money.", data: { district: "Vice City", type: "Beachfront" }, lat: 25.79, lng: -80.13, popularity: 92 },
  { type: "location", name: "Little Havana", category: "District", summary: "Vibrant cultural heart with hidden opportunities.", data: { district: "Vice City", type: "Neighborhood" }, lat: 25.765, lng: -80.22, popularity: 81 },
  { type: "location", name: "The Everglades", category: "Wilderness", summary: "Sprawling swampland perfect for discreet operations.", data: { district: "Leonida", type: "Wilderness" }, lat: 25.86, lng: -80.68, popularity: 70 },
  // Activities
  { type: "activity", name: "Beach Volleyball", category: "Minigame", summary: "Casual beachside sport with leaderboard bragging rights.", data: { type: "Sport", reward: "Rep + cash" }, popularity: 60 },
  { type: "activity", name: "Underground Poker", category: "Gambling", summary: "High-stakes card games in back-room dens.", data: { type: "Gambling", reward: "Variable winnings" }, popularity: 73 },
  // Races
  { type: "race", name: "Ocean Drive Sprint", category: "Street", summary: "Flat-out coastal sprint past the neon hotels.", data: { class: "Sports", length: "3.2 mi", reward: 45000 }, lat: 25.78, lng: -80.13, popularity: 82 },
  { type: "race", name: "Everglades Rally", category: "Off-road", summary: "Muddy off-road circuit through the swamps.", data: { class: "SUV", length: "5.1 mi", reward: 60000 }, lat: 25.85, lng: -80.6, popularity: 69 },
  // Easter eggs
  { type: "easter-egg", name: "The Sunken Jet", category: "Secret", summary: "A mysterious aircraft wreck rumored off the coast.", data: { location: "Offshore reef", difficulty: "Hard" }, lat: 25.7, lng: -80.05, popularity: 85 },
  { type: "easter-egg", name: "Bigfoot of the Glades", category: "Mystery", summary: "Late-night sightings deep in the Everglades.", data: { location: "The Everglades", difficulty: "Very Hard" }, lat: 25.88, lng: -80.7, popularity: 88 },
  // Achievements
  { type: "achievement", name: "Vice Royalty", category: "Completion", summary: "Reach 100% game completion.", data: { points: 100, rarity: "Legendary" }, popularity: 76 },
  { type: "achievement", name: "Made in Leonida", category: "Story", summary: "Complete the main story.", data: { points: 50, rarity: "Common" }, popularity: 90 },
  // Collectibles
  { type: "collectible", name: "Neon Signs", category: "Set", summary: "Hidden vintage neon signs across Vice City.", data: { setName: "Neon Signs", count: 50, reward: "Garage decor + cash" }, lat: 25.77, lng: -80.19, popularity: 71 },
  { type: "collectible", name: "Hidden Caches", category: "Set", summary: "Buried cash caches marked on treasure maps.", data: { setName: "Caches", count: 30, reward: "$25K each" }, lat: 25.82, lng: -80.4, popularity: 83 },
];

// Map markers spanning all map categories.
const markers = [
  { category: "cars", name: "Cheetah GT Dealership", description: "Buy the fastest car here.", lat: 25.79, lng: -80.13, entityType: "cars", entitySlug: "cheetah-gt" },
  { category: "businesses", name: "Beachfront Nightclub", description: "Best passive income.", lat: 25.785, lng: -80.125, entityType: "businesses", entitySlug: "neon-arcade" },
  { category: "weapons", name: "Ammu-Nation Vice Beach", description: "Stock up on firearms.", lat: 25.78, lng: -80.14, entityType: "weapons", entitySlug: "vice-carbine" },
  { category: "properties", name: "Ocean Drive Penthouse", description: "Luxury with a 10-car garage.", lat: 25.781, lng: -80.13, entityType: "properties", entitySlug: "ocean-drive-penthouse" },
  { category: "collectibles", name: "Neon Sign #1", description: "First hidden neon sign.", lat: 25.77, lng: -80.19 },
  { category: "secrets", name: "The Sunken Jet", description: "Mysterious offshore wreck.", lat: 25.7, lng: -80.05, entityType: "easter-eggs", entitySlug: "the-sunken-jet" },
  { category: "missions", name: "Gold Coast Start", description: "Mission start point.", lat: 25.765, lng: -80.18, entityType: "missions", entitySlug: "gold-coast" },
];

// ─────────────────────────── Search index build ─────────────────────────

type IndexRow = {
  id: string;
  name: string;
  summary: string;
  type: string; // entity kind
  typeLabel: string;
  route: string;
  category?: string | null;
  popularity: number;
};

async function buildSearchIndex() {
  const rows: IndexRow[] = [];

  const carRows = await db.car.findMany();
  for (const c of carRows) {
    rows.push({ id: c.id, name: c.name, summary: c.summary, type: "cars", typeLabel: "Car", route: `/cars/${c.slug}`, category: c.category, popularity: c.popularity });
  }

  const moneyRows = await db.moneyMethod.findMany();
  for (const m of moneyRows) {
    rows.push({ id: m.id, name: m.name, summary: m.summary, type: "money", typeLabel: "Money Method", route: `/money/${m.slug}`, category: m.category, popularity: m.popularity });
  }

  const entityRows = await db.entity.findMany();
  const labelByType: Record<string, { kind: string; label: string }> = {
    weapon: { kind: "weapons", label: "Weapon" },
    business: { kind: "businesses", label: "Business" },
    property: { kind: "properties", label: "Property" },
    mission: { kind: "missions", label: "Mission" },
    character: { kind: "characters", label: "Character" },
    crew: { kind: "crews", label: "Crew" },
    location: { kind: "locations", label: "Location" },
    activity: { kind: "activities", label: "Activity" },
    race: { kind: "races", label: "Race" },
    "easter-egg": { kind: "easter-eggs", label: "Easter Egg" },
    achievement: { kind: "achievements", label: "Achievement" },
    collectible: { kind: "collectibles", label: "Collectible" },
  };
  for (const e of entityRows) {
    const meta = labelByType[e.type];
    if (!meta) continue;
    rows.push({ id: e.id, name: e.name, summary: e.summary, type: meta.kind, typeLabel: meta.label, route: `/${meta.kind}/${e.slug}`, category: e.category, popularity: e.popularity });
  }

  rows.sort((a, b) => b.popularity - a.popularity);

  const outDir = join(process.cwd(), "src", "data");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "search-index.json"), JSON.stringify(rows, null, 0));
  console.log(`  → wrote search index with ${rows.length} rows`);
}

async function main() {
  console.log("Seeding ViceHub (illustrative placeholder data)…");

  // Clean slate (idempotent re-seeding).
  await db.mapMarker.deleteMany();
  await db.entity.deleteMany();
  await db.moneyMethod.deleteMany();
  await db.car.deleteMany();

  for (const c of cars) {
    await db.car.create({
      data: {
        slug: slug(c.name),
        name: c.name,
        summary: c.summary,
        category: c.category,
        topSpeed: c.topSpeed,
        acceleration: c.acceleration,
        braking: c.braking,
        handling: c.handling,
        price: c.price,
        location: c.location,
        unlockMethod: c.unlockMethod,
        realLifeInspiration: c.realLifeInspiration,
        popularity: c.popularity ?? 50,
      },
    });
  }
  console.log(`  → ${cars.length} cars`);

  for (const m of money) {
    await db.moneyMethod.create({
      data: {
        slug: slug(m.name),
        name: m.name,
        summary: m.summary,
        category: m.category,
        profitPerHour: m.profitPerHour,
        difficulty: m.difficulty,
        requiredInvestment: m.requiredInvestment,
        playersRequired: m.playersRequired,
        timeNeeded: m.timeNeeded,
        riskLevel: m.riskLevel,
        popularity: m.popularity,
        soloFriendly: m.soloFriendly,
        beginnerFriendly: m.beginnerFriendly,
        guide: m.guide,
      },
    });
  }
  console.log(`  → ${money.length} money methods`);

  for (const g of generic) {
    await db.entity.create({
      data: {
        type: g.type,
        slug: slug(g.name),
        name: g.name,
        summary: g.summary,
        category: g.category,
        data: JSON.stringify(g.data ?? {}),
        lat: g.lat,
        lng: g.lng,
        popularity: g.popularity ?? 50,
      },
    });
  }
  console.log(`  → ${generic.length} generic entities`);

  for (const mk of markers) {
    await db.mapMarker.create({ data: mk });
  }
  console.log(`  → ${markers.length} map markers`);

  await buildSearchIndex();
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
