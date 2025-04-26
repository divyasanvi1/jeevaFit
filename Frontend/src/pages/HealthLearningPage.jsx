// pages/HealthLearningPage.jsx
import React from 'react';
import HealthTopics from '../components/HealthTopics';

const HealthLearningPage = () => {
  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[#03045E] mb-6">Health Learning</h2>
      <HealthTopics />
    </div>
  );
};

export default HealthLearningPage;
