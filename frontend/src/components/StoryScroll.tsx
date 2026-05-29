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

  const { data: rawEntries, refetch } = useReadContract({
    address: LOREKEEPER_ADDRESS,
    abi: LOREKEEPER_ABI,
    functionName: "getAllEntries",
  });
  const entries: StoryEntry[] = (rawEntries as StoryEntry[] | undefined) ?? [];

  const [savedNarrations, setSavedNarrations] = useState<Record<number, string>>({});
  const [liveNarration, setLiveNarration] = useState<{ text: string; afterIndex: number } | null>(null);

  useEffect(() => {
    fetch("/api/narrations")
      .then((r) => r.json())
      .then((d) => setSavedNarrations(d.narrations ?? {}))
      .catch(console.error);
  }, []);

  const handleNarrationReady = useCallback((narration: string, afterIndex: number) => {
    setLiveNarration({ text: narration, afterIndex });
    setSavedNarrations((prev) => ({ ...prev, [afterIndex]: narration }));
    setTimeout(() => refetch(), 2500);
  }, [refetch]);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 120);
  }, [entries.length, Object.keys(savedNarrations).length, liveNarration]);

  const displayItems: DisplayItem[] = [];
  for (const entry of entries) {
    displayItems.push({ kind: "sentence", entry });
    const idx = Number(entry.index);
    if (savedNarrations[idx]) {
      displayItems.push({ kind: "narration", text: savedNarrations[idx], afterIndex: idx });
    }
  }

  if (
    liveNarration &&
    !savedNarrations[liveNarration.afterIndex] &&
    entries.find((e) => Number(e.index) === liveNarration.afterIndex)
  ) {
    displayItems.push({ kind: "narration", text: liveNarration.text, afterIndex: liveNarration.afterIndex });
  }

  const totalNarrations = Object.keys(savedNarrations).length;

  return (
    <div className="flex flex-col lg:flex-row gap-4">

      {/* ── Main column ── */}
      <div className="flex-1 flex flex-col min-w-0 gap-3">

        {/* Title */}
        <div className="text-center pt-2">
          <div className="divider" />
          <h2
            className="font-title text-lg sm:text-2xl tracking-[0.15em] sm:tracking-[0.3em] uppercase my-2"
            style={{ color: "#39ff14", textShadow: "0 0 30px #39ff1455" }}
          >
            The Eternal Tale
          </h2>
          <p className="text-mist/40 text-xs sm:text-sm font-body italic">
            Written by many hands · Narrated by one wizard cat
          </p>
          <div className="divider" />
        </div>

        {/* Story scroll */}
        <div className="tome rounded-sm">
          <div
            ref={scrollRef}
            className="overflow-y-auto px-3 sm:px-5 py-3 space-y-2"
            style={{ maxHeight: "calc(100svh - 320px)" }}
          >
            {displayItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="text-center py-10"
              >
                <p className="text-3xl mb-3 flicker">🐱</p>
                <p className="font-title text-base mb-1.5" style={{ color: "#39ff14aa" }}>
                  The page is blank.
                </p>
                <p className="font-body italic text-mist/50 text-sm max-w-xs mx-auto px-2">
                  Siggy waits, tail curled, amber eyes gleaming. The first word has yet to be written. Will it be yours?
                </p>
              </motion.div>
            ) : (
              <AnimatePresence initial={false}>
                {displayItems.map((item) => {
                  if (item.kind === "sentence") {
                    return (
                      <motion.div
                        key={`s-${item.entry.index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="user-block rounded-sm px-3 sm:px-5 py-2.5"
                      >
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold/60 shrink-0" />
                            <span className="font-mono text-gold/70 text-[10px] sm:text-xs">
                              {shortAddr(item.entry.contributor)}
                            </span>
                          </div>
                          <span className="text-mist/30 text-[10px] ml-auto">{formatTime(item.entry.timestamp)}</span>
                        </div>
                        <p className="font-body text-parchment/80 text-sm sm:text-base leading-relaxed pl-2 sm:pl-3">
                          &ldquo;{item.entry.sentence}&rdquo;
                        </p>
                      </motion.div>
                    );
                  }

                  const isLive =
                    liveNarration?.afterIndex === item.afterIndex &&
                    liveNarration?.text === item.text;

                  return (
                    <motion.div
                      key={`n-${item.afterIndex}`}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="siggy-block rounded-sm px-3 sm:px-5 py-3 sm:py-4"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm flicker">🐱</span>
                        <span
                          className="font-title text-[10px] sm:text-xs tracking-[0.15em] uppercase"
                          style={{ color: "#39ff14", textShadow: "0 0 10px #39ff1466" }}
                        >
                          Siggy Narrates
                        </span>
                      </div>
                      <p className="font-body italic text-parchment/85 text-sm sm:text-base leading-relaxed">
                        {isLive ? (
                          <TypewriterText text={item.text} onComplete={() => setLiveNarration(null)} />
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

        {/* Mobile sidebar (stats + collapsible authors) */}
        <div className="lg:hidden">
          <ContributorsSidebar entries={entries} totalNarrations={totalNarrations} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <ContributorsSidebar entries={entries} totalNarrations={totalNarrations} />
      </div>
    </div>
  );
}
