// src/pages/LoginPage.js

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/authSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await axios.post('http://localhost:8001/userRoute/login', {
        email,
        password,
      }, {
        withCredentials: true, // Ensures cookies are sent/received
      });
     
      const { token, user } = response.data;
      dispatch(loginSuccess({ token, user }));
      console.log("user",user);
      setError('');
      navigate('/home'); 
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.msg || 'Something went wrong.'));
      setError('Invalid credentials');
    }
  };

  return (
    <div>
      <h1>{t('loginPage.title')}</h1>
      <LanguageSwitcher />
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('loginPage.emailPlaceholder')}
          required
        />
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('loginPage.passwordPlaceholder')}
          required
        />
        <button type="submit">{t('loginPage.loginButton')}</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginPage;
