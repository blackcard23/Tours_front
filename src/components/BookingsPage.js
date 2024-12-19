import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState('all');
  const token = useSelector((state) => state.auth.token);
  const { t } = useTranslation();

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    axios
      .get('http://127.0.0.1:8000/tours/tours/booking/list/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBookings(response.data);
        setFilteredBookings(response.data);
      })
      .catch((error) => {
        console.error('Error loading bookings:', error);
      });
  }, [token]);

  useEffect(() => {
    const filtered = bookings.filter((booking) => {
      const bookingDate = new Date(booking.tour.date);
      return bookingDate <= new Date();
    });
    setFilteredBookings(filtered);
  }, [bookings]);

  const handlePaymentStatusChange = (e) => {
    const status = e.target.value;
    setPaymentStatus(status);

    let filteredData;
    if (status === 'paid') {
      filteredData = bookings.filter((booking) => booking.is_paid === true);
    } else if (status === 'unpaid') {
      filteredData = bookings.filter((booking) => booking.is_paid === false);
    } else {
      filteredData = bookings;
    }

    setFilteredBookings(filteredData);
  };

  const sortedBookings = [...filteredBookings].sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

  if (bookings.length === 0) {
    return <div className="text-center text-gray-600">{t('main.loading')}</div>;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-gray-100 via-gray-300 to-white dark:from-gray-900 dark:via-purple-900 dark:to-black py-6 px-4">
      <h1 className="text-4xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-8">
        {t('main.myBookings')}
      </h1>

      <div className="flex justify-end items-center gap-4 mb-6">
        <select
          value={paymentStatus}
          onChange={handlePaymentStatusChange}
          className="p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
        >
          <option value="all">{t('booking.allBookings')}</option>
          <option value="paid">{t('booking.paid')}</option>
          <option value="unpaid">{t('booking.unpaid')}</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg shadow-md">
        <table className="min-w-full bg-white dark:bg-gray-900">
          <thead>
            <tr className="bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-gray-300">
              <th className="py-4 px-6 text-left font-medium">{t('tour')}</th>
              <th className="py-4 px-6 text-left font-medium">{t('hotel')}</th>
              <th className="py-4 px-6 text-left font-medium">{t('city')}</th>
              <th className="py-4 px-6 text-left font-medium">{t('date')}</th>
              <th className="py-4 px-6 text-left font-medium">{t('totalPrice')}</th>
              <th className="py-4 px-6 text-left font-medium">{t('booking.paymentStatus')}</th>
              <th className="py-4 px-6 text-left font-medium">{t('booking.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedBookings.map((booking, index) => (
              <tr
                key={booking.id}
                className={`border-b dark:border-gray-800 ${
                  index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
                } hover:bg-indigo-50 dark:hover:bg-gray-700 transition duration-200`}
              >
                <td className="py-4 px-6">{booking.tour.name}</td>
                <td className="py-4 px-6">{booking.tour.hotel_name}</td>
                <td className="py-4 px-6">{booking.tour.country_name}</td>
                <td className="py-4 px-6">{new Date(booking.datetime).toLocaleString()}</td>
                <td className="py-4 px-6 font-semibold text-indigo-600 dark:text-indigo-400">
                  {booking.total_price || 0} $
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.is_paid
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}
                  >
                    {booking.is_paid ? t('booking.paid') : t('booking.unpaid')}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <Link
                    to={`/booking/detail/${booking.id}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    {t('booking.viewBooking')}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsPage;
