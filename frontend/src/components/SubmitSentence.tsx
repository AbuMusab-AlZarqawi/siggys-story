"use client";

import { useState, useRef } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { LOREKEEPER_ADDRESS, LOREKEEPER_ABI } from "@/lib/contract";
import { StoryEntry } from "@/types";

interface Props {
  entries: StoryEntry[];
  onNarrationReady: (narration: string, afterSentenceIndex: number) => void;
}

type Phase = "idle" | "signing" | "waiting" | "narrating" | "done" | "error";

const PHASE_LABEL: Record<Phase, string> = {
  idle:      "Submit to the Story",
  signing:   "Sign in Wallet…",
  waiting:   "Writing to Chain…",
  narrating: "Siggy is weaving…",
  done:      "Written ✦",
  error:     "Try Again",
};

export function SubmitSentence({ entries, onNarrationReady }: Props) {
  const { address, isConnected } = useAccount();
  const [sentence, setSentence] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [errMsg, setErrMsg] = useState("");

  const pendingSentenceRef = useRef("");
  const pendingIndexRef = useRef(-1);
  const narrationFiredRef = useRef(false);

  const { writeContract, data: txHash, error: writeError } = useWriteContract();
  const { isSuccess: txConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  if (txConfirmed && !narrationFiredRef.current && pendingSentenceRef.current) {
    narrationFiredRef.current = true;
    fireNarration(pendingSentenceRef.current, pendingIndexRef.current);
  }

  async function fireNarration(submittedSentence: string, sentenceIndex: number) {
    setPhase("narrating");
    const recentContext = entries.slice(-5).map((e) => ({
      sentence: e.sentence,
      contributor: e.contributor,
    }));

    try {
      const res = await fetch("/api/narrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newSentence: submittedSentence, contributor: address, recentContext }),
      });
      const data = await res.json();
      if (!res.ok || !data.narration) throw new Error(data.error || "No narration");

      onNarrationReady(data.narration, sentenceIndex);

      fetch("/api/narrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index: sentenceIndex, narration: data.narration }),
      }).catch(console.error);

      setPhase("done");
    } catch (err) {
      console.error("Narration error:", err);
      setPhase("done");
    }
  }

  function handleSubmit() {
    if (!sentence.trim() || !isConnected) return;
    setPhase("signing");
    setErrMsg("");
    narrationFiredRef.current = false;

    const trimmed = sentence.trim();
    pendingSentenceRef.current = trimmed;
    pendingIndexRef.current = entries.length;

    writeContract(
      {
        address: LOREKEEPER_ADDRESS,
        abi: LOREKEEPER_ABI,
        functionName: "addSentence",
        args: [trimmed],
      },
      {
        onSuccess: () => { setPhase("waiting"); setSentence(""); },
        onError: (err) => {
          const msg = err.message || "";
          setErrMsg(msg.toLowerCase().includes("reject") ? "Cancelled." : "Failed. Try again.");
          setPhase("error");
        },
      }
    );
  }

  if (writeError && phase === "signing") {
    setErrMsg("Transaction cancelled.");
    setPhase("error");
  }

  const isLoading = phase === "signing" || phase === "waiting" || phase === "narrating";
  const canSubmit = isConnected && sentence.trim().length > 0 && !isLoading && phase !== "done";

  return (
    <div className="tome rounded-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-title text-xs tracking-[0.15em] uppercase text-siggy-green/70">
          ✦ Add Your Sentence
        </span>
        {isConnected && address && (
          <span className="font-mono text-mist/40 text-[10px]">
            {address.slice(0, 6)}…{address.slice(-4)}
          </span>
        )}
      </div>

      {!isConnected ? (
        <div className="text-center py-4">
          <p className="font-body italic text-mist/50 text-sm mb-1">
            Connect your wallet to write your sentence into eternity.
          </p>
          <p className="font-body text-mist/30 text-xs">Only Ritual Chain gas — no tokens.</p>
        </div>
      ) : (
        <>
          <textarea
            className="story-input w-full rounded-sm px-3 py-2.5 font-body text-base resize-none"
            placeholder="Continue the tale… one sentence at a time."
            rows={3}
            value={sentence}
            onChange={(e) => e.target.value.length <= 500 && setSentence(e.target.value)}
            disabled={isLoading}
          />

          {/* Mobile: stacked layout; Desktop: side by side */}
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className={`text-xs font-mono ${sentence.length > 450 ? "text-red-400" : "text-mist/30"}`}>
              {sentence.length}/500
            </span>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <AnimatePresence>
                {phase === "error" && (
                  <motion.span
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-red-400 text-xs font-body"
                  >
                    {errMsg}
                  </motion.span>
                )}
              </AnimatePresence>

              <button
                className={`submit-btn flex-1 sm:flex-none px-4 py-2.5 text-xs sm:text-sm rounded-sm ${isLoading ? "animate-pulse" : ""}`}
                onClick={phase === "error" ? () => setPhase("idle") : handleSubmit}
                disabled={!canSubmit && phase !== "error"}
              >
                {PHASE_LABEL[phase]}
              </button>
            </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {phase === "waiting" && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-2 text-center text-siggy-green/50 text-xs font-body italic">
            Your words travel through the blockchain… do not close this window.
          </motion.p>
        )}
        {phase === "narrating" && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-2 text-center text-xs font-body italic flicker" style={{ color: "#39ff14aa" }}>
            🐱 Siggy stirs from slumber and reaches for a quill…
          </motion.p>
        )}
        {phase === "done" && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-2 text-center font-title text-xs tracking-widest uppercase" style={{ color: "#39ff14" }}>
            ✦ Your sentence is eternal ✦
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
