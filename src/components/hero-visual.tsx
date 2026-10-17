import { CheckCircle2, Thermometer, Wind } from "lucide-react";

function Gauge() {
  const ticks = Array.from({ length: 41 }, (_, i) => i);
  return (
    <svg viewBox="0 0 200 130" className="w-full" aria-hidden>
      <defs>
        <linearGradient id="arc" x1="0" x2="1">
          <stop offset="0%" stopColor="#5a88f0" />
          <stop offset="100%" stopColor="#63c849" />
        </linearGradient>
      </defs>
      <path d="M20 115 A80 80 0 0 1 180 115" fill="none" stroke="#e3e9f3" strokeWidth="10" strokeLinecap="round" />
      <path
        d="M20 115 A80 80 0 0 1 180 115"
        fill="none"
        stroke="url(#arc)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray="251"
        strokeDashoffset="70"
      />
      {ticks.map((i) => {
        const a = Math.PI - (i / 40) * Math.PI;
        const r1 = 64;
        const r2 = i % 5 === 0 ? 55 : 60;
        return (
          <line
            key={i}
            x1={100 + r1 * Math.cos(a)}
            y1={115 - r1 * Math.sin(a)}
            x2={100 + r2 * Math.cos(a)}
            y2={115 - r2 * Math.sin(a)}
            stroke={i % 5 === 0 ? "#17357d" : "#9fb0cf"}
            strokeWidth={i % 5 === 0 ? 1.6 : 0.8}
          />
        );
      })}
      <g className="origin-[100px_115px] animate-sweep">
        <line x1="100" y1="115" x2="100" y2="48" stroke="#0f2557" strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx="100" cy="115" r="8" fill="#0f2557" />
      <circle cx="100" cy="115" r="3" fill="#63c849" />
    </svg>
  );
}

export function HeroVisual() {
  const rows = [
    ["0.0", "0.00", "0.00"],
    ["2.5", "2.51", "+0.4%"],
    ["5.0", "5.01", "+0.2%"],
    ["7.5", "7.49", "−0.1%"],
    ["10.0", "10.02", "+0.2%"],
  ];
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden>
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-brand-500/30 to-leaf-500/20 blur-2xl" />

      <div className="relative rounded-3xl border border-white/15 bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Calibration record</p>
            <p className="mt-1 font-display text-lg font-bold text-ink">PT-104 · Pressure Transmitter</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-leaf-50 px-2.5 py-1 text-xs font-bold text-leaf-700 ring-1 ring-leaf-200">
            <CheckCircle2 className="size-3.5" /> PASS
          </span>
        </div>

        <div className="mt-4 grid grid-cols-5 items-center gap-4">
          <div className="col-span-2">
            <Gauge />
            <p className="-mt-1 text-center text-[11px] text-muted">0 – 10 bar</p>
          </div>
          <table className="col-span-3 w-full text-[11px] tabular-nums">
            <thead>
              <tr className="text-left text-muted">
                <th className="pb-1.5 font-medium">Std</th>
                <th className="pb-1.5 font-medium">UUC</th>
                <th className="pb-1.5 text-right font-medium">Error</th>
              </tr>
            </thead>
            <tbody className="text-ink">
              {rows.map((r) => (
                <tr key={r[0]} className="border-t border-line">
                  <td className="py-1">{r[0]}</td>
                  <td className="py-1">{r[1]}</td>
                  <td className="py-1 text-right text-leaf-700">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-[11px]">
          <div>
            <p className="text-muted">Traceability</p>
            <p className="font-semibold text-ink">NABL lab</p>
          </div>
          <div>
            <p className="text-muted">Calibrated</p>
            <p className="font-semibold text-ink">On-site</p>
          </div>
          <div>
            <p className="text-muted">Next due</p>
            <p className="font-semibold text-ink">12 months</p>
          </div>
        </div>
      </div>

      <div className="absolute -left-4 top-[58%] hidden animate-float rounded-2xl border border-line bg-white p-3 shadow-xl sm:-left-10 sm:block">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <Wind className="size-5" />
          </span>
          <div>
            <p className="text-[11px] text-muted">AHU-04 · HEPA integrity</p>
            <p className="text-sm font-bold text-ink">Leak &lt; 0.01% ✓</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-3 -top-6 hidden animate-float rounded-2xl border border-line bg-white p-3 shadow-xl [animation-delay:-3s] sm:-right-8 sm:block">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-leaf-50 text-leaf-600">
            <Thermometer className="size-5" />
          </span>
          <div>
            <p className="text-[11px] text-muted">Grade C · ΔP to corridor</p>
            <p className="text-sm font-bold text-ink">+15 Pa · Within limit</p>
          </div>
        </div>
      </div>
    </div>
  );
}
