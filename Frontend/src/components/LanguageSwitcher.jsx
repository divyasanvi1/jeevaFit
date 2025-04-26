import React from 'react';
import i18n from 'i18next';

const LanguageSwitcher = () => {
  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <div className="language-switcher">
      <select onChange={handleLanguageChange} defaultValue={i18n.language}>
        <option value="en">English</option>
        <option value="hi">हिंदी</option>
        <option value="bn">বাংলা</option>
        <option value="ta">தமிழ்</option>
        <option value="mr">मराठी</option>
        <option value="te">తెలుగు</option>
        <option value="ur">اردو</option>
        <option value="gu">ગુજરાતી</option>
        <option value="ml">മലയാളം</option>
        <option value="kn">ಕನ್ನಡ</option>
        <option value="pa">ਪੰਜਾਬੀ</option>
        <option value="or">ଓଡ଼ିଆ</option>
        <option value="as">অসমীয়া</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
