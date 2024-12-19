import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import MainPage from './components/MainPage';
import RegisterPage from './components/RegisterPage';
import BookingPage from './components/BookingPage';
import BookingsPage from './components/BookingsPage';
import ProfilePage from './components/ProfilePage';
import VerifyEmailPage from './components/VerifyEmailPage';
import ForgotPassword from './components/ForgotPassword';
import BookingDetailPage from './components/BookingDetailPage';
import TransactionHistory from './components/TransactionHistory';
import TransactionDetail from './components/TransactionDetail';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { useTranslation } from 'react-i18next';

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const { t, i18n } = useTranslation();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header theme={theme} toggleTheme={toggleTheme} changeLanguage={changeLanguage} />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/booking/:tourId" element={<BookingPage />} />
              <Route path="/booking-history" element={<BookingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/booking/detail/:bookingId" element={<BookingDetailPage />} />
              <Route path="/transaction-history" element={<TransactionHistory />} />
              <Route path="/transactions/:id" element={<TransactionDetail />} />
            </Routes>
          </main>
          <br></br>
          <Footer theme={theme} />
        </div>
      </Router>
    </Provider>
  );
};

export default App;
