import React from 'react';

const FinalCTA = () => {
  return (
    <div className="w-full mx-auto flex flex-wrap items-center justify-center bg-[#FF6D00] px-4 lg:px-6">
        <section className="w-full text-white py-16 px-6 text-center">
      <div className="w-full mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to take charge of your health?
        </h2>
        <p className="text-lg md:text-xl mb-8">
          Join thousands who track vitals, book appointments, manage medical history, and stay on top of their health with JeevaFit.
        </p>
        <a
          href="/login"
          className="inline-block px-8 py-4 bg-white text-[#FF6D00] font-semibold rounded-xl hover:bg-gray-100 transition"
        >
          Get Started Now
        </a>
      </div>
    </section>
    </div>
  );
};

export default FinalCTA;
