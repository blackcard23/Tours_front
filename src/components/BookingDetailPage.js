import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cards, setCards] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const { t } = useTranslation();

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/tours/tours/booking/${bookingId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBooking(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError(t('error_loading_data'));
        setLoading(false);
        toast.error(t('error_loading_data'));
      });

    axios
      .get('http://127.0.0.1:8000/cards/cards/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCards(response.data);
      })
      .catch(() => {
        toast.error(t('error_loading_cards_retry'));
      });
  }, [bookingId, token, t]);

  const translateCategory = (category) => {
    const categoryMap = {
      child: t('booking.child'),
      adult: t('booking.adult'),
      senior: t('booking.senior'),
    };
    return categoryMap[category.toLowerCase()] || category;
  };

  const handlePayment = () => {
    if (cards.length === 0) {
      toast.error(t('no_cards_available'));
      return;
    }

    const cardId = cards[0].id;

    const paymentData = {
      booking_id: booking.id,
      card_id: cardId,
    };

    axios
      .post('http://127.0.0.1:8000/avtorizate/pay/', paymentData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success(t('payment_success'));
        setBooking((prevState) => ({ ...prevState, is_paid: true }));
      })
      .catch((error) => {
        toast.error(t('payment_error_retry'));
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        <span className="text-2xl text-white font-bold animate-pulse">{t('loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        <span className="text-xl text-white font-bold">{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-300 to-white dark:from-gray-900 dark:via-purple-900 dark:to-black py-6 px-4">
      <div className="container mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl mt-12">
        <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4">
          {t('booking.details')}
        </h1>
  
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold text-purple-500 mb-4">{booking.tour.name}</h2>
          <p className="text-lg mt-2">
            {t('booking.tourDate')}:{' '}
            <span className="font-semibold text-purple-500"> {booking.tour.date}</span>
          </p>
          <p className="text-lg mt-2">
            {t('booking.totalPrice')}:{' '}
            <span className="font-semibold text-purple-500"> {booking.total_price}$</span>
          </p>
          <p className="text-lg mt-2">
            {t('booking.peopleCount')}:{' '}
            <span className="font-semibold text-purple-500">
              {booking.booking_people.reduce((sum, person) => sum + person.count, 0)}
            </span>
          </p>
  
          <div className="mt-6">
            <h3 className="text-2xl font-semibold text-purple-500 mb-4">{t('booking.bookingComposition')}:</h3>
            <div className="space-y-4">
              {booking.booking_people.map((person, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-100 via-pink-50 to-red-50 dark:from-purple-200 dark:via-pink-100 dark:to-red-100 rounded-lg shadow-sm"
                >
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-700">
                  {person.count} {translateCategory(person.person_category)}
                  </span>
                  <span className="text-lg font-medium text-blue-600">
                    {(person.count * parseFloat(person.person_price)).toFixed(2)}$
                  </span>
                </div>
              ))}
            </div>
          </div>
  
          <p className="mt-6 text-xl font-medium text-purple-500">
            {t('booking.paymentStatus')}:{' '}
            <span
              className={`font-semibold ${
                booking.is_paid ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {booking.is_paid ? t('booking.paid') : t('booking.notPaid')}
            </span>
          </p>
  
          {!booking.is_paid && (
            <button
              onClick={handlePayment}
              className="mt-6 w-full py-3 px-6 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold text-lg rounded-lg shadow-md hover:from-green-500 hover:to-blue-600 transition duration-300"
            >
              {t('booking.payNow')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
  

};

export default BookingDetailPage;
