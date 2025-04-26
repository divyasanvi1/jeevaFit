import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorks from "../components/HowItWorks";
import FinalCTA from "../components/FinalCTA";
import NearestHospitalFeature from "../components/NearestHospitalFeature";
import HealthVitalTrackingFeature from "../components/HealthVitalTrackingFeature";

function LandingPage() {
  return (
    <>
      <div className="w-full mx-auto flex flex-wrap items-center justify-center">
        {/* Put the welcome username here */}
        <HeroSection />
        <FeaturesSection />
        <HealthVitalTrackingFeature />
        <NearestHospitalFeature />
        <HowItWorks />
        <FinalCTA />
      </div>
    </>
  );
}

export default LandingPage;
