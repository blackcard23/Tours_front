import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutOurTour = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white rounded-xl shadow-lg mb-16">
      <div className="max-w-screen-lg mx-auto text-center">
        <h2 className="text-5xl font-extrabold text-blue-700 dark:text-blue-400">
          {t('about.title')}
        </h2>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
          {t('about.description')}
        </p>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-sm dark:bg-gray-700 dark:text-white">
          <div className="flex justify-center items-center w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full dark:bg-blue-800 dark:text-blue-300">
            <i className="fas fa-check-circle text-3xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
            {t('about.easyBooking')}
          </h3>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {t('about.easyBookingDescription')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md max-w-sm dark:bg-gray-700 dark:text-white">
          <div className="flex justify-center items-center w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full dark:bg-green-800 dark:text-green-400">
            <i className="fas fa-headset text-3xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
            {t('about.excellentSupport')}
          </h3>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {t('about.excellentSupportDescription')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutOurTour;
