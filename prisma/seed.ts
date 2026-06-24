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
  { name: "Phantom GTR", category: "Super", topSpeed: 213, acceleration: 97, braking: 86, handling: 92, price: 2750000, location: "Invite-only showroom", unlockMethod: "Reach Rank 100", realLifeInspiration: "Bugatti Chiron", summary: "Top-tier hypercar with the best all-round stats in the game.", popularity: 96 },
  { name: "Veloce Uno", category: "Super", topSpeed: 207, acceleration: 95, braking: 83, handling: 91, price: 1980000, location: "Little Cuba", unlockMethod: "Purchase", realLifeInspiration: "Pagani Huayra", summary: "Hand-built exotic with jewel-like detailing.", popularity: 87 },
  { name: "Riptide GT3", category: "Sports", topSpeed: 197, acceleration: 90, braking: 81, handling: 89, price: 940000, location: "Track pro shop", unlockMethod: "Win the Coastal Cup", realLifeInspiration: "Porsche GT3", summary: "Track-bred weapon that punishes mistakes and rewards skill.", popularity: 83 },
  { name: "Surge R", category: "Sports", topSpeed: 186, acceleration: 98, braking: 82, handling: 85, price: 760000, location: "EV showroom", unlockMethod: "Purchase", realLifeInspiration: "Porsche Taycan", summary: "Electric four-door with brutal instant acceleration.", popularity: 79 },
  { name: "Comet Retro", category: "Sports", topSpeed: 183, acceleration: 83, braking: 74, handling: 88, price: 480000, location: "Classic dealer", unlockMethod: "Purchase", realLifeInspiration: "Porsche 930", summary: "Air-cooled classic styling with modern grip.", popularity: 77 },
  { name: "Brawler R/T", category: "Muscle", topSpeed: 172, acceleration: 91, braking: 65, handling: 62, price: 280000, location: "Drag strip lot", unlockMethod: "Purchase", realLifeInspiration: "Dodge Charger", summary: "Four-door muscle built for quarter-mile glory.", popularity: 78 },
  { name: "Maverick 70", category: "Muscle", topSpeed: 166, acceleration: 85, braking: 61, handling: 59, price: 175000, location: "Junkyard auctions", unlockMethod: "Purchase", realLifeInspiration: "Chevy Chevelle", summary: "Raw vintage muscle, restored and rowdy.", popularity: 70 },
  { name: "Outback GX", category: "SUV", topSpeed: 144, acceleration: 72, braking: 71, handling: 67, price: 148000, location: "Suburban dealer", unlockMethod: "Purchase", realLifeInspiration: "Jeep Grand Cherokee", summary: "Do-it-all family hauler with light off-road chops.", popularity: 66 },
  { name: "Sovereign L", category: "SUV", topSpeed: 154, acceleration: 80, braking: 70, handling: 65, price: 330000, location: "Luxury dealer", unlockMethod: "Purchase", realLifeInspiration: "Bentley Bentayga", summary: "Opulent super-SUV that coddles and intimidates.", popularity: 74 },
  { name: "Sprint 600", category: "Bikes", topSpeed: 180, acceleration: 96, braking: 68, handling: 82, price: 72000, location: "Bike shop, Little Havana", unlockMethod: "Purchase", realLifeInspiration: "Yamaha R6", summary: "Razor-sharp middleweight sportbike for the canyons.", popularity: 73 },
  { name: "Dune Hopper", category: "Bikes", topSpeed: 120, acceleration: 88, braking: 64, handling: 86, price: 38000, location: "Everglades outpost", unlockMethod: "Purchase", realLifeInspiration: "KTM dirt bike", summary: "Lightweight dirt bike that conquers the swamps.", popularity: 61 },
  { name: "Tarpon 52", category: "Boats", topSpeed: 104, acceleration: 64, braking: 52, handling: 68, price: 980000, location: "Vice Marina", unlockMethod: "Purchase", realLifeInspiration: "Offshore race catamaran", summary: "Twin-hull speed demon that dominates open water.", popularity: 67 },
  { name: "Lagoon Yacht", category: "Boats", topSpeed: 58, acceleration: 40, braking: 45, handling: 60, price: 5500000, location: "Marina brokerage", unlockMethod: "Purchase", realLifeInspiration: "Superyacht", summary: "A floating mansion and the ultimate status symbol.", popularity: 75 },
  { name: "Stratos 200", category: "Aircraft", topSpeed: 320, acceleration: 90, braking: 38, handling: 74, price: 6800000, location: "Escobar Intl. hangar", unlockMethod: "Complete 'Sky High' mission", realLifeInspiration: "Learjet", summary: "The fastest aircraft in the game; coast to coast in moments.", popularity: 80 },
  { name: "Scout LSV", category: "SUV", topSpeed: 136, acceleration: 64, braking: 74, handling: 70, price: 96000, location: "Everglades outpost", unlockMethod: "Purchase", realLifeInspiration: "Ford Bronco", summary: "Boxy retro 4x4 with genuine trail capability.", popularity: 69 },
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
  { name: "Arcade Management", category: "Passive", profitPerHour: 155000, difficulty: "Easy", requiredInvestment: 1450000, playersRequired: 1, timeNeeded: "5 min upkeep/day", riskLevel: "Low", popularity: 81, soloFriendly: true, beginnerFriendly: true, summary: "Run the Neon Arcade as a front for steady passive cash.", guide: "## Arcade Management\n\n1. Buy the **Neon Arcade** and stock machines.\n2. Collect from the back-room safe daily.\n3. Upgrade machines to raise the income cap.\n\nA reliable passive earner that funds bigger plays." },
  { name: "Cargo Air Freight", category: "Co-op", profitPerHour: 510000, difficulty: "Hard", requiredInvestment: 2200000, playersRequired: 2, timeNeeded: "55-75 min", riskLevel: "High", popularity: 86, soloFriendly: false, beginnerFriendly: false, summary: "Source and sell high-value air cargo across Leonida.", guide: "## Cargo Air Freight\n\n1. Buy a **hangar** and aircraft.\n2. Source crates from across the map.\n3. Defend deliveries with a co-pilot gunner.\n\nTop-tier profit for an organized duo." },
  { name: "Casino Heist", category: "Heist", profitPerHour: 650000, difficulty: "Hard", requiredInvestment: 100000, playersRequired: 2, timeNeeded: "70-100 min", riskLevel: "High", popularity: 94, soloFriendly: false, beginnerFriendly: false, summary: "The most replayable big-money heist with multiple approaches.", guide: "## Casino Heist\n\n1. Scope every access point during setup.\n2. Choose stealth (big diamond) or aggressive.\n3. Split take fairly to keep your crew coming back.\n\nThe gold standard of crew heists." },
  { name: "Daily Vehicle Theft", category: "Solo", profitPerHour: 110000, difficulty: "Easy", requiredInvestment: 0, playersRequired: 1, timeNeeded: "Any", riskLevel: "Low", popularity: 75, soloFriendly: true, beginnerFriendly: true, summary: "Grab the daily marked vehicles and sell to the chop shop.", guide: "## Daily Vehicle Theft\n\n1. Check the chop-shop board for daily targets.\n2. Steal, lose the cops, deliver clean.\n3. One full board resets every in-game day.\n\nZero-investment income for any level." },
  { name: "Drone Surveillance Gigs", category: "Solo", profitPerHour: 130000, difficulty: "Medium", requiredInvestment: 150000, playersRequired: 1, timeNeeded: "10-15 min/gig", riskLevel: "Low", popularity: 64, soloFriendly: true, beginnerFriendly: true, summary: "Accept recon contracts and photograph targets discreetly.", guide: "## Drone Surveillance Gigs\n\n1. Buy a recon drone kit.\n2. Photograph marked targets without being spotted.\n3. Bonus pay for full stealth completions.\n\nA low-risk, screen-time-light earner." },
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
  { type: "weapon", name: "Hailstorm LMG", category: "Heavy", summary: "Belt-fed light machine gun for suppressing fire.", data: { weaponType: "LMG", damage: 78, fireRate: 88, range: 60, price: 78000, unlock: "Rank 45" }, popularity: 74 },
  { type: "weapon", name: "Coral Knife", category: "Melee", summary: "Concealable blade for silent close-quarters takedowns.", data: { weaponType: "Melee", damage: 60, fireRate: 50, range: 5, price: 1500, unlock: "Default" }, popularity: 58 },
  { type: "weapon", name: "Stinger AT", category: "Heavy", summary: "Lock-on launcher that swats aircraft from the sky.", data: { weaponType: "Launcher", damage: 100, fireRate: 10, range: 80, price: 165000, unlock: "Rank 70" }, popularity: 69 },
  { type: "weapon", name: "Pulse SMG", category: "SMG", summary: "Suppressed PDW favored for stealth heist approaches.", data: { weaponType: "SMG", damage: 52, fireRate: 90, range: 42, price: 34000, unlock: "Complete 'Silent Tide'" }, popularity: 72 },
  { type: "weapon", name: "Longbill Sniper", category: "Sniper", summary: "Bolt-action heavy sniper with one-shot stopping power.", data: { weaponType: "Sniper", damage: 100, fireRate: 12, range: 98, price: 92000, unlock: "Rank 90" }, popularity: 77 },
  { type: "weapon", name: "Vandal AP", category: "Pistol", summary: "Full-auto machine pistol for drive-by mayhem.", data: { weaponType: "Pistol", damage: 40, fireRate: 92, range: 28, price: 22000, unlock: "Ammu-Nation" }, popularity: 66 },
  // Businesses
  { type: "business", name: "Everglades Lab", category: "Production", summary: "Discreet production lab churning out high-value product.", data: { cost: 950000, incomePerDay: 110000, roiDays: 9, location: "The Everglades" }, popularity: 79 },
  { type: "business", name: "Vice Vinyl Records", category: "Front", summary: "Record store laundering cash through nightlife promos.", data: { cost: 560000, incomePerDay: 52000, roiDays: 11, location: "Downtown Vice" }, popularity: 63 },
  { type: "business", name: "Keys Charter Co.", category: "Logistics", summary: "Boat charter business doubling as a smuggling cover.", data: { cost: 1250000, incomePerDay: 130000, roiDays: 10, location: "The Keys" }, popularity: 71 },
  { type: "business", name: "Sunshine Taxi Fleet", category: "Service", summary: "Own the taxi depot and skim every fare in the city.", data: { cost: 380000, incomePerDay: 41000, roiDays: 9, location: "Little Havana" }, popularity: 60 },
  { type: "business", name: "Neon Strip Club", category: "Front", summary: "Glittering club with VIP rooms and quiet back-office money.", data: { cost: 1650000, incomePerDay: 140000, roiDays: 12, location: "Vice Beach" }, popularity: 82 },
  { type: "business", name: "Auto Salvage Yard", category: "Vehicle", summary: "Strip stolen vehicles for parts and clean profit.", data: { cost: 420000, incomePerDay: 58000, roiDays: 8, location: "Industrial District" }, popularity: 67 },
  // Properties
  { type: "property", name: "Marina Superyacht Berth", category: "Special", summary: "Permanent berth for your superyacht with concierge service.", data: { price: 3200000, garageSize: 0, location: "Vice Marina" }, popularity: 73 },
  { type: "property", name: "Hilltop Villa", category: "Mansion", summary: "Gated hillside mansion with a 20-car underground garage.", data: { price: 6500000, garageSize: 20, location: "Vista Heights" }, popularity: 90 },
  { type: "property", name: "Industrial Warehouse", category: "Garage", summary: "Cavernous warehouse for cargo operations and vehicle storage.", data: { price: 1400000, garageSize: 30, location: "Industrial District" }, popularity: 68 },
  { type: "property", name: "Beachside Bungalow", category: "Safehouse", summary: "Breezy starter beach home steps from the sand.", data: { price: 540000, garageSize: 2, location: "Vice Beach" }, popularity: 66 },
  { type: "property", name: "Glades Hideout", category: "Safehouse", summary: "Off-grid swamp cabin for laying low after a job.", data: { price: 380000, garageSize: 3, location: "The Everglades" }, popularity: 57 },
  // Missions
  { type: "mission", name: "First Blood", category: "Story", summary: "The opening job that pulls Lucia and Jason together.", data: { payout: 40000, difficulty: "Easy", giver: "Lucia", duration: "15 min" }, popularity: 88 },
  { type: "mission", name: "Sky High", category: "Story", summary: "Hijack a private jet mid-runway in a daring airport raid.", data: { payout: 420000, difficulty: "Hard", giver: "Boomer", duration: "35 min" }, popularity: 84 },
  { type: "mission", name: "Silent Tide", category: "Heist", summary: "A stealth dock infiltration to seize a contraband shipment.", data: { payout: 320000, difficulty: "Medium", giver: "Jason", duration: "28 min" }, popularity: 80 },
  { type: "mission", name: "Cartel Ledger", category: "Side", summary: "Retrieve incriminating books from a cartel safehouse.", data: { payout: 120000, difficulty: "Medium", giver: "Lucia", duration: "18 min" }, popularity: 71 },
  { type: "mission", name: "Last Call", category: "Story", summary: "The explosive story finale across the Vice City skyline.", data: { payout: 2000000, difficulty: "Hard", giver: "Story", duration: "90 min" }, popularity: 98 },
  { type: "mission", name: "Repo Run", category: "Side", summary: "Repossess a fleet of luxury cars before dawn.", data: { payout: 75000, difficulty: "Easy", giver: "Sunset Auto Shop", duration: "14 min" }, popularity: 62 },
  { type: "mission", name: "Glades Ambush", category: "Side", summary: "Survive a swampland ambush and turn the tables.", data: { payout: 140000, difficulty: "Hard", giver: "Costa Cartel", duration: "22 min" }, popularity: 68 },
  // Characters
  { type: "character", name: "Detective Reyes", category: "Antagonist", summary: "Dogged Vice PD detective hunting the crew.", data: { role: "Detective", affiliation: "Vice PD" }, popularity: 70 },
  { type: "character", name: "Marisol", category: "Ally", summary: "Cartel insider playing both sides for survival.", data: { role: "Informant", affiliation: "Costa Cartel" }, popularity: 75 },
  { type: "character", name: "Tito Vega", category: "Antagonist", summary: "Ruthless cartel lieutenant with a long memory.", data: { role: "Enforcer", affiliation: "Costa Cartel" }, popularity: 72 },
  { type: "character", name: "DJ Halo", category: "Ally", summary: "Nightclub DJ and the crew's eyes on the strip.", data: { role: "Fixer", affiliation: "Neon Kings" }, popularity: 66 },
  { type: "character", name: "Agent Cole", category: "Antagonist", summary: "Federal agent building a RICO case on Leonida's gangs.", data: { role: "Federal Agent", affiliation: "FIB" }, popularity: 68 },
  { type: "character", name: "Mama Lou", category: "Ally", summary: "Little Havana matriarch who shelters the crew.", data: { role: "Safehouse Keeper", affiliation: "Independent" }, popularity: 64 },
  { type: "character", name: "Slick Ramos", category: "Ally", summary: "Smooth-talking arms dealer with deep inventory.", data: { role: "Arms Dealer", affiliation: "Independent" }, popularity: 67 },
  // Crews
  { type: "crew", name: "Glades Syndicate", category: "Cartel", summary: "Swamp-based outfit running labs and gun trafficking.", data: { territory: "The Everglades", specialty: "Production & arms" }, popularity: 71 },
  { type: "crew", name: "Marina Mob", category: "Mafia", summary: "Old-school crime family controlling the docks.", data: { territory: "Vice Marina", specialty: "Loan sharking & docks" }, popularity: 69 },
  { type: "crew", name: "Sunset Riders", category: "Gang", summary: "Biker crew dominating the coastal highways.", data: { territory: "Coastal Highway", specialty: "Smuggling runs" }, popularity: 65 },
  { type: "crew", name: "Vista Cartel", category: "Cartel", summary: "Hillside elite moving weight behind a legit facade.", data: { territory: "Vista Heights", specialty: "Money laundering" }, popularity: 73 },
  // Locations
  { type: "location", name: "Downtown Vice", category: "District", summary: "Glass towers, nightlife and the city's beating heart.", data: { district: "Vice City", type: "Urban core" }, lat: 25.774, lng: -80.19, popularity: 89 },
  { type: "location", name: "Vista Heights", category: "District", summary: "Exclusive hillside enclave of mansions and old money.", data: { district: "Vice City", type: "Hills" }, lat: 25.73, lng: -80.27, popularity: 78 },
  { type: "location", name: "The Keys", category: "Region", summary: "Strung-out island chain of marinas and hideaways.", data: { district: "Leonida", type: "Islands" }, lat: 24.95, lng: -80.6, popularity: 76 },
  { type: "location", name: "Industrial District", category: "District", summary: "Warehouses, docks and the grit behind the glamour.", data: { district: "Vice City", type: "Industrial" }, lat: 25.79, lng: -80.24, popularity: 64 },
  { type: "location", name: "Escobar International", category: "Landmark", summary: "Leonida's main airport and a hotbed of high-stakes jobs.", data: { district: "Vice City", type: "Airport" }, lat: 25.8, lng: -80.28, popularity: 72 },
  { type: "location", name: "Ocean Drive", category: "Landmark", summary: "The neon-lit strip of art-deco hotels and supercars.", data: { district: "Vice Beach", type: "Strip" }, lat: 25.78, lng: -80.13, popularity: 91 },
  // Activities
  { type: "activity", name: "Street Racing", category: "Driving", summary: "Pink-slip street races that erupt after dark.", data: { type: "Racing", reward: "Cash + cars" }, popularity: 84 },
  { type: "activity", name: "Deep-Sea Fishing", category: "Leisure", summary: "Charter out for marlin and the occasional sunken secret.", data: { type: "Leisure", reward: "Cash + collectibles" }, popularity: 58 },
  { type: "activity", name: "Golf", category: "Sport", summary: "Unwind on the exclusive Vista Heights course.", data: { type: "Sport", reward: "Rep" }, popularity: 52 },
  { type: "activity", name: "Drag Racing", category: "Driving", summary: "Quarter-mile showdowns at the industrial strip.", data: { type: "Racing", reward: "Cash" }, popularity: 70 },
  { type: "activity", name: "Stunt Jumps", category: "Driving", summary: "Hidden ramps scattered across Leonida for big air.", data: { type: "Challenge", reward: "Completion + cash" }, popularity: 67 },
  // Races
  { type: "race", name: "Downtown Circuit", category: "Street", summary: "Tight technical loop through the financial district.", data: { class: "Super", length: "4.0 mi", reward: 70000 }, lat: 25.774, lng: -80.19, popularity: 79 },
  { type: "race", name: "Keys Coastal Run", category: "Point-to-point", summary: "Island-hopping sprint across the bridges of the Keys.", data: { class: "Sports", length: "8.4 mi", reward: 95000 }, lat: 24.95, lng: -80.6, popularity: 76 },
  { type: "race", name: "Airport Time Trial", category: "Time Trial", summary: "Solo flat-out blast down the runways and taxiways.", data: { class: "Super", length: "2.6 mi", reward: 40000 }, lat: 25.8, lng: -80.28, popularity: 63 },
  { type: "race", name: "Vista Hillclimb", category: "Hillclimb", summary: "Twisting hillside ascent that demands perfect lines.", data: { class: "Sports", length: "3.8 mi", reward: 65000 }, lat: 25.73, lng: -80.27, popularity: 68 },
  // Easter eggs
  { type: "easter-egg", name: "Ghost of the Lighthouse", category: "Mystery", summary: "A spectral figure rumored to appear at the old lighthouse.", data: { location: "Keys Lighthouse", difficulty: "Hard" }, lat: 24.9, lng: -80.65, popularity: 80 },
  { type: "easter-egg", name: "Alien Signal", category: "Secret", summary: "A strange broadcast traced to a remote glades antenna.", data: { location: "The Everglades", difficulty: "Very Hard" }, lat: 25.9, lng: -80.72, popularity: 84 },
  { type: "easter-egg", name: "The Mural Code", category: "Puzzle", summary: "A downtown mural hiding coordinates to buried cash.", data: { location: "Downtown Vice", difficulty: "Medium" }, lat: 25.772, lng: -80.193, popularity: 77 },
  { type: "easter-egg", name: "Vintage Arcade Cabinet", category: "Reference", summary: "A playable retro minigame hidden in the Neon Arcade.", data: { location: "Neon Arcade", difficulty: "Easy" }, lat: 25.785, lng: -80.125, popularity: 73 },
  // Achievements
  { type: "achievement", name: "King of Vice", category: "Wealth", summary: "Amass $10,000,000 in total earnings.", data: { points: 75, rarity: "Rare" }, popularity: 72 },
  { type: "achievement", name: "Gearhead", category: "Collection", summary: "Own one car from every class.", data: { points: 30, rarity: "Uncommon" }, popularity: 68 },
  { type: "achievement", name: "Heistmaster", category: "Combat", summary: "Complete every heist on the hard approach.", data: { points: 60, rarity: "Rare" }, popularity: 79 },
  { type: "achievement", name: "Explorer", category: "Exploration", summary: "Discover every district and landmark in Leonida.", data: { points: 40, rarity: "Uncommon" }, popularity: 65 },
  { type: "achievement", name: "Untouchable", category: "Combat", summary: "Survive a 5-star wanted level for 10 minutes.", data: { points: 50, rarity: "Rare" }, popularity: 70 },
  { type: "achievement", name: "Collector Supreme", category: "Collection", summary: "Find every collectible set in the game.", data: { points: 80, rarity: "Legendary" }, popularity: 74 },
  // Collectibles
  { type: "collectible", name: "Vinyl Records", category: "Set", summary: "Rare records hidden in shops and apartments citywide.", data: { setName: "Vinyl Records", count: 40, reward: "Penthouse jukebox tracks" }, lat: 25.776, lng: -80.2, popularity: 66 },
  { type: "collectible", name: "Street Art Tags", category: "Set", summary: "Hidden graffiti tags by a famous Vice City artist.", data: { setName: "Street Art", count: 25, reward: "Custom spray + cash" }, lat: 25.768, lng: -80.21, popularity: 64 },
  { type: "collectible", name: "Snapshots", category: "Set", summary: "Photo-op landmarks to capture for a tourism reward.", data: { setName: "Snapshots", count: 35, reward: "Camera filters + cash" }, lat: 25.78, lng: -80.135, popularity: 60 },
  { type: "collectible", name: "Cartel Stashes", category: "Set", summary: "Hidden cartel weapon stashes guarded across the map.", data: { setName: "Cartel Stashes", count: 20, reward: "Free weapons + ammo" }, lat: 25.86, lng: -80.5, popularity: 75 },
  { type: "collectible", name: "Vintage Cars", category: "Set", summary: "Barn-find classics waiting to be discovered and restored.", data: { setName: "Vintage Cars", count: 12, reward: "Free classic cars" }, lat: 25.84, lng: -80.45, popularity: 82 },
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
  { category: "properties", name: "Hilltop Villa", description: "Mansion with a 20-car garage.", lat: 25.73, lng: -80.27, entityType: "properties", entitySlug: "hilltop-villa" },
  { category: "businesses", name: "Everglades Lab", description: "High-value production lab.", lat: 25.86, lng: -80.68, entityType: "businesses", entitySlug: "everglades-lab" },
  { category: "secrets", name: "Alien Signal", description: "Strange broadcast source.", lat: 25.9, lng: -80.72, entityType: "easter-eggs", entitySlug: "alien-signal" },
  { category: "secrets", name: "Ghost of the Lighthouse", description: "Spectral sighting.", lat: 24.9, lng: -80.65, entityType: "easter-eggs", entitySlug: "ghost-of-the-lighthouse" },
  { category: "collectibles", name: "Vintage Car Barn", description: "Hidden classic car.", lat: 25.84, lng: -80.45, entityType: "collectibles", entitySlug: "vintage-cars" },
  { category: "weapons", name: "Ammu-Nation Downtown", description: "Full arsenal in stock.", lat: 25.774, lng: -80.195, entityType: "weapons", entitySlug: "hailstorm-lmg" },
  { category: "cars", name: "Vista Heights Showroom", description: "Exotic hypercars.", lat: 25.73, lng: -80.272, entityType: "cars", entitySlug: "phantom-gtr" },
];

