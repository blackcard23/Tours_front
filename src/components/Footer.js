import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = ({ theme }) => {
  const { t } = useTranslation();

  return (
    <footer
      className={`py-8 ${theme === 'dark' ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300' : 'bg-gradient-to-r from-teal-600 to-indigo-700 text-white'}`}
    >
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-lg font-bold">{t('footer.companyName')}</h3>
          <p className="mt-5 text-sm">{t('footer.allRightsReserved')}</p>
        </div>
        <div>
          <h3 className="text-lg font-bold">{t('footer.navigation')}</h3>
          <br/>
          <ul className="space-y-6">
            <li>
              <Link to="/profile" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm lg:text-base font-medium transition-colors duration-200">
                {t('footer.terms')}
              </Link>
            </li>
            <li>
              <Link to="/transaction-history" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm lg:text-base font-medium transition-colors duration-200">
                {t('footer.privacy')}
              </Link>
            </li>
            <li>
              <Link to="/booking-history" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm lg:text-base font-medium transition-colors duration-200">
                {t('footer.contact')}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold">{t('footer.followUs')}</h3>
          <div className="flex space-x-4 mt-4">
            <a href="https://www.instagram.com/touragency_23?igsh=bXM0NnR3b3o0Zmdx" className="text-xl hover:text-pink-500">Instagram</a>
            <a href="https://t.me/tour2323_bot" className="text-xl hover:text-blue-400">Telegram</a>
          </div>
        </div>
      </div>
      <p className="text-center mt-8">{t('footer.operatingHoursInfo')}</p>
    </footer>
  );
};

export default Footer;
