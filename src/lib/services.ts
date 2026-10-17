export type IconName =
  | "gauge"
  | "wind"
  | "clipboard"
  | "wrench"
  | "cog"
  | "graduation"
  | "shield"
  | "pipe"
  | "zap"
  | "cpu"
  | "box"
  | "droplet"
  | "layers"
  | "sparkles";

export type Pillar = "Validation & Compliance" | "Engineering Support" | "Training & Consultancy";

export type Service = {
  slug: string;
  title: string;
  pillar: Pillar;
  icon: IconName;
  summary: string;
  intro: string;
  offerings: { title: string; body: string }[];
  scope?: { label: string; items: string[] };
  deliverables: string[];
  faqs: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "instrument-calibration",
    title: "Instrument Calibration",
    pillar: "Validation & Compliance",
    icon: "gauge",
    summary:
      "On-site and lab calibration of pressure, temperature, flow, level, pH and process instruments with traceable certificates.",
    intro:
      "An out-of-tolerance instrument can put a whole batch on hold. We calibrate your process and laboratory instruments against master standards traceable to NABL-accredited laboratories, on site or in our own lab, and hand over documentation your QA team can file without rework.",
    offerings: [
      {
        title: "On-site calibration",
        body: "Engineers calibrate instruments in place during planned shutdowns, so production keeps running.",
      },
      {
        title: "Lab calibration",
        body: "Instruments that need a controlled environment go to our in-house calibration lab, with pickup and drop.",
      },
      {
        title: "Traceable master standards",
        body: "Every master instrument is itself calibrated, with an unbroken traceability chain on the certificate.",
      },
      {
        title: "Calibration management",
        body: "Instrument master list, schedules and due-date reminders, so nothing lapses before an audit.",
      },
    ],
    scope: {
      label: "Parameters we calibrate",
      items: [
        "Pressure & vacuum gauges",
        "Pressure / DP transmitters",
        "RTDs, thermocouples & temperature indicators",
        "Flow meters",
        "Level transmitters",
        "pH & conductivity meters",
        "Temperature & humidity loggers",
        "Timers, tachometers & RPM",
      ],
    },
    deliverables: [
      "Calibration certificate with as-found / as-left data",
      "Traceability details of master standards",
      "Instrument identification labels",
      "Calibration schedule and due-date register",
    ],
    faqs: [
      {
        q: "Are your certificates traceable to national standards?",
        a: "Yes. Our master standards are calibrated by NABL-accredited laboratories, and the traceability chain is stated on every certificate.",
      },
      {
        q: "Can you calibrate without stopping production?",
        a: "Most field instruments can be calibrated on site during planned maintenance windows. We plan the sequence with your engineering team to keep downtime to a minimum.",
      },
      {
        q: "Do you follow our SOP format?",
        a: "Yes. We can produce certificates and records in your QA-approved format, or provide our standard format for your approval.",
      },
    ],
  },
  {
    slug: "hvac-validation",
    title: "HVAC Validation",
    pillar: "Validation & Compliance",
    icon: "wind",
    summary:
      "AHU performance qualification, airflow, particle count, HEPA integrity and pressure studies with audit-ready reports.",
    intro:
      "Cleanroom classification depends on HVAC performance you can prove. Our validation team runs the full set of performance tests on your AHUs and controlled areas, records raw data on calibrated instruments, and delivers reports ready for regulatory inspection.",
    offerings: [
      {
        title: "AHU performance qualification",
        body: "End-to-end PQ of air handling units against approved acceptance criteria.",
      },
      {
        title: "Airflow & air changes",
        body: "Air velocity, volume and air-change-rate measurement for every room and terminal.",
      },
      {
        title: "HEPA filter integrity",
        body: "Aerosol challenge (PAO/DOP) leak testing of terminal and in-line HEPA filters.",
      },
      {
        title: "Particle count & classification",
        body: "Non-viable particle counting for ISO 14644 / EU GMP cleanroom classification.",
      },
      {
        title: "Pressure & recovery studies",
        body: "Room differential pressure, airflow direction and recovery tests.",
      },
      {
        title: "Temperature & humidity mapping",
        body: "Multi-point mapping of rooms, warehouses, stability chambers and cold rooms.",
      },
    ],
    deliverables: [
      "Approved validation protocol",
      "Raw data sheets signed on site",
      "Test reports with instrument calibration certificates",
      "Summary report with deviations and recommendations",
    ],
    faqs: [
      {
        q: "How often should HVAC systems be re-validated?",
        a: "Typically every year, or after any major modification, filter change or failure. Your site SOPs and risk assessment set the final frequency, and we can help you justify it.",
      },
      {
        q: "Do you provide the test instruments?",
        a: "Yes. We bring calibrated anemometers, particle counters, aerosol generators, photometers and data loggers, and their calibration certificates are attached to the report.",
      },
    ],
  },
  {
    slug: "equipment-qualification",
    title: "Equipment Qualification",
    pillar: "Validation & Compliance",
    icon: "clipboard",
    summary:
      "Complete DQ, IQ, OQ and PQ support for process equipment and utilities, with protocols, execution and reports.",
    intro:
      "From user requirement specification to performance qualification, we document and execute the full qualification lifecycle, so new and modified equipment goes into GMP use with evidence that stands up to audit.",
    offerings: [
      { title: "Design Qualification (DQ)", body: "Review of design against URS and GMP requirements." },
      { title: "Installation Qualification (IQ)", body: "Verification of installation, utilities, materials and documents." },
      { title: "Operational Qualification (OQ)", body: "Functional testing across operating ranges and alarms." },
      { title: "Performance Qualification (PQ)", body: "Proof of consistent performance under routine conditions." },
    ],
    scope: {
      label: "Typical equipment & systems",
      items: [
        "Autoclaves & dry heat sterilisers",
        "Fluid bed dryers & RMGs",
        "Tablet compression & coating",
        "Purified water & WFI systems",
        "Compressed air & nitrogen",
        "Stability chambers & cold rooms",
        "LAF, RLAF & pass boxes",
        "Lab instruments",
      ],
    },
    deliverables: [
      "URS review and qualification master plan",
      "DQ / IQ / OQ / PQ protocols",
      "Executed protocols with raw data",
      "Qualification summary reports",
    ],
    faqs: [
      {
        q: "Can you work with the OEM's qualification documents?",
        a: "Yes. We review OEM-supplied documents, close the gaps against your URS and site SOPs, and integrate them into your qualification package.",
      },
    ],
  },
  {
    slug: "engineering-maintenance",
    title: "Engineering & Maintenance Support",
    pillar: "Engineering Support",
    icon: "wrench",
    summary:
      "Preventive and breakdown maintenance, utilities support, reworks and spares for pharma process equipment.",
    intro:
      "Your engineering team can't be everywhere. We add skilled hands for preventive maintenance, shutdown work, reworks and spares, backed by our own machining and fabrication shop for parts you can't wait weeks for.",
    offerings: [
      { title: "Preventive maintenance", body: "Scheduled maintenance with checklists and records that fit your GMP documentation." },
      { title: "Shutdown support", body: "Extra trained manpower and planning for annual and planned shutdowns." },
      { title: "Reworks & modifications", body: "Changes to equipment, piping and utilities, with change-control documentation." },
      { title: "Spares & reverse engineering", body: "Worn parts measured, drawn and re-manufactured in-house to OEM-equivalent standards." },
    ],
    deliverables: [
      "Maintenance checklists and service reports",
      "Spares lists and recommended stock levels",
      "As-built drawings for reworked parts",
    ],
    faqs: [
      {
        q: "Can you manufacture spares for imported machines?",
        a: "In many cases, yes. We measure the worn part, prepare a drawing for your approval and manufacture it in SS 316L or the specified material at our CNC facility.",
      },
    ],
  },
  {
    slug: "cnc-ss-fabrication",
    title: "CNC Machining & SS Fabrication",
    pillar: "Engineering Support",
    icon: "cog",
    summary:
      "In-house CNC machining, lathe work and stainless steel fabrication for contact parts, cleanroom furniture and custom builds.",
    intro:
      "Our sister concerns in Hyderabad and Visakhapatnam run CNC machining, lathe and SS fabrication facilities. That means we make what most suppliers only resell, with direct control over material, finish and delivery.",
    offerings: [
      { title: "CNC machining", body: "Precision turned and milled parts in SS 304, SS 316L, MS and engineering plastics." },
      { title: "Lathe & conventional machining", body: "Shafts, bushes, flanges and one-off repair jobs with quick turnaround." },
      { title: "SS fabrication", body: "Cleanroom trolleys, tables, racks, hoppers, chutes and custom enclosures." },
      { title: "Surface finishing", body: "Buffing and polishing to pharma-grade finishes for product contact surfaces." },
    ],
    deliverables: [
      "Material test certificates (MTC) for SS grades",
      "Dimensional inspection report",
      "Surface finish details",
    ],
    faqs: [
      {
        q: "Do you supply material certificates?",
        a: "Yes. Stainless steel contact parts are supplied with mill test certificates for the grade used, along with dimensional inspection records.",
      },
      {
        q: "Can you work from a sample instead of a drawing?",
        a: "Yes. We can reverse-engineer from a sample, share a drawing for approval and then manufacture.",
      },
    ],
  },
  {
    slug: "technical-training",
    title: "Technical Training",
    pillar: "Training & Consultancy",
    icon: "graduation",
    summary:
      "Practical training on equipment operation, calibration, validation, GMP and the latest regulatory expectations.",
    intro:
      "Trained people prevent deviations. Our programmes are practical, plant-focused and delivered by engineers who do this work every day, at your site or as workshops.",
    offerings: [
      { title: "Equipment operation & maintenance", body: "Safe, efficient operation and care of pharmaceutical equipment." },
      { title: "Calibration & instrumentation", body: "From basics to advanced calibration, instrumentation and process control." },
      { title: "Validation & qualification", body: "Hands-on training on DQ, IQ, OQ, PQ and validation documentation." },
      { title: "GMP awareness", body: "Good manufacturing practices, documentation and compliance requirements." },
      { title: "Seminars & workshops", body: "Industry updates, regulatory changes and best practices." },
    ],
    deliverables: ["Training material and handouts", "Attendance records", "Participant assessments and certificates"],
    faqs: [
      {
        q: "Can training be customised to our SOPs?",
        a: "Yes. We review your SOPs and equipment beforehand and build exercises around your own processes.",
      },
    ],
  },
  {
    slug: "compliance-consultancy",
    title: "Compliance Consultancy",
    pillar: "Training & Consultancy",
    icon: "shield",
    summary:
      "Validation support, SOPs, risk assessment, change control, deviation and CAPA, and audit readiness.",
    intro:
      "When an audit is coming, you need people who have prepared for one before. We help your QA and engineering teams close gaps, strengthen documentation and walk into inspections prepared.",
    offerings: [
      { title: "Validation support", body: "Process, cleaning, HVAC and computer system validation." },
      { title: "SOPs & technical documents", body: "Preparation and review of SOPs, work instructions and technical documents." },
      { title: "Risk assessment & change control", body: "Risk assessments, change control and impact analysis." },
      { title: "Deviation & CAPA", body: "Investigation, root cause analysis, and CAPA planning and implementation." },
      { title: "Audit readiness", body: "Mock audits, gap analysis and support during the audit." },
    ],
    deliverables: ["Gap assessment report", "Prioritised action plan", "Prepared or revised documents"],
    faqs: [
      {
        q: "Do you support regulatory audit preparation?",
        a: "We run mock audits and gap assessments against applicable GMP expectations, then help your teams close the observations before the actual inspection.",
      },
    ],
  },
];

export const pillars: { title: Pillar | "Material Supply"; icon: IconName; body: string; href: string; points: string[] }[] = [
  {
    title: "Validation & Compliance",
    icon: "shield",
    body: "Calibration, HVAC validation and qualification with audit-ready documentation.",
    href: "/services#validation",
    points: ["Instrument calibration", "HVAC validation", "DQ · IQ · OQ · PQ"],
  },
  {
    title: "Material Supply",
    icon: "box",
    body: "Process, piping, electrical and instrumentation materials sourced to spec.",
    href: "/materials",
    points: ["Process & utility piping", "Electrical materials", "Instrumentation"],
  },
  {
    title: "Engineering Support",
    icon: "cog",
    body: "Maintenance manpower plus in-house CNC machining and SS fabrication.",
    href: "/services#engineering",
    points: ["Maintenance & reworks", "CNC machining", "SS fabrication"],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
