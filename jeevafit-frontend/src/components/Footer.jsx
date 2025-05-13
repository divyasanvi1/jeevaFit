import React from 'react';
import { useTranslation } from 'react-i18next';


const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#03045E] text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Brand Info */}
        <div>
          <h3 className="text-2xl font-sans-serif font-bold mb-2">{t('footer.brand.title')}</h3>
          <p className="text-sm font-sans-serif font-medium text-gray-300">
          {t('footer.brand.description')}
          </p>
        </div>

        {/* Navigation */}
        <div className='w-full items-center justify-center md:text-center'>
          <h4 className="text-lg font-sans-serif font-bold mb-3">{t('footer.links.title')}</h4>
          <ul className="space-y-2 font-sans-serif font-medium text-sm text-gray-300">
            <li><a href="#features" className="hover:underline">{t('footer.links.features')}</a></li>
            <li><a href="#how-it-works" className="hover:underline">{t('footer.links.howItWorks')}</a></li>
            <li><a href="#contact" className="hover:underline">{t('footer.links.contact')}</a></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div className='w-full items-center justify-center md:text-center'>
          <h4 className="text-lg font-sans-serif font-bold mb-3">{t('footer.contact.title')}</h4>
          <p className="text-sm text-gray-300">{t('footer.contact.email')}</p>

          {/* Optional: Social icons (placeholder) */}
          {/* <div className="flex gap-4 mt-4">
            <a href="#" aria-label="Facebook" className="hover:text-[#FF6D00]">📘</a>
            <a href="#" aria-label="Twitter" className="hover:text-[#FF6D00]">🐦</a>
            <a href="#" aria-label="Instagram" className="hover:text-[#FF6D00]">📸</a>
          </div> */}
        </div>
      </div>

      <div className="text-center mt-10 text-xs text-gray-400">
      {t('footer.copyright', {
          year: new Date().getFullYear()
        })}
      </div>
    </footer>
  );
};

export default Footer;