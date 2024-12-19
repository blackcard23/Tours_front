import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyEmailPage = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(60); 
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval); 
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
        await axios.post('http://127.0.0.1:8000/avtorizate/verify-email/', { email, code });
        setMessage('Email успешно подтвержден!');
        setTimeout(() => navigate('/'), 60);
      } catch (err) {
        setError(err.response?.data?.detail || 'Произошла ошибка. Проверьте данные и попробуйте снова.');
      } finally {
        setIsSubmitting(false);
      }
    };

  const handleResendCode = async () => {
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      await axios.post('http://127.0.0.1:8000/avtorizate/verify-email/', { email, code });
      setMessage('Код подтверждения отправлен повторно!');
      setTimeout(() => navigate('/verify-email/'), 60);

    } catch (err) {
        setError(err.response?.data?.detail || 'Произошла ошибка. При отправке повторного кода.');
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-4">
          Подтверждение Email
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Введите ваш email и код подтверждения, чтобы завершить регистрацию.
        </p>
        {message && (
          <div className="mb-4 text-sm text-green-600 bg-green-100 border border-green-200 rounded-lg p-2">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-200 rounded-lg p-2">
            {error}
          </div>
        )}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Ваш Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-white ${
              email && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-indigo-500'
            }`}
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Код подтверждения"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-white ${
              code && code.length !== 6
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-indigo-500'
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-4 py-2 text-white font-bold rounded-lg ${
            isSubmitting
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          {isSubmitting ? 'Подтверждение...' : 'Подтвердить'}
        </button>
      </form>
    </div>
  );
};

export default VerifyEmailPage;
