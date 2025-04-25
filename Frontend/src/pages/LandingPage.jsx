import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorks from "../components/HowItWorks";
import FinalCTA from "../components/FinalCTA";

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
