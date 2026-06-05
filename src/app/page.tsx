"use client";

import { ParticleBackground } from "@/components/effects/particle-background";
import { HeroSection } from "@/components/sections/hero";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">
      <ParticleBackground count={50} />
      <HeroSection />
      <ToolsGrid />
      <HowItWorks />
      <Footer />
    </main>
  );
}
