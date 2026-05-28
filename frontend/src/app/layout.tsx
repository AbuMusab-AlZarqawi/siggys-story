import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Siggy's Story — The Eternal Onchain Lore",
  description:
    "A never-ending collaborative story written by many, narrated by Siggy the wizard cat. Add your sentence to the onchain lore on Ritual Chain.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
