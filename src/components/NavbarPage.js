// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { useTranslation } from 'react-i18next';
// import { logout } from '../redux/actions'; // assuming you have a logout action

// const NavbarPage = ({ changeLanguage }) => {
//   const { t } = useTranslation();
//   const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   const handleLogout = () => {
//     dispatch(logout()); // Assuming you have an action to clear user data and token
//   };

//   return (
//     <header className="max-w-screen-xl mx-auto p-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-4xl font-bold text-white">{t('header.title')}</h1>
//         <div className="space-x-4">
//           <button
//             onClick={() => changeLanguage('en')}
//             className="bg-white text-blue-500 py-2 px-4 rounded-full hover:bg-blue-100"
//           >
//             EN
//           </button>
//           <button
//             onClick={() => changeLanguage('ru')}
//             className="bg-white text-blue-500 py-2 px-4 rounded-full hover:bg-blue-100"
//           >
//             RU
//           </button>
//           {user ? (
//             <div className="space-x-4">
//               <Link to="/profile" className="text-white hover:underline">{t('header.profile')}</Link>
//               <Link to="/booking-history" className="text-white hover:underline">{t('header.bookings')}</Link>
//               <Link to="/transactions" className="text-white hover:underline">{t('header.transactionHistory')}</Link>
//               <button
//                 onClick={handleLogout}
//                 className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600"
//               >
//                 {t('header.logout')}
//               </button>
//             </div>
//           ) : (
//             <div className="space-x-4">
//               <Link to="/login" className="text-white hover:underline">{t('header.login')}</Link>
//               <Link to="/register" className="text-white hover:underline">{t('header.register')}</Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default NavbarPage;
