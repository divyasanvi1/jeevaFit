import React from 'react';
import { useTranslation } from 'react-i18next';

const FinalCTA = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full mx-auto flex flex-wrap items-center justify-center bg-[#FF6D00] px-4 lg:px-6">
        <section className="w-full text-white py-16 px-6 text-center">
      <div className="w-full mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t("finalCTA.title")}
        </h2>
        <p className="text-lg md:text-xl mb-8">
        {t("finalCTA.subtitle")}
        </p>
        <a
          href="/login"
          className="inline-block px-8 py-4 bg-white text-[#FF6D00] font-semibold rounded-xl hover:bg-gray-100 transition"
        >
          {t("finalCTA.buttonText")}
        </a>
      </div>
    </section>
    </div>
  );
};

export default FinalCTA;