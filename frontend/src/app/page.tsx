import dynamic from "next/dynamic";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";

// SSR disabled to avoid wagmi/window errors during prerender
const StoryScroll = dynamic(
  () => import("@/components/StoryScroll").then((m) => m.StoryScroll),
  { ssr: false }
);

export default function Home() {
  return (
    <Providers>
      {/* Background: wizard cat image at low opacity */}
      <div
        className="fixed inset-0 bg-siggy"
        style={{ opacity: 0.25, zIndex: 0 }}
        aria-hidden="true"
      />

      {/* Dark vignette overlay so text is readable */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, #060810cc 0%, #060810f0 100%)",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Green atmospheric glow at top */}
      <div
        className="fixed inset-x-0 top-0 h-64 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% -20%, #39ff1408 0%, transparent 70%)",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 px-6 py-5 max-w-[1380px] mx-auto w-full">
          <StoryScroll />
        </main>
        <footer className="text-center py-3 border-t border-siggy-green/10">
          <p className="text-mist/25 text-xs font-body tracking-wider">
            Built on <span className="text-siggy-green/40">Ritual Chain</span> · Every word, eternal · Narrated by Siggy 🐱
          </p>
        </footer>
      </div>
    </Providers>
  );
}
