"use client";

import { motion } from "framer-motion";
import { StoryEntry } from "@/types";

interface Props {
  entries: StoryEntry[];
  totalNarrations: number;
}

function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function ContributorsSidebar({ entries, totalNarrations }: Props) {
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

  return (
    <aside className="w-64 shrink-0 flex flex-col gap-3">
      {/* Stats */}
      <div className="tome rounded-sm p-4">
        <h2 className="font-title text-xs tracking-[0.2em] uppercase mb-3"
          style={{ color: "#39ff14", textShadow: "0 0 10px #39ff1466" }}>
          ✦ The Tome
        </h2>
        <div className="space-y-2">
          {[
            ["Sentences", entries.length],
            ["Siggy's Tales", totalNarrations],
            ["Co-Authors", seen.size],
          ].map(([label, val]) => (
            <div key={String(label)} className="flex justify-between items-center">
              <span className="text-mist/50 text-xs font-body">{label}</span>
              <span className="font-title text-sm text-parchment">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent contributors */}
      <div className="tome rounded-sm p-4 flex-1">
        <h2 className="font-title text-xs tracking-[0.2em] uppercase mb-3"
          style={{ color: "#39ff14", textShadow: "0 0 10px #39ff1466" }}>
          ✦ Co-Authors
        </h2>

        {recent.length === 0 ? (
          <p className="text-mist/40 text-xs font-body italic">
            No one has written yet. Be the first.
          </p>
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

      {/* Lore note */}
      <div className="rounded-sm border border-siggy-green/10 p-3 bg-siggy-green-glow">
        <p className="text-mist/40 text-xs font-body italic leading-relaxed">
          Every sentence is written permanently to Ritual Chain. Only gas — no tokens.
        </p>
      </div>
    </aside>
  );
}
