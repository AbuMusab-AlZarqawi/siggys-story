"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StoryEntry } from "@/types";

interface Props {
  entries: StoryEntry[];
  totalNarrations: number;
}

function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function ContributorsSidebar({ entries, totalNarrations }: Props) {
  const [open, setOpen] = useState(false);

  const seen = new Set<string>();
  const recent: StoryEntry[] = [];
  for (let i = entries.length - 1; i >= 0; i--) {
    const e = entries[i];
    if (!seen.has(e.contributor)) {
      seen.add(e.contributor);
      recent.push(e);
      if (recent.length >= 8) break;
    }
  }

  const stats = [
    ["Sentences", entries.length],
    ["Siggy's Tales", totalNarrations],
    ["Co-Authors", seen.size],
  ];

  // ── Mobile: collapsible panel at bottom ──
  const MobilePanel = () => (
    <div className="block lg:hidden">
      {/* Stats bar always visible on mobile */}
      <div className="tome rounded-sm p-3 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            {stats.map(([label, val]) => (
              <div key={String(label)} className="text-center">
                <div className="font-title text-base" style={{ color: "#39ff14" }}>{val}</div>
                <div className="text-mist/40 text-[10px] font-body">{label}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-siggy-green/60 text-xs font-title tracking-widest uppercase border border-siggy-green/20 px-3 py-1.5 rounded-sm"
          >
            {open ? "Hide ✦" : "Authors ✦"}
          </button>
        </div>
      </div>

      {/* Collapsible authors list */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="tome rounded-sm p-3 mb-2">
              <h2 className="font-title text-xs tracking-[0.2em] uppercase mb-2"
                style={{ color: "#39ff14" }}>
                ✦ Co-Authors
              </h2>
              {recent.length === 0 ? (
                <p className="text-mist/40 text-xs font-body italic">No one has written yet. Be the first.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {recent.map((e) => (
                    <div key={e.contributor} className="border border-siggy-green/10 rounded-sm p-2">
                      <div className="flex items-center gap-1 mb-0.5">
                        <div className="w-1 h-1 rounded-full bg-siggy-green/50 shrink-0" />
                        <span className="font-mono text-siggy-green/70 text-[10px] truncate">{short(e.contributor)}</span>
                      </div>
                      <p className="text-mist/50 text-[10px] font-body italic line-clamp-2">
                        &ldquo;{e.sentence}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // ── Desktop: fixed sidebar ──
  const DesktopSidebar = () => (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-3">
      <div className="tome rounded-sm p-4">
        <h2 className="font-title text-xs tracking-[0.2em] uppercase mb-3"
          style={{ color: "#39ff14", textShadow: "0 0 10px #39ff1466" }}>
          ✦ The Tome
        </h2>
        <div className="space-y-2">
          {stats.map(([label, val]) => (
            <div key={String(label)} className="flex justify-between items-center">
              <span className="text-mist/50 text-xs font-body">{label}</span>
              <span className="font-title text-sm text-parchment">{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="tome rounded-sm p-4 flex-1">
        <h2 className="font-title text-xs tracking-[0.2em] uppercase mb-3"
          style={{ color: "#39ff14", textShadow: "0 0 10px #39ff1466" }}>
          ✦ Co-Authors
        </h2>
        {recent.length === 0 ? (
          <p className="text-mist/40 text-xs font-body italic">No one has written yet. Be the first.</p>
        ) : (
          <div className="space-y-3">
            {recent.map((e, i) => (
              <motion.div
                key={e.contributor}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-siggy-green/10 pb-2 last:border-0"
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-siggy-green/50" />
                  <span className="font-mono text-siggy-green/70 text-xs">{short(e.contributor)}</span>
                </div>
                <p className="text-mist/60 text-xs font-body italic pl-3 line-clamp-2">
                  &ldquo;{e.sentence}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-sm border border-siggy-green/10 p-3 bg-siggy-green-glow">
        <p className="text-mist/40 text-xs font-body italic leading-relaxed">
          Every sentence is written permanently to Ritual Chain. Only gas — no tokens.
        </p>
      </div>
    </aside>
  );

  return (
    <>
      <MobilePanel />
      <DesktopSidebar />
    </>
  );
}
