import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
 
const RegisterPage = () => { 
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [email, setEmail] = useState(''); 
  const [message, setMessage] = useState(''); 
  const [error, setError] = useState(''); 
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate(); 
 
  const handleSignUp = async (e) => { 
    e.preventDefault(); 
    setMessage(''); 
    setError(''); 
 
    try { 
      const response = await axios.post('http://127.0.0.1:8000/avtorizate/users/register/', { 
        username, 
        password, 
        email, 
      }); 
 
      if (response.data.access) { 
        const { access } = response.data; 
        localStorage.setItem('authToken', access); 
        setMessage('Регистрация прошла успешно! Перенаправляем на подтверждение...'); 
        setTimeout(() => navigate('/verify-email'), 3000); 
      } 
    } catch (err) { 
      setError(err.response?.data?.detail || 'Произошла ошибка при регистрации. Попробуйте снова.'); 
    } 
  }; 
 
  const togglePasswordVisibility = () => { 
    setShowPassword(!showPassword); 
  }; 
 
  return ( 
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900"> 
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg"> 
        <form onSubmit={handleSignUp}> 
          <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800 dark:text-white">Регистрация</h1> 
           
          {message && <div className="bg-green-500 text-white p-3 rounded mb-4">{message}</div>} 
          {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>} 
 
          <input 
            type="text" 
            placeholder="Имя пользователя" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white mb-4" 
            required 
          /> 
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white mb-4" 
            required 
          /> 
          <div className="mb-6 relative"> 
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Пароль" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" 
              required 
            /> 
            <button 
              type="button" 
              onClick={togglePasswordVisibility} 
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-400" 
            > 
              {showPassword ? 'Скрыть' : 'Показать'} 
            </button> 
          </div> 
          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-200 mb-4" 
          > 
            Зарегистрироваться 
          </button> 
        </form> 
 
        <div className="text-center mt-4"> 
          <p className="text-sm text-gray-600 dark:text-gray-400"> 
            Уже есть аккаунт?{' '} 
            <button 
              onClick={() => navigate('/login')} 
              className="text-indigo-600 hover:underline" 
            > 
              Войти 
            </button> 
          </p> 
        </div> 
      </div> 
    </div> 
  ); 
}; 
 
export default RegisterPage;