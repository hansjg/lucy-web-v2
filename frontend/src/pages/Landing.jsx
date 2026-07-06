import React from "react";
import SmoothScroll from "@/components/landing/SmoothScroll";
import LiquidBackground from "@/components/landing/LiquidBackground";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Capabilities from "@/components/landing/Capabilities";
import EmotionEngine from "@/components/landing/EmotionEngine";
import PrivacyTrust from "@/components/landing/PrivacyTrust";
import FooterSection from "@/components/landing/FooterSection";
import LucyPresenter from "@/components/landing/LucyPresenter";

const Landing = () => (
  <SmoothScroll>
    <div data-testid="landing-page" className="relative min-h-screen">
      <LiquidBackground />
      <LucyPresenter />
      <Header />
      <main className="relative z-10">
        <Hero />
        <Capabilities />
        <EmotionEngine />
        <PrivacyTrust />
        <FooterSection />
      </main>
    </div>
  </SmoothScroll>
);

export default Landing;
