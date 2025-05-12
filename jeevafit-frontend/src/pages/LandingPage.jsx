import React from "react";
import HeroSection from "../components/LandingPageSections/HeroSection";
import FeaturesSection from "../components/LandingPageSections/FeaturesSection";
import HowItWorks from "../components/LandingPageSections/HowItWorks";
import FinalCTA from "../components/LandingPageSections/FinalCTA";

function LandingPage() {
  return (
    <>
      <div className="w-full mx-auto flex flex-wrap items-center justify-center">
        {/* Put the welcome username here */}
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <FinalCTA />
      </div>
    </>
  );
}

export default LandingPage;