// ─────────────────────────────── Giveaways ──────────────────────────────
// Site-run prize draws — a recurring-traffic engine. Dates are computed
// relative to "now" so the seed always has live, upcoming and past examples.

type GiveawaySeed = {
  title: string;
  prize: string;
  summary: string;
  description: string;
  prizeValue: number;
  status: "ACTIVE" | "ENDED" | "UPCOMING";
  featured?: boolean;
  daysFromNow: number; // endsAt offset (negative = already ended)
  winnerName?: string;
};

const giveaways: GiveawaySeed[] = [
  {
    title: "GTA 6 Launch Mega Giveaway",
    prize: "GTA 6 (any platform) + 1 Year of ViceHub Premium",
    summary: "Win a free copy of GTA 6 at launch plus a full year of Premium.",
    description:
      "## GTA 6 Launch Mega Giveaway\n\nWe're giving one lucky member a **free copy of GTA 6** on the platform of their choice, plus **12 months of ViceHub Premium**.\n\n### How to enter\n1. Create a free ViceHub account and hit **Enter Giveaway**.\n2. **+2 bonus entries** for joining our Discord.\n3. **+1 bonus entry** for sharing the giveaway.\n\n### Rules\n- One entry per account. Bonus entries stack.\n- Winner drawn at random and announced here and on Discord.\n- Must be 18+ or have guardian consent. No purchase necessary.",
    prizeValue: 110,
    status: "ACTIVE",
    featured: true,
    daysFromNow: 21,
  },
  {
    title: "Weekly $5 Steam Card Drop",
    prize: "$5 Steam Gift Card",
    summary: "A quick weekly draw — low effort, easy win. Resets every week.",
    description:
      "## Weekly $5 Steam Card Drop\n\nOur lowest-effort giveaway: enter once and you're in this week's draw for a **$5 Steam gift card**.\n\n### How to enter\n1. Sign in and click **Enter Giveaway**.\n2. **+2 bonus entries** for joining the Discord.\n\nDrawn every week. New card, new winner.",
    prizeValue: 5,
    status: "ACTIVE",
    daysFromNow: 5,
  },
  {
    title: "Vice City Merch Bundle",
    prize: "Official-style ViceHub T-shirt + sticker pack",
    summary: "Rep the community with a neon ViceHub merch bundle.",
    description:
      "## Vice City Merch Bundle\n\nWin a **ViceHub tee** and a **neon sticker pack** shipped to your door.\n\n### How to enter\n1. Sign in and click **Enter Giveaway**.\n2. **+2 bonus entries** for joining the Discord.\n3. **+1 bonus entry** for sharing.\n\nShips worldwide. Drawn at the end of the month.",
    prizeValue: 35,
    status: "ACTIVE",
    daysFromNow: 12,
  },
  {
    title: "Discord Nitro — 3 Months",
    prize: "3 Months of Discord Nitro",
    summary: "Boost your profile with a quarter-year of Nitro.",
    description:
      "## Discord Nitro — 3 Months\n\nWin **3 months of Discord Nitro** to flex in our community server.\n\n### How to enter\n1. Sign in and click **Enter Giveaway**.\n2. **+2 bonus entries** for joining the Discord (you'll want it for this one).",
    prizeValue: 30,
    status: "UPCOMING",
    daysFromNow: 30,
  },
  {
    title: "Launch-Week $50 Cash Giveaway",
    prize: "$50 PayPal Cash",
    summary: "Our first-ever cash drop. Now closed — see the winner inside.",
    description:
      "## Launch-Week $50 Cash Giveaway\n\nThank you to everyone who entered our very first giveaway! **$50 PayPal cash** went out to one random member.\n\nFollow us and join the Discord so you never miss the next one.",
    prizeValue: 50,
    status: "ENDED",
    daysFromNow: -7,
    winnerName: "VicePlayer_Mia",
  },
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
  await db.giveawayEntry.deleteMany();
  await db.giveaway.deleteMany();
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

  const DAY = 24 * 60 * 60 * 1000;
  for (const g of giveaways) {
    const endsAt = new Date(Date.now() + g.daysFromNow * DAY);
    const startsAt =
      g.status === "UPCOMING"
        ? new Date(Date.now() + 3 * DAY)
        : new Date(Date.now() - 14 * DAY);
    await db.giveaway.create({
      data: {
        slug: slug(g.title),
        title: g.title,
        prize: g.prize,
        summary: g.summary,
        description: g.description,
        prizeValue: g.prizeValue,
        status: g.status,
        featured: g.featured ?? false,
        startsAt,
        endsAt,
        winnerName: g.winnerName,
      },
    });
  }
  console.log(`  → ${giveaways.length} giveaways`);

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
