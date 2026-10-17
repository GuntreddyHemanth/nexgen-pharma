export const LEAD_STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const statusStyle: Record<LeadStatus, string> = {
  new: "bg-brand-50 text-brand-700 ring-brand-200",
  contacted: "bg-violet-50 text-violet-700 ring-violet-200",
  quoted: "bg-amber-50 text-amber-800 ring-amber-200",
  won: "bg-leaf-50 text-leaf-700 ring-leaf-200",
  lost: "bg-slate-100 text-slate-600 ring-slate-200",
};

export const kindLabel: Record<string, string> = {
  enquiry: "Enquiry",
  rfq: "Material RFQ",
  catalogue: "Catalogue",
};
