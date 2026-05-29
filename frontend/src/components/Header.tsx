"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="relative z-20 flex items-center justify-between px-4 py-3 border-b border-siggy-green/10 backdrop-blur-sm bg-ink/60">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-2 min-w-0"
      >
        <span className="text-xl flicker select-none shrink-0">🐱</span>
        <div className="min-w-0">
          <h1
            className="font-title text-base sm:text-xl tracking-[0.15em] sm:tracking-[0.25em] uppercase truncate"
            style={{ color: "#39ff14", textShadow: "0 0 20px #39ff1466, 0 0 40px #39ff1422" }}
          >
            Siggy&apos;s Story
          </h1>
          <p className="text-mist/50 text-[10px] sm:text-xs tracking-wider font-body hidden sm:block">
            The Eternal Onchain Lore · Ritual Chain
          </p>
        </div>
      </motion.div>

      {/* RainbowKit compact on mobile */}
      <div className="shrink-0">
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
        />
      </div>
    </header>
  );
}
