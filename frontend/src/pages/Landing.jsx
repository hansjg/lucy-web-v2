import React, { useRef } from "react";
import SmoothScroll from "@/components/landing/SmoothScroll";
import PrismBackground from "@/components/landing/PrismBackground";
import LucyStage from "@/components/landing/LucyStage";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Capabilities from "@/components/landing/Capabilities";
import EmotionEngine from "@/components/landing/EmotionEngine";
import PrivacyTrust from "@/components/landing/PrivacyTrust";
import FooterSection from "@/components/landing/FooterSection";

const Landing = () => {
  /* Shared between Hero (owns the 260vh track) and LucyStage (scrubs her
     hero choreography from the same scroll progress). */
  const heroTrackRef = useRef(null);

  return (
    <SmoothScroll>
      <div data-testid="landing-page" className="relative min-h-screen">
        <PrismBackground />
        <LucyStage heroTrackRef={heroTrackRef} />
        <Header />
        <main className="relative z-20">
          <Hero trackRef={heroTrackRef} />
          <Capabilities />
          <EmotionEngine />
          <PrivacyTrust />
          <FooterSection />
        </main>
      </div>
    </SmoothScroll>
  );
};

export default Landing;
