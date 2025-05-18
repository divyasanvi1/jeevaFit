// pages/HealthLearningPage.jsx
import React from 'react';
import HealthTopics from '../components/FunctionalComponents/HealthTopics';
import { useTranslation } from 'react-i18next';

const HealthLearningPage = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[#03045E] mb-6"> {t('healthLearning.title')}</h2>
      <HealthTopics />
    </div>
  );
};

export default HealthLearningPage;
