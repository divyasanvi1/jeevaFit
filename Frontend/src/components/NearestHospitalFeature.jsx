import React from "react";

const NearestHospitalFeature = () => {
  return (
    <div className="w-full mx-auto flex flex-wrap items-center justify-center bg-orange-50 px-4 lg:px-6 py-8 lg:py-12">
      <section className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-center">
        <div className="w-full mx-auto text-center">
          <h2 className="w-full text-3xl md:text-4xl font-bold text-[#03045E] mb-4">
            Find & Visit Nearby Hospitals
          </h2>
          <p className="text-gray-600 mb-10 text-lg">
            Search hospitals near you, get directions, and easily schedule your
            appointment — all in one place.
          </p>

          {/* Search Bar */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <input
              type="text"
              placeholder="Enter your location or hospital name..."
              className="w-full sm:w-96 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF6D00] outline-none"
            />
            <button className="bg-[#FF6D00] hover:bg-[#e85d00] transition px-6 py-3 rounded-xl text-white font-semibold">
              Search
            </button>
          </div>

          {/* Cards */}
          <div className="w-full items-center justify-between grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-10">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition">
              <div className="bg-[#03045E] text-white w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">
                Search Hospitals
              </h3>
              <p className="text-gray-500">
                Find the best hospitals near your location with real-time
                search.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition">
              <div className="bg-[#03045E] text-white w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">
                Get Directions
              </h3>
              <p className="text-gray-500">
                Get step-by-step directions to reach the hospital hassle-free.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition">
              <div className="bg-[#03045E] text-white w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">
                Schedule Appointment
              </h3>
              <p className="text-gray-500">
                Easily book an appointment slot with just a few taps.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NearestHospitalFeature;
