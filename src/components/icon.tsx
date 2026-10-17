import {
  Box,
  ClipboardCheck,
  Cog,
  Cpu,
  Droplets,
  Gauge,
  GraduationCap,
  Layers,
  type LucideProps,
  ShieldCheck,
  Sparkles,
  Waypoints,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import type { IconName } from "@/lib/services";

const map = {
  gauge: Gauge,
  wind: Wind,
  clipboard: ClipboardCheck,
  wrench: Wrench,
  cog: Cog,
  graduation: GraduationCap,
  shield: ShieldCheck,
  pipe: Waypoints,
  zap: Zap,
  cpu: Cpu,
  box: Box,
  droplet: Droplets,
  layers: Layers,
  sparkles: Sparkles,
} satisfies Record<IconName, React.ComponentType<LucideProps>>;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const C = map[name];
  return <C aria-hidden {...props} />;
}

export function IconTile({ name, tone = "brand" }: { name: IconName; tone?: "brand" | "leaf" | "dark" }) {
  const tones = {
    brand: "bg-brand-50 text-brand-600 ring-brand-100",
    leaf: "bg-leaf-50 text-leaf-600 ring-leaf-100",
    dark: "bg-white/10 text-leaf-300 ring-white/15",
  };
  return (
    <span className={`inline-grid size-12 place-items-center rounded-xl ring-1 ${tones[tone]}`}>
      <Icon name={name} className="size-6" strokeWidth={1.75} />
    </span>
  );
}
