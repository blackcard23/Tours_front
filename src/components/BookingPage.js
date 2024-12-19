import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingPage = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [people, setPeople] = useState({
    children: 0,
    adults: 0,
    seniors: 0,
  });
  const token = useSelector((state) => state.auth.token);
  const { t } = useTranslation();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }

    axios
      .get(`http://127.0.0.1:8000/tours/tours/${tourId}/`)
      .then((response) => {
        setTour(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке тура:', error);
        toast.error(t('errorLoadingTour'));
      });
  }, [tourId, navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPeople((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const bookingData = {
      tour: tourId,
      booking_people: [
        { category: 'child', count: people.children },
        { category: 'adult', count: people.adults },
        { category: 'senior', count: people.seniors },
      ],
    };
    axios
      .post('http://127.0.0.1:8000/tours/booking/', bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        toast.success(t('bookingSuccessful'));
        navigate('/booking-history');
      })
      .catch((error) => {
        console.error('Ошибка при создании бронирования:', error);
        toast.error(t('errorBooking'));
      });
  };

  if (!tour) return <div className="text-center mt-10">{t('loading')}...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-300 to-white dark:from-gray-900 dark:via-purple-900 dark:to-black py-6 px-4">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-10">{tour.name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex justify-center items-center">
            <img
              src={tour.photo_url || "default_image_url.jpg"}
              alt={tour.name}
              className="w-full rounded-xl shadow-lg"
            />
          </div>
          <div className="p-6 bg-white rounded-xl shadow-xl dark:bg-gray-800">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {t('hotel')}: <span className="font-normal text-gray-500 dark:text-gray-400">{tour.hotel_name}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700 mt-4 dark:text-gray-300">
              {t('city')}: <span className="font-normal text-gray-500 dark:text-gray-400">{tour.country_name}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700 mt-4 dark:text-gray-300">
              {t('date')}: <span className="font-normal text-gray-500 dark:text-gray-400">{tour.date || t('notProvided')}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700 mt-4 dark:text-gray-300">
              {t('Information')}: <span className="font-normal text-gray-500 dark:text-gray-400">{tour.hotel_info}</span>
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl shadow-lg space-y-6 dark:from-gray-800 dark:to-gray-700 mt-8"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">{t('booking.choosePeople')}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['children', 'adults', 'seniors'].map((category) => (
              <div key={category}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t(category)}
                </label>
                <input
                  type="number"
                  name={category}
                  min="0"
                  placeholder="0"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                />
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all dark:from-indigo-400 dark:to-purple-500 dark:hover:from-indigo-500 dark:hover:to-purple-600 dark:focus:ring-indigo-500"
            >
              {t('booking.payNow')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
