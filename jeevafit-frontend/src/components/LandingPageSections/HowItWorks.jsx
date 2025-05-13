import React from "react";
import { useTranslation } from "react-i18next";

const HowItWorks = () => {
  const { t } = useTranslation();

  return (
   <div className="w-full mx-auto flex flex-wrap items-center justify-center bg-orange-50 px-4 lg:px-6 py-8 lg:py-12">
     <section className="py-16 max-w-screen-xl mx-auto flex flex-wrap items-center justify-center" id="how-it-works">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#03045E]">
          {t("howItWorks.title")}
        </h2>
        <p className="text-lg font-sans-serif font-semibold mt-4 text-gray-600">
        {t("howItWorks.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mx-auto">
        {/* Step 1: Login/Signup */}
        <div className="w-full flex flex-col items-center text-center border-2 border-[#FF6D00] rounded-2xl p-8 bg-white hover:bg-[#FF5D00]/5 shadow-lg">
          <svg
            className="w-10 h-10 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
          >
            <g fill="#03045E">
            <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM504 312l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
            </g>
          </svg>
          <h3 className="text-xl font-semibold text-[#FF6D00]">
          {t("howItWorks.step1.title")}
          </h3>
          <p className="text-lg text-gray-600 mt-2">
          {t("howItWorks.step1.desc")}
          </p>
        </div>

        {/* Step 2: Enter Info */}
        <div className="w-full flex flex-col items-center text-center border-2 border-[#FF6D00] rounded-2xl p-8 bg-white  hover:bg-[#FF5D00]/5 shadow-lg">
        <svg
            className="w-10 h-10 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
          >
            <g fill="#03045E">
            <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM288 368a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm211.3-43.3c-6.2-6.2-16.4-6.2-22.6 0L416 385.4l-28.7-28.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l40 40c6.2 6.2 16.4 6.2 22.6 0l72-72c6.2-6.2 6.2-16.4 0-22.6z" />
            </g>
          </svg>
          <h3 className="text-xl font-semibold text-[#FF6D00]">
          {t("howItWorks.step2.title")}
          </h3>
          <p className="text-lg text-gray-600 mt-2">
          {t("howItWorks.step2.desc")}
          </p>
        </div>

        {/* Step 3: HealthMate Takes Care */}
        <div className="w-full flex flex-col items-center text-center border-2 border-[#FF6D00] rounded-2xl p-8 bg-white hover:bg-[#FF5D00]/5 shadow-lg">
        <svg
            className="w-10 h-10 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
          >
            <g fill="#03045E">
            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-96 55.2C54 332.9 0 401.3 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7c0-81-54-149.4-128-171.1l0 50.8c27.6 7.1 48 32.2 48 62l0 40c0 8.8-7.2 16-16 16l-16 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l0-24c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 24c8.8 0 16 7.2 16 16s-7.2 16-16 16l-16 0c-8.8 0-16-7.2-16-16l0-40c0-29.8 20.4-54.9 48-62l0-57.1c-6-.6-12.1-.9-18.3-.9l-91.4 0c-6.2 0-12.3 .3-18.3 .9l0 65.4c23.1 6.9 40 28.3 40 53.7c0 30.9-25.1 56-56 56s-56-25.1-56-56c0-25.4 16.9-46.8 40-53.7l0-59.1zM144 448a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
            </g>
          </svg>
          <h3 className="text-xl font-semibold text-[#FF6D00]">
          {t("howItWorks.step3.title")}
          </h3>
          <p className="text-lg text-gray-600 mt-2">
          {t("howItWorks.step3.desc")}
          </p>
        </div>
      </div>

      {/* CTA to get started */}
      {/* <div className="text-center mt-8">
        <a
          href="#get-started"
          className="px-8 py-3 bg-[#FF6D00] text-white font-semibold rounded-xl hover:bg-orange-700 transition"
        >
          Get Started
        </a>
      </div> */}
    </section>
   </div>
  );
};

export default HowItWorks;