import type { IconName } from "./services";

export type CatalogItem = { id: string; name: string; spec: string };
export type Category = {
  slug: string;
  title: string;
  icon: IconName;
  summary: string;
  items: CatalogItem[];
};

function items(prefix: string, list: [string, string][]): CatalogItem[] {
  return list.map(([name, spec], i) => ({ id: `${prefix}-${i + 1}`, name, spec }));
}

export const categories: Category[] = [
  {
    slug: "process-machine-parts",
    title: "Process Machine Parts",
    icon: "cog",
    summary: "SS contact parts for process equipment, manufactured in-house to drawing or sample.",
    items: items("pmp", [
      ["Product contact parts", "SS 316L · machined to drawing / sample"],
      ["Shafts, bushes & couplings", "SS 304 / SS 316L / EN8"],
      ["Agitator blades & impellers", "SS 316L · mirror / matt finish"],
      ["Sieves, screens & meshes", "SS 316 · mesh size as specified"],
      ["Hoppers & chutes", "SS 316L contact · SS 304 non-contact"],
      ["Gaskets & seals", "Silicone · EPDM · PTFE · Viton"],
      ["Tri-clover ferrules & clamps", "SS 316L · ½\" to 4\""],
    ]),
  },
  {
    slug: "piping-materials",
    title: "Piping Materials",
    icon: "pipe",
    summary: "Process and utility piping in stainless and carbon steel, with fittings and valves.",
    items: items("pip", [
      ["Seamless & welded pipes", "SS 304 / SS 316L · Sch 10 / 40"],
      ["Orbital-weld tubes (OD)", "SS 316L · electropolished option"],
      ["Elbows, tees & reducers", "SS 304 / SS 316L · BW / TC ends"],
      ["Flanges", "SS / MS · ANSI / DIN / IS"],
      ["Ball, butterfly & diaphragm valves", "SS 316L · TC / flanged / threaded"],
      ["MS & GI utility pipes", "IS 1239 / IS 3589"],
      ["Pipe supports & clamps", "SS / MS · as per layout"],
    ]),
  },
  {
    slug: "fabrication-materials",
    title: "Fabrication Materials",
    icon: "layers",
    summary: "Stainless and mild steel stock for fabrication, maintenance and projects.",
    items: items("fab", [
      ["Sheets & plates", "SS 304 / SS 316L · 2B / BA / No.4"],
      ["Angles, channels & flats", "SS / MS · IS sizes"],
      ["Round & square bars", "SS 304 / SS 316L / MS / EN8"],
      ["Hollow sections & tubes", "SS / MS · square / rectangular"],
      ["Fasteners", "SS 304 / SS 316 · metric"],
      ["Welding consumables", "ER308L / ER316L filler · electrodes"],
    ]),
  },
  {
    slug: "cleanroom-ss-items",
    title: "SS Items for Cleanrooms",
    icon: "sparkles",
    summary: "GMP-friendly stainless steel furniture and accessories with crevice-free finishes.",
    items: items("cln", [
      ["SS trolleys", "SS 304 / SS 316 · custom shelf layout"],
      ["SS work tables", "SS 304 · cleanroom finish"],
      ["SS racks & pallets", "SS 304 · perforated / solid shelves"],
      ["Garment cubicles & cross-over benches", "SS 304"],
      ["Pedal-operated bins", "SS 304 · various capacities"],
      ["Step stools & platforms", "SS 304 · anti-skid"],
      ["Hand sanitiser stands", "SS 304 · foot-operated"],
    ]),
  },
  {
    slug: "plumbing-materials",
    title: "Plumbing Materials",
    icon: "droplet",
    summary: "SS, CPVC and UPVC pipes, fittings and drainage for plant and utility areas.",
    items: items("plb", [
      ["CPVC pipes & fittings", "SDR 11 / SDR 13.5 · ½\" to 4\""],
      ["UPVC pipes & fittings", "Sch 40 / Sch 80"],
      ["SS pipes & fittings", "SS 304 · threaded / welded"],
      ["Cleanroom floor drains", "SS 316 · with air-break traps"],
      ["Valves & taps", "Brass / SS / CPVC"],
      ["Solvent cements & sealants", "CPVC / UPVC compatible"],
    ]),
  },
  {
    slug: "electrical-materials",
    title: "Electrical Materials",
    icon: "zap",
    summary: "Power distribution, switchgear, wiring and lighting for plants and cleanrooms.",
    items: items("ele", [
      ["Cables & wires", "Power / control · Cu / Al · armoured"],
      ["MCB / MCCB / ACB", "Leading makes · rating as required"],
      ["Contactors & relays", "AC / DC · overload relays"],
      ["Control panels", "MCC / PCC / VFD panels to drawing"],
      ["Cable trays & ducts", "GI / perforated / ladder type"],
      ["LED light fittings", "Cleanroom panels · flameproof · high-bay"],
    ]),
  },
  {
    slug: "instrumentation-materials",
    title: "Instrumentation Materials",
    icon: "cpu",
    summary: "Field instruments, valves, cabling and accessories, plus reworks and spares.",
    items: items("ins", [
      ["Pressure & DP transmitters", "4–20 mA / HART · SS wetted parts"],
      ["Temperature sensors & transmitters", "RTD PT100 · thermocouples"],
      ["Pressure gauges", "SS 316 · diaphragm seal option"],
      ["Control valves", "Pneumatic · globe / ball"],
      ["Solenoid valves", "SS / brass · 24 V DC / 230 V AC"],
      ["Instrument cables", "Shielded · single / multi-pair"],
      ["Junction boxes", "SS / aluminium · IP65 / Ex-d"],
      ["I/P converters", "4–20 mA to 3–15 psi"],
      ["Reworks & spares", "Repair and replacement support"],
    ]),
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
