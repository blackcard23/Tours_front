
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const TransactionDetail = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      setAuthenticated(false);
      toast.error(t('unauthorized_access'));
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/cards/transactions/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTransaction(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching transaction:', error);
        setLoading(false);
        toast.error(t('error_fetching_data'));
      });
  }, [id, t]);

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return t('not_available');
    return `${cardNumber.slice(0, 4)} **** **** ${cardNumber.slice(-4)}`;
  };

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white font-bold animate-pulse">
        {t('loading')}...
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex items-center justify-center h-screen text-white font-bold">
        {t('error')}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 via-gray-300 to-white dark:from-gray-900 dark:via-purple-900 dark:to-black">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border-2 border-gray-300 dark:border-gray-600">
        <h1 className="text-5xl font-extrabold text-center mb-8 text-gray-800 dark:text-white">
          {t('trans.history_detail')}
        </h1>
        <div className="space-y-4 text-lg text-gray-700 dark:text-gray-200">
          <p className="flex justify-between border-b pb-2">
            <span className="font-semibold">{t('trans.transaction_id')}:</span>
            <span>{transaction.id}</span>
          </p>
          <p className="flex justify-between border-b pb-2">
            <span className="font-semibold">{t('trans.value')}:</span>
            <span>{transaction.value}</span>
          </p>
          <p className="flex justify-between border-b pb-2">
            <span className="font-semibold">{t('trans.from_card')}:</span>
            <span>{transaction.from_card ? maskCardNumber(transaction.from_card.card_num) : t('not_available')}</span>
          </p>
          <p className="flex justify-between border-b pb-2">
            <span className="font-semibold">{t('trans.category')}:</span>
            <span>{transaction.category_name}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-semibold">{t('trans.date')}:</span>
            <span>{new Date(transaction.datetime).toLocaleString()}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
