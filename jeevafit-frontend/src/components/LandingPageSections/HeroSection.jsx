import React from "react";
import hero from "../../assets/main.jpeg"; // Make sure to import the image
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGetStarted = () => {
    navigate("/login"); // Client-side routing without reload
  };

  return (
    <>
      <div className="relative w-full h-[90vh]">
      <img
            src={hero}
            alt="JeevaFit Hero"
            className="absolute w-full h-full object-cover object-top"
          />
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white z-10 px-4 lg:px-6 py-8 lg:py-12">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow">
          {t("heroSection.heading.part1")}{" "} <span className="text-[#FF5D00] font-sans-serif">{t("heroSection.heading.part2")}</span>
          </h1>
          <p className="max-w-screen-lg text-lg md:text-xl mb-6 drop-shadow">
          {t("heroSection.description")}
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 px-6 mt-8">
          <a
            href="#features"
            className="px-6 py-3 bg-[#FF6D00] text-white font-semibold rounded-xl hover:bg-orange-700 transition"
          >
            {t("heroSection.knowMoreButton")}
          </a>
          <button
            onClick={handleGetStarted}
            className="px-6 py-3 border border-white text-white font-semibold rounded-xl hover:bg-white hover:text-[#FF6D00] transition"
          >
            {t("heroSection.getStartedButton")}
          </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;