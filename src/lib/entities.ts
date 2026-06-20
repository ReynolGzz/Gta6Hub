/**
 * Central registry of every ViceHub entity type. Drives navigation, the
 * generic list/detail templates, search labels, sitemaps and internal linking.
 *
 * "cars" and "money" have bespoke pages/tables; the remaining types render
 * through the shared generic templates keyed off `Entity.type`.
 */

export type EntityKind =
  | "cars"
  | "money"
  | "weapons"
  | "businesses"
  | "properties"
  | "missions"
  | "characters"
  | "crews"
  | "locations"
  | "activities"
  | "races"
  | "easter-eggs"
  | "achievements"
  | "collectibles";

export interface EntityConfig {
  kind: EntityKind;
  /** Discriminator stored in the generic Entity.type column (null for bespoke tables). */
  dbType: string | null;
  label: string; // plural display
  singular: string;
  route: string; // base route, e.g. /cars
  icon: string; // lucide icon name
  accent: "pink" | "purple" | "blue";
  description: string;
  /** Ordered list of fields surfaced on generic detail pages (from Entity.data). */
  fields?: { key: string; label: string; type?: "text" | "money" | "number" }[];
  mappable?: boolean;
}

export const ENTITIES: EntityConfig[] = [
  {
    kind: "cars",
    dbType: null,
    label: "Cars",
    singular: "Car",
    route: "/cars",
    icon: "Car",
    accent: "pink",
    description:
      "Every vehicle in GTA 6 with full performance stats, prices and locations.",
    mappable: true,
  },
  {
    kind: "money",
    dbType: null,
    label: "Money Methods",
    singular: "Money Method",
    route: "/money",
    icon: "DollarSign",
    accent: "blue",
    description:
      "The most profitable ways to make money, ranked by profit/hour and ROI.",
  },
  {
    kind: "weapons",
    dbType: "weapon",
    label: "Weapons",
    singular: "Weapon",
    route: "/weapons",
    icon: "Crosshair",
    accent: "pink",
    description: "Firearms, melee and explosives with damage and unlock data.",
    fields: [
      { key: "weaponType", label: "Type" },
      { key: "damage", label: "Damage", type: "number" },
      { key: "fireRate", label: "Fire Rate", type: "number" },
      { key: "range", label: "Range", type: "number" },
      { key: "price", label: "Price", type: "money" },
      { key: "unlock", label: "Unlock" },
    ],
    mappable: true,
  },
  {
    kind: "businesses",
    dbType: "business",
    label: "Businesses",
    singular: "Business",
    route: "/businesses",
    icon: "Building2",
    accent: "blue",
    description: "Ownable businesses ranked by ROI and passive income.",
    fields: [
      { key: "cost", label: "Cost", type: "money" },
      { key: "incomePerDay", label: "Income / day", type: "money" },
      { key: "roiDays", label: "ROI (days)", type: "number" },
      { key: "location", label: "Location" },
    ],
    mappable: true,
  },
  {
    kind: "properties",
    dbType: "property",
    label: "Properties",
    singular: "Property",
    route: "/properties",
    icon: "Home",
    accent: "purple",
    description: "Apartments, garages and safehouses across Leonida.",
    fields: [
      { key: "price", label: "Price", type: "money" },
      { key: "garageSize", label: "Garage", type: "number" },
      { key: "location", label: "Location" },
    ],
    mappable: true,
  },
  {
    kind: "missions",
    dbType: "mission",
    label: "Missions",
    singular: "Mission",
    route: "/missions",
    icon: "Target",
    accent: "pink",
    description: "Story and side missions with payouts and requirements.",
    fields: [
      { key: "payout", label: "Payout", type: "money" },
      { key: "difficulty", label: "Difficulty" },
      { key: "giver", label: "Given by" },
      { key: "duration", label: "Duration" },
    ],
  },
  {
    kind: "characters",
    dbType: "character",
    label: "Characters",
    singular: "Character",
    route: "/characters",
    icon: "User",
    accent: "purple",
    description: "Protagonists, allies and antagonists of Vice City.",
    fields: [
      { key: "role", label: "Role" },
      { key: "affiliation", label: "Affiliation" },
    ],
  },
  {
    kind: "crews",
    dbType: "crew",
    label: "Crews",
    singular: "Crew",
    route: "/crews",
    icon: "Users",
    accent: "blue",
    description: "Gangs, cartels and organizations operating in Leonida.",
    fields: [
      { key: "territory", label: "Territory" },
      { key: "specialty", label: "Specialty" },
    ],
  },
  {
    kind: "locations",
    dbType: "location",
    label: "Locations",
    singular: "Location",
    route: "/locations",
    icon: "MapPin",
    accent: "blue",
    description: "Neighborhoods and landmarks across the Vice City map.",
    fields: [
      { key: "district", label: "District" },
      { key: "type", label: "Type" },
    ],
    mappable: true,
  },
  {
    kind: "activities",
    dbType: "activity",
    label: "Activities",
    singular: "Activity",
    route: "/activities",
    icon: "Gamepad2",
    accent: "purple",
    description: "Side activities, minigames and diversions.",
    fields: [
      { key: "type", label: "Type" },
      { key: "reward", label: "Reward" },
    ],
  },
  {
    kind: "races",
    dbType: "race",
    label: "Races",
    singular: "Race",
    route: "/races",
    icon: "Flag",
    accent: "pink",
    description: "Street races, circuits and time trials.",
    fields: [
      { key: "class", label: "Class" },
      { key: "length", label: "Length" },
      { key: "reward", label: "Reward", type: "money" },
    ],
    mappable: true,
  },
  {
    kind: "easter-eggs",
    dbType: "easter-egg",
    label: "Easter Eggs",
    singular: "Easter Egg",
    route: "/easter-eggs",
    icon: "Egg",
    accent: "purple",
    description: "Hidden secrets, references and mysteries.",
    fields: [
      { key: "location", label: "Location" },
      { key: "difficulty", label: "Difficulty" },
    ],
    mappable: true,
  },
  {
    kind: "achievements",
    dbType: "achievement",
    label: "Achievements",
    singular: "Achievement",
    route: "/achievements",
    icon: "Trophy",
    accent: "blue",
    description: "Trophies and achievements with unlock requirements.",
    fields: [
      { key: "points", label: "Points", type: "number" },
      { key: "rarity", label: "Rarity" },
    ],
  },
  {
    kind: "collectibles",
    dbType: "collectible",
    label: "Collectibles",
    singular: "Collectible",
    route: "/collectibles",
    icon: "Gem",
    accent: "pink",
    description: "Collectible sets scattered across the map.",
    fields: [
      { key: "setName", label: "Set" },
      { key: "count", label: "Count", type: "number" },
      { key: "reward", label: "Reward" },
    ],
    mappable: true,
  },
];

export const ENTITY_BY_KIND = Object.fromEntries(
  ENTITIES.map((e) => [e.kind, e])
) as Record<EntityKind, EntityConfig>;

export const GENERIC_ENTITIES = ENTITIES.filter((e) => e.dbType !== null);

export function entityByDbType(dbType: string): EntityConfig | undefined {
  return ENTITIES.find((e) => e.dbType === dbType);
}

export function entityByKind(kind: string): EntityConfig | undefined {
  return ENTITY_BY_KIND[kind as EntityKind];
}

export const CAR_CATEGORIES = [
  "Super",
  "Sports",
  "Muscle",
  "SUV",
  "Bikes",
  "Boats",
  "Aircraft",
] as const;

export const MAP_CATEGORIES = [
  "cars",
  "businesses",
  "weapons",
  "properties",
  "collectibles",
  "secrets",
  "missions",
] as const;
