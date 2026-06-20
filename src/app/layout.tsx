import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";
import { CommandPaletteProvider } from "@/components/search/command-palette";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { buildMetadata } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = buildMetadata({});

export const viewport: Viewport = {
  themeColor: "#0a0710",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${display.variable} ${mono.variable}`}>
      <body className="min-h-screen font-sans">
        <Providers>
          <CommandPaletteProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </CommandPaletteProvider>
        </Providers>
      </body>
    </html>
  );
}
