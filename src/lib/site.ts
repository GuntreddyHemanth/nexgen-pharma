export const site = {
  name: "Nexgen Pharma Enterprises LLP",
  shortName: "Nexgen Pharma",
  tagline: "Engineering Excellence. Compliance Assured.",
  description:
    "Instrument calibration, HVAC validation, equipment qualification, pharma-grade materials and in-house SS fabrication for pharmaceutical plants across Telangana & Andhra Pradesh.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexgen-pharma.vercel.app",
  email: "nexgenpharmaenterprises@gmail.com",
  phones: [
    { display: "+91 89785 49019", tel: "+918978549019" },
    { display: "+91 63058 35563", tel: "+916305835563" },
  ],
  whatsapp: "918978549019",
  address: {
    locality: "Hyderabad",
    region: "Telangana",
    country: "India",
  },
  facilities: ["Hyderabad", "Visakhapatnam"],
  hours: "Mon – Sat, 9:30 AM – 6:30 PM",
};

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const nav = [
  { label: "Services", href: "/services" },
  { label: "Materials", href: "/materials" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const approach = [
  {
    title: "Understand the requirement",
    body: "Site visit or call to map your instruments, equipment, URS and audit timelines.",
  },
  {
    title: "Plan & execute",
    body: "Approved protocols, calibrated master standards and trained engineers on site.",
  },
  {
    title: "Deliver results & reports",
    body: "Signed certificates, raw data and validation reports in your QA format.",
  },
  {
    title: "Ensure compliance",
    body: "Due-date tracking, re-qualification planning and support during audits.",
  },
];

export const industries = [
  { title: "Pharmaceuticals", body: "API and formulation plants, OSD, injectables and QC labs." },
  { title: "Biotechnology", body: "Bioprocess suites, cleanrooms and controlled utilities." },
  { title: "Healthcare", body: "Hospital pharmacies, CSSD, OT HVAC and medical gas systems." },
  { title: "Nutraceuticals", body: "GMP-aligned facilities for supplements and herbal products." },
];

export const clusters = [
  "Genome Valley",
  "Jeedimetla",
  "Bollaram",
  "Pashamylaram",
  "Patancheru",
  "Medchal",
  "JN Pharma City, Parawada",
  "Atchutapuram",
  "Nakkapalli",
  "Anakapalli",
];
