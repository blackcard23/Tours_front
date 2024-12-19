import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../redux/authSlice';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState({
    id: null,
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  });
  const [cards, setCards] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [cardName, setCardName] = useState('');
  const [flippedCardId, setFlippedCardId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      axios
        .get('http://127.0.0.1:8000/avtorizate/users/me/', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data) {
            setUserData(response.data);
            dispatch(setUser(response.data));
          }
        })
        .catch((error) => {
          console.error('Ошибка загрузки профиля:', error);
        });

      axios
        .get('http://127.0.0.1:8000/cards/cards/', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setCards(response.data);
        })
        .catch((error) => {
          console.error('Ошибка загрузки карт:', error);
        });
    }
  }, [token, navigate, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!userData.id) {
      console.error('ID пользователя отсутствует');
      return;
    }
    axios
      .put(
        'http://127.0.0.1:8000/avtorizate/users/me/',
        { first_name: userData.first_name, last_name: userData.last_name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setIsEditing(false);
        toast.success(t('profile.profileUpdated'));
      })
      .catch((error) => {
        console.error('Ошибка при сохранении данных:', error);
        toast.error(t('profile.errorUpdatingProfile'));
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    dispatch(setUser({}));
    navigate('/login');
    toast.success(t('profile.logoutSuccess'));
  };

  const handleAddCard = () => {
    if (!cardName) {
      toast.error(t('profile.errorAddingCard'));
      return;
    }

    axios
      .post(
        'http://127.0.0.1:8000/cards/cards/',
        { card_name: cardName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setCards([...cards, response.data]);
        setShowAddCardForm(false);
        setCardName('');
        toast.success(t('profile.cardAdded'));
      })
      .catch((error) => {
        console.error('Ошибка при добавлении карты:', error);
        toast.error(t('profile.errorAddingCard'));
      });
  };

  const handleCardNameChange = (e) => {
    setCardName(e.target.value);
  };

  const toggleCardFlip = (cardId) => {
    setFlippedCardId(flippedCardId === cardId ? null : cardId);
  };

  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-300 to-white dark:from-gray-900 dark:via-purple-900 dark:to-black py-6 px-4">

    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:shadow-[0px_15px_50px_rgba(0,0,0,0.3)]"
      >
        <div className="px-8 py-10 sm:px-12">
          <div className="border-b border-gray-300 dark:border-gray-700 pb-10 mb-10">
            <h1 className="text-4xl font-extrabold text-indigo-800 tracking-tight dark:text-indigo-300">
              {t('profile.myProfile')}
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
              {t('profile.manageInfo')}
            </p>
          </div>
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="relative">
                <label className="block text-lg font-medium text-gray-800 dark:text-gray-300 mb-2">
                  {t('profile.username')}
                </label>
                <div className="mt-2 px-5 py-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-200 font-semibold text-lg shadow-inner">
                  {userData.username}
                </div>
              </div>
              <div className="relative">
                <label className="block text-lg font-medium text-gray-800 dark:text-gray-300 mb-2">
                  {t('profile.email')}
                </label>
                <div className="mt-2 px-5 py-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-200 font-semibold text-lg shadow-inner">
                  {userData.email}
                </div>
              </div>
              <div className="relative">
                <label className="block text-lg font-medium text-gray-800 dark:text-gray-300 mb-2">
                  {t('profile.firstName')}
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={userData.first_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-2 block w-full px-5 py-4 rounded-lg text-lg shadow-inner transition-all focus:outline-none 
                    ${!isEditing
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      : 'bg-white dark:bg-gray-600 border-2 border-indigo-600 focus:ring-4 focus:ring-indigo-300'}`}
                />
              </div>
              <div className="relative">
                <label className="block text-lg font-medium text-gray-800 dark:text-gray-300 mb-2">
                  {t('profile.lastName')}
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={userData.last_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-2 block w-full px-5 py-4 rounded-lg text-lg shadow-inner transition-all focus:outline-none 
                    ${!isEditing
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      : 'bg-white dark:bg-gray-600 border-2 border-indigo-600 focus:ring-4 focus:ring-indigo-300'}`}
                />
              </div>
            </div>
            <div className="mt-8 flex justify-between">
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-3 bg-indigo-700 dark:bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-800 dark:hover:bg-indigo-700 transition-all"
                >
                  {t('profile.edit')}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="px-8 py-3 bg-green-600 dark:bg-green-700 text-white rounded-xl shadow-lg hover:bg-green-700 dark:hover:bg-green-800 transition-all"
                >
                  {t('profile.save')}
                </motion.button>
              )}
            </div>
            <div className="mt-10">
              <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">
                {t('profile.cards')}
              </h2>
              <div className="mt-6 flex flex-col gap-8">
                {cards.length > 0 ? (
                  cards.map((card) => (
                    <div
                      key={card.id}
                      className="relative bg-gradient-to-r from-blue-500 to-green-400 rounded-2xl shadow-xl p-8 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                      onClick={() => toggleCardFlip(card.id)}
                    >
                      <div className="absolute top-4 right-4 text-sm font-medium text-gray-100">
                        {card.mm_yy}
                      </div>
                      <h3 className="text-2xl font-semibold mb-6">
                        {card.card_name || t('profile.noName')}
                      </h3>
                      {flippedCardId === card.id ? (
                        <div>
                          <p className="text-base font-light mb-2">{t('profile.cardNumber')}</p>
                          <p className="text-3xl font-bold tracking-wider">
                            {card.card_num}
                          </p>
                          <p className="text-base font-light mt-6">{t('profile.balance')}</p>
                          <p className="text-4xl font-bold">{card.balance} сум</p>
                        </div>
                      ) : (
                        <p className="text-3xl font-bold tracking-wider">
                          {`**** **** **** ${card.card_num.slice(-4)}`}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 text-lg">
                    {t('profile.noCards')}
                  </div>
                )}
              </div>
              {cards.length === 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddCardForm(true)}
                  className="mt-8 px-8 py-3 rounded-xl text-white bg-indigo-700 dark:bg-indigo-600 hover:bg-indigo-800 dark:hover:bg-indigo-700 shadow-lg transition-all"
                >
                  {t('profile.addCard')}
                </motion.button>
              )}
            </div>
            {showAddCardForm && (
              <div className="mt-10">
                <input
                  type="text"
                  placeholder={t('profile.cardName')}
                  value={cardName}
                  onChange={handleCardNameChange}
                  className="w-full px-6 py-4 rounded-xl border-2 border-indigo-600 focus:ring-4 focus:ring-indigo-300 bg-gray-100 dark:bg-gray-700 shadow-inner"
                />
                <div className="mt-6 flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddCard}
                    className="px-8 py-3 text-white bg-indigo-700 dark:bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-800 dark:hover:bg-indigo-700 transition-all"
                  >
                    {t('profile.addCard')}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddCardForm(false)}
                    className="px-8 py-3 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-xl shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
                  >
                    {t('profile.cancel')}
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
    <div className="mt-12 text-center">
      <button
        onClick={handleLogout}
        className="w-full max-w-xs mx-auto px-8 py-3 rounded-xl text-white bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 shadow-lg transition-all"
      >
        {t('profile.logout')}
      </button>
    </div>
    <ToastContainer />
  </motion.div>
  
  );
};

export default ProfilePage;
