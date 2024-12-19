import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import SearchPage from './SearchPage';
import AboutOurTour from './AboutOurTour';
import './themes.css';

const MainPage = ({ theme, toggleTheme }) => {
  const { t, i18n } = useTranslation();
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [localToken, setLocalToken] = useState(null);
  const [isToursLoaded, setIsToursLoaded] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 3;

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    const checkAuthStatus = () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        dispatch({ type: 'auth/setToken', payload: storedToken });
        setLocalToken(storedToken);
      }
      setAuthChecked(true);
    };
    checkAuthStatus();
  }, [dispatch]);

  useEffect(() => {
    const fetchTours = async () => {
      if (!localToken) return;
      try {
        const response = await axios.get('http://127.0.0.1:8000/tours/tours/', {
          headers: { Authorization: `Bearer ${localToken}` },
        });
        setTours(response.data);
        setFilteredTours(response.data);
        if (!isToursLoaded) setIsToursLoaded(true);
      } catch (error) {
        toast.error(t('toast.failedToLoadTours'), { position: 'bottom-right' });
      }
    };
    fetchTours();
  }, [localToken, t, isToursLoaded]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const getStringValue = (value) => (typeof value === 'object' ? value[i18n.language] : value);

  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const resetPage = () => {
    setCurrentPage(1);
  };

  if (!authChecked) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        {t('main.loading')}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-300 to-white dark:from-gray-900 dark:via-purple-900 dark:to-black py-6 px-4">
      <ToastContainer />

      <main className="max-w-screen-xl mx-auto p-6">
        <AboutOurTour />
        <h2 className="text-3xl font-semibold text-center my-8">{t('main.explore')}</h2>
        <SearchPage tours={tours} setFilteredTours={setFilteredTours} resetPage={resetPage} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentTours.length > 0 ? (
            currentTours.map((tour) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="card transform hover:scale-105"
              >
                <img
                  src={tour.photo_url || 'https://via.placeholder.com/300'}
                  alt={tour.name || t('main.untitled')}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{getStringValue(tour.name)}</h3>
                  <p>{getStringValue(tour.country_name)}</p>
                  <p className="text-sm">{getStringValue(tour.hotel_name)}</p>
                  <Link
                    to={`/booking/${tour.id}`}
                    className="text-blue-600 hover:underline mt-4 inline-block"
                  >
                    {t('main.bookNow')}
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center">{t('main.noTours')}</p>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <button
            className="px-4 py-2 border rounded-lg mr-2"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ⬅️
          </button>
          <button
            className="px-4 py-2 border rounded-lg"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage * toursPerPage >= filteredTours.length}
          >
            ➡️
          </button>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
