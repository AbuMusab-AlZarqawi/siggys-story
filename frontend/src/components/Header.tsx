"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-siggy-green/10 backdrop-blur-sm bg-ink/60">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3"
      >
        <span className="text-2xl flicker select-none">🐱</span>
        <div>
          <h1
            className="font-title text-xl tracking-[0.25em] uppercase"
            style={{ color: "#39ff14", textShadow: "0 0 20px #39ff1466, 0 0 40px #39ff1422" }}
          >
            Siggy&apos;s Story
          </h1>
          <p className="text-mist/50 text-xs tracking-widest font-body">
            The Eternal Onchain Lore · Ritual Chain
          </p>
        </div>
      </motion.div>

      <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
    </header>
  );
}
