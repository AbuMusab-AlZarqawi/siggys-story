"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useReadContract } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { LOREKEEPER_ADDRESS, LOREKEEPER_ABI } from "@/lib/contract";
import { StoryEntry, DisplayItem } from "@/types";
import { TypewriterText } from "./TypewriterText";
import { SubmitSentence } from "./SubmitSentence";
import { ContributorsSidebar } from "./ContributorsSidebar";

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function formatTime(ts: bigint) {
  return new Date(Number(ts) * 1000).toLocaleDateString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export function StoryScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Onchain sentences
  const { data: rawEntries, refetch } = useReadContract({
    address: LOREKEEPER_ADDRESS,
    abi: LOREKEEPER_ABI,
    functionName: "getAllEntries",
  });
  const entries: StoryEntry[] = (rawEntries as StoryEntry[] | undefined) ?? [];

  // Narrations from KV: { sentenceIndex → narration text }
  const [savedNarrations, setSavedNarrations] = useState<Record<number, string>>({});

  // Live narration being typed right now (before it's in KV)
  const [liveNarration, setLiveNarration] = useState<{ text: string; afterIndex: number } | null>(null);

  // Load saved narrations on mount
  useEffect(() => {
    fetch("/api/narrations")
      .then((r) => r.json())
      .then((d) => setSavedNarrations(d.narrations ?? {}))
      .catch(console.error);
  }, []);

  // When a new narration arrives from SubmitSentence:
  //  - show it live as typewriter
  //  - also add it to savedNarrations so it persists in this session
  const handleNarrationReady = useCallback((narration: string, afterIndex: number) => {
    setLiveNarration({ text: narration, afterIndex });
    setSavedNarrations((prev) => ({ ...prev, [afterIndex]: narration }));
    // Refresh chain entries a moment later to pick up the new sentence
    setTimeout(() => refetch(), 2500);
  }, [refetch]);

  // Scroll to bottom whenever entries or narrations change
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 120);
  }, [entries.length, Object.keys(savedNarrations).length, liveNarration]);

  // Build interleaved display list:
  // After each sentence at index N, show narration keyed to N (if it exists)
  const displayItems: DisplayItem[] = [];
  for (const entry of entries) {
    displayItems.push({ kind: "sentence", entry });
    const idx = Number(entry.index);
    if (savedNarrations[idx]) {
      displayItems.push({ kind: "narration", text: savedNarrations[idx], afterIndex: idx });
    }
  }

  // If a live narration exists for an index not yet in savedNarrations, append it
  if (
    liveNarration &&
    !savedNarrations[liveNarration.afterIndex] &&
    entries.find((e) => Number(e.index) === liveNarration.afterIndex)
  ) {
    displayItems.push({ kind: "narration", text: liveNarration.text, afterIndex: liveNarration.afterIndex });
  }

  const totalNarrations = Object.keys(savedNarrations).length;

  return (
    <div className="flex gap-5 h-full">
      {/* ── Main column ── */}
      <div className="flex-1 flex flex-col min-w-0 gap-4">

        {/* Title */}
        <div className="text-center pt-4">
          <div className="divider" />
          <h2
            className="font-title text-2xl tracking-[0.3em] uppercase my-3"
            style={{ color: "#39ff14", textShadow: "0 0 30px #39ff1455" }}
          >
            The Eternal Tale
          </h2>
          <p className="text-mist/40 text-sm font-body italic">
            Written by many hands · Narrated by one wizard cat
          </p>
          <div className="divider" />
        </div>

        {/* Story scroll */}
        <div className="tome rounded-sm flex flex-col" style={{ minHeight: 0 }}>
          <div
            ref={scrollRef}
            className="overflow-y-auto px-5 py-4 space-y-2 flex-1"
            style={{ maxHeight: "calc(100vh - 360px)" }}
          >
            {displayItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="text-center py-14"
              >
                <p className="text-4xl mb-4 flicker">🐱</p>
                <p className="font-title text-lg mb-2" style={{ color: "#39ff14aa" }}>
                  The page is blank.
                </p>
                <p className="font-body italic text-mist/50 text-sm max-w-sm mx-auto">
                  Siggy waits, tail curled, amber eyes gleaming in the dark. The first word has yet to be written. Will it be yours?
                </p>
              </motion.div>
            ) : (
              <AnimatePresence initial={false}>
                {displayItems.map((item, i) => {
                  if (item.kind === "sentence") {
                    return (
                      <motion.div
                        key={`s-${item.entry.index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="user-block rounded-sm px-5 py-3"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
                            <span className="font-mono text-gold/70 text-xs">
                              {shortAddr(item.entry.contributor)}
                            </span>
                            <span className="text-mist/30 text-xs">co-author</span>
                          </div>
                          <span className="text-mist/30 text-xs">{formatTime(item.entry.timestamp)}</span>
                        </div>
                        <p className="font-body text-parchment/80 text-base leading-relaxed pl-3">
                          &ldquo;{item.entry.sentence}&rdquo;
                        </p>
                      </motion.div>
                    );
                  }

                  // Narration block
                  const isLive =
                    liveNarration?.afterIndex === item.afterIndex &&
                    liveNarration?.text === item.text;

                  return (
                    <motion.div
                      key={`n-${item.afterIndex}`}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="siggy-block rounded-sm px-5 py-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base flicker">🐱</span>
                        <span
                          className="font-title text-xs tracking-[0.2em] uppercase"
                          style={{ color: "#39ff14", textShadow: "0 0 10px #39ff1466" }}
                        >
                          Siggy Narrates
                        </span>
                      </div>
                      <p className="font-body italic text-parchment/85 text-lg leading-relaxed">
                        {isLive ? (
                          <TypewriterText
                            text={item.text}
                            onComplete={() => setLiveNarration(null)}
                          />
                        ) : (
                          item.text
                        )}
                      </p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
            <div className="h-2" />
          </div>
        </div>

        {/* Submit */}
        <SubmitSentence entries={entries} onNarrationReady={handleNarrationReady} />
      </div>

      {/* ── Sidebar ── */}
      <ContributorsSidebar entries={entries} totalNarrations={totalNarrations} />
    </div>
  );
}
