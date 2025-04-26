import React, { useEffect, useRef } from "react";
import {
  FaHeartbeat,
  FaLungs,
  FaWeight,
  FaTachometerAlt,
  FaTint,
  FaProcedures,
  FaHeartbeat as FaHrv,
  FaTemperatureHigh,
} from "react-icons/fa";
import { TbHeartRateMonitor } from "react-icons/tb";

const vitals = [
  {
    icon: <TbHeartRateMonitor size={30} className="text-[#FF6D00]" />,
    title: "Heart Rate",
    description:
      "Track your heartbeats per minute to monitor cardiovascular health and detect anomalies early.",
  },
  {
    icon: <FaTint size={30} className="text-[#FF6D00]" />,
    title: "Blood Oxygen (SpO2)",
    description:
      "Measure the oxygen saturation in your blood to ensure optimal respiratory function.",
  },
  {
    icon: <FaLungs size={30} className="text-[#FF6D00]" />,
    title: "Respiratory Rate",
    description:
      "Monitor breaths per minute to assess lung and overall health condition.",
  },
  {
    icon: <FaTachometerAlt size={30} className="text-[#FF6D00]" />,
    title: "Blood Pressure",
    description:
      "Keep track of systolic and diastolic blood pressure to manage hypertension risks.",
  },
  {
    icon: <FaTemperatureHigh size={30} className="text-[#FF6D00]" />,
    title: "Body Temperature",
    description:
      "Monitor your body temperature to detect fever or other health issues early.",
  },
  {
    icon: <FaWeight size={30} className="text-[#FF6D00]" />,
    title: "Body Mass Index (BMI)",
    description:
      "Analyze your weight in relation to height to maintain a healthy BMI range.",
  },
  {
    icon: <FaHrv size={30} className="text-[#FF6D00]" />,
    title: "Heart Rate Variability (HRV)",
    description:
      "Understand stress levels and autonomic nervous system health through HRV tracking.",
  },
  {
    icon: <FaProcedures size={30} className="text-[#FF6D00]" />,
    title: "Mean Arterial Pressure (MAP)",
    description:
      "Evaluate blood flow to organs with continuous MAP monitoring for critical insights.",
  },
];

// const HealthVitalTrackingFeature = () => {
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     const scrollContainer = scrollRef.current;
//     let scrollAmount = 0.5; // How fast to scroll (you can adjust!)

//     const scrollStep = () => {
//       if (scrollContainer) {
//         scrollContainer.scrollLeft += scrollAmount;

//         // Reset to start when reaching end (infinite loop effect)
//         if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
//           scrollContainer.scrollLeft = 0;
//         }
//       }
//     };

//     const intervalId = setInterval(scrollStep, 20); // Every 20ms, move a tiny bit

//     return () => clearInterval(intervalId); // Cleanup on unmount
//   }, []);

const HealthVitalTrackingFeature = () => {
  return (
    <>
      <div className="w-full mx-auto flex flex-wrap items-center justify-center bg-gradient-to-b from-[#f0f4ff] to-orange-50 px-4 lg:px-6 py-8 lg:py-12">
        <section className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-center py-12">
          <div className="w-full mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#FF6D00] mb-4">
                Monitor Your Vital Health Stats
              </h2>
              <p className="text-gray-600 text-lg">
                Stay informed with real-time tracking of key health vitals. Your
                wellness journey starts here.
              </p>
            </div>

            {/* Scrollable Feature Cards with Auto-Scroll */}
            <div className="w-full items-center justify-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {vitals.map((vital, index) => (
                <div
                  key={index}
                  className="w-auto h-full bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition"
                >
                  <div className="bg-[#FFE0B2] rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    {vital.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[#03045E] mb-2">
                    {vital.title}
                  </h3>
                  <p className="text-gray-500 mb-4 text-sm">
                    {vital.description}
                  </p>
                  {/* <button className="mt-auto bg-[#FF6D00] hover:bg-[#e85d00] transition px-4 py-2 rounded-xl text-white text-sm font-semibold">
                Track Now
              </button> */}
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-16 flex flex-col items-center">
              <h3 className="text-2xl font-bold text-[#03045E] mb-4">
                Ready to Monitor Your Health?
              </h3>
              <p className="text-gray-600 mb-6">
                Start tracking your vitals today for a healthier tomorrow.
              </p>
              <button className="bg-[#FF6D00] hover:bg-[#e85d00] transition px-6 py-2 rounded-full text-white text-lg font-semibold">
                Start Tracking Now
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
export default HealthVitalTrackingFeature;
