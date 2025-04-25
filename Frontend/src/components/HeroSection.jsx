import React from "react";
import hero from "../assets/data-stats-around-person-doing-physical-activity.jpg"; // Make sure to import the image

const HeroSection = () => {
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
            Your Health, <span className="text-[#FF5D00] font-sans-serif">All in Place</span>
          </h1>
          <p className="max-w-screen-lg text-lg md:text-xl mb-6 drop-shadow">
            Track your vitals, book appointments, check your medical history,
            get reminders, find hospitals, chat with health experts, and even
            talk to our AI-powered chatbot – all in one place.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 px-6 mt-8">
            <a
              href="#features"
              className="px-6 py-3 bg-[#FF6D00] text-white font-semibold rounded-xl hover:bg-orange-700 transition"
            >
              Know More
            </a>
            <a
              href="/login"
              className="px-6 py-3 border border-white text-white font-semibold rounded-xl hover:bg-white hover:text-[#FF6D00] transition"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
