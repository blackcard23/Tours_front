import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localToken, setLocalToken] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setLocalToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localToken) {
      axios
        .get('http://127.0.0.1:8000/cards/transactions/', {
          headers: {
            Authorization: `Bearer ${localToken}`,
          },
        })
        .then((response) => {
          setTransactions(response.data.sort((a, b) => new Date(b.datetime) - new Date(a.datetime)));
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching transactions:', error);
          setLoading(false);
          toast.error(t('error_fetching_data'));
        });
    }
  }, [localToken]);

  const handlePayment = (fromCardId, toCardId, amount, categoryId) => {
    axios
      .post('http://127.0.0.1:8000/cards/transactions/', {
        from_card: fromCardId,
        to_card: toCardId,
        value: amount,
        category: categoryId,
      }, {
        headers: {
          Authorization: `Bearer ${localToken}`,
        },
      })
      .then((response) => {
        toast.success(t('payment_successful'));
        setTransactions([...transactions, response.data]);
      })
      .catch((error) => {
        toast.error(t('payment_failed'));
        console.error('Payment error:', error);
      });
  };

  if (loading) {
    return <div className="text-center text-gray-600">{t('loading')}...</div>;
  }

  if (transactions.length === 0) {
    return <div className="text-center text-gray-600">{t('trans.no_transactions')}</div>;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-gray-100 via-gray-300 to-white dark:from-gray-900 dark:via-purple-900 dark:to-black py-6 px-4">
      <h1 className="text-4xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-8">
        {t('trans.history')}
      </h1>

      <div className="overflow-hidden rounded-lg shadow-md">
        <table className="min-w-full bg-white dark:bg-gray-900">
          <thead>
            <tr className="text-white bg-teal-500 dark:bg-purple-500 ">
              <th className="py-4 px-6 text-left font-medium">{t('trans.transaction_id')}</th>
              <th className="py-4 px-6 text-left font-medium">{t('trans.value')}</th>
              <th className="py-4 px-6 text-left font-medium">{t('trans.category')}</th>
              <th className="py-4 px-6 text-left font-medium">{t('trans.date')}</th>
              <th className="py-4 px-6 text-left font-medium">{t('trans.details')}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b hover:bg-teal-50 dark:hover:bg-gray-700  transition duration-200"
              >
                <td className="py-4 px-6">{transaction.id}</td>
                <td className="py-4 px-6 font-medium text-teal-600 dark:text-purple-700">{transaction.value}</td>
                <td className="py-4 px-6">{transaction.category_name}</td>
                <td className="py-4 px-6" >{new Date(transaction.datetime).toLocaleString()}</td>
                <td className="py-4 px-6">
                  <button
                    className="text-teal-600 hover dark:text-purple-800 font-semibold"
                    onClick={() => {
                      window.location.href = `/transactions/${transaction.id}`;
                      toast.success(t('viewing_details'));
                    }}
                  >
                    {t('trans.view_details')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-6 mt-8">
        {transactions
          .filter((transaction) => transaction.transaction_type === 'income')
          .map((transaction) => (
            <div
              key={transaction.id}
              className="border p-6 rounded-lg shadow-lg bg-white dark:bg-gray-700"
            >
              <p className="text-sm text-gray-700 dark:text-gray-200 font-medium"><strong>{t('transaction_id')}:</strong> {transaction.id}</p>
              <p className="text-sm text-gray-700 dark:text-gray-200"><strong>{t('value')}:</strong> {transaction.value}</p>
              <p className="text-sm text-gray-700 dark:text-gray-200"><strong>{t('date')}:</strong> {new Date(transaction.datetime).toLocaleString()}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
