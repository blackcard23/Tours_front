import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

const Header = ({ theme, toggleTheme, changeLanguage, user }) => {
  const { t, i18n } = useTranslation();
  const localToken = localStorage.getItem('authToken');
  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    toggleTheme(newTheme);
    document.body.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  const currentLanguage = i18n.language;

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-gradient-to-r ${theme === 'light' ? 'from-teal-600 to-indigo-700' : 'from-gray-700 to-gray-800'
        } text-white shadow-lg z-50`}
    >
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl lg:text-3xl font-extrabold hover:underline">
          {t('header.Tours')}
        </Link>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => changeLanguage(currentLanguage === 'en' ? 'ru' : 'en')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm lg:text-base font-medium transition-colors duration-200"
          >
            {currentLanguage === 'en' ? t('RU') : t('EN')}
          </button>

          <button
            onClick={handleToggleTheme}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm lg:text-base font-medium transition-colors duration-200"
          >
            {theme === 'light' ? t('header.Dark') : t('header.Light')}
          </button>

          <Link
            to={user || localToken ? "/forgot-password/" : "/login/"}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm lg:text-base font-medium transition-colors duration-200"
          >
            {user || localToken ? t('login.forgotPassword') : t('header.login')}
          </Link>

        </div>
      </div>
    </header>
  );
};

export default Header;
