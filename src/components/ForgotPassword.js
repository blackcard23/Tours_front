import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    } else {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    }
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      await axios.post('http://127.0.0.1:8000/avtorizate/reset-password-request/', { email });
      setMessage('Код подтверждения отправлен на ваш email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.email || 'Ошибка при запросе сброса пароля.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/avtorizate/reset-password-confirm/', {
        email,
        code,
        new_password: newPassword,
      });
      setMessage(response?.data?.message || 'Пароль успешно сброшен. Вы можете войти с новым паролем.');
      setStep(1);
      setEmail('');
      setCode('');
      setNewPassword('');
      navigate('/login/sigin');
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        'Ошибка при подтверждении сброса пароля.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg`}>
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
          {step === 1 ? 'Восстановление пароля' : 'Подтверждение сброса'}
        </h1>
        {message && <div className="bg-green-500 text-white p-3 rounded mb-4">{message}</div>}
        {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleRequestReset}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Введите ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-indigo-600 text-white p-3 rounded-lg ${isSubmitting ? 'cursor-not-allowed' : 'hover:bg-indigo-700'} transition duration-200`}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить код'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleConfirmReset}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Код подтверждения"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Новый пароль"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-indigo-600 text-white p-3 rounded-lg ${isSubmitting ? 'cursor-not-allowed' : 'hover:bg-indigo-700'} transition duration-200`}
            >
              {isSubmitting ? 'Подтверждение...' : 'Сбросить пароль'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
