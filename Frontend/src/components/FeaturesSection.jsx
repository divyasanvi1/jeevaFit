import React from 'react';
import { HeartPulse, CalendarCheck, BarChart3, BellRing } from 'lucide-react';

const features = [
  {
    icon: <HeartPulse className="w-8 h-8 text-[#FF6D00]" />,
    title: "Live Health Tracking",
    description: "Track heart rate, blood oxygen, steps, and more — synced directly from your smartwatch.",
  },
  {
    icon: <CalendarCheck className="w-8 h-8 text-[#FF6D00]" />,
    title: "Appointment Scheduling",
    description: "Let HealthMate auto-book appointments when your health metrics need professional care.",
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-[#FF6D00]" />,
    title: "Personalized Health Reports",
    description: "Visualize your health trends and receive insights to improve your daily lifestyle.",
  },
  {
    icon: <BellRing className="w-8 h-8 text-[#FF6D00]" />,
    title: "Smart Reminders",
    description: "Get notified for medication, hydration, and physical activity — never miss a thing.",
  },
];

const FeaturesSection = () => {
  return (
    <div className='w-full mx-auto flex flex-wrap items-center justify-center px-4 lg:px-6 py-8 lg:py-12'>
        <section id="features" className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-center">
      <div className="w-full mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#FF5D00] mb-4">
          Why Choose JeevaFit?
        </h2>
        <p className="text-lg font-semibold font-sans-serif text-gray-600 max-w-2xl mx-auto mb-12">
          JeevaFit goes beyond tracking — it transforms your well-being with intelligent tools, personalized care, and a user-first experience.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-left">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 bg-orange-50 hover:bg-white rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        {/* <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#get-started"
            className="px-6 py-3 bg-[#FF6D00] text-white font-medium rounded-xl shadow hover:bg-orange-700 transition"
          >
            Get Started with JeevaFit
          </a>
          <a
            href="#demo"
            className="px-6 py-3 border border-[#FF6D00] text-[#FF6D00] font-medium rounded-xl hover:bg-orange-100 transition"
          >
            See a Live Demo
          </a>
        </div> */}
      </div>
    </section>
    </div>
  );
};

export default FeaturesSection;
