// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/authSlice';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';
import { FaApple } from "react-icons/fa";


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
      const response = await axios.post('/userRoute/login', {
        email,
        password,
      }, {
        withCredentials: true, // Ensures cookies are sent/received
      });
     
      const { token, user } = response.data;
      console.log("login data",response.data);
      dispatch(loginSuccess({ token, user }));
      console.log("user",user);
      setError('');
      navigate('/dashboard', { replace: true }); 
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.msg || 'Something went wrong.'));
      setError('Invalid credentials');
    }
  };

  return (
    <div>
      <>
      <div className="max-w-screen-lg mx-auto h-screen flex flex-wrap items-center justify-center">
        <div className="w-full m-4 sm:mx-32 flex flex-wrap flex-col-reverse sm:flex-row bg-[#F8F7FF] rounded-lg 023E8Ashadow-sm shadow-[#F8F7FF] backdrop-blur-[4px] border border-[#023E8A]/20">
          <div className="w-full sm:w-3/5 flex flex-col mx-auto sm:p-4 sm:px-8 p-4 items-center justify-center my-6">
            <h1 className="text-[24px] sm:text-[28px] font-sans-serif text-[#03045E] font-bold  leading-[135%">
            {t('loginPage.title')}
            </h1>
            <p className="text-[16px] font-semibold font-sans-serif text-[#FF6D00] tracking-tight leading-[135%]">
            {t('loginPage.subtitle')}
            </p>
            <div className="w-full flex flex-wrap items-center justify-center text-center mt-2">
              {error && (
                <p className="text-red-500 text-[14px] font-semibold tracking-tight leading-[135%]">
                  {error}
                </p>
              )}
            </div>
            <form
              className="w-full flex flex-col mx-auto mt-8 text-gray-500 font-semibold font-sans-serif"
              onSubmit={handleLogin}
            >
              <input
                className="bg-[#03045E]/5 focus:bg:white rounded-md p-2 m-2"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('loginPage.emailPlaceholder')}
                required
              />
              <input
                className="bg-[#03045E]/5 focus:bg:white rounded-md p-2 m-2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('loginPage.passwordPlaceholder')}
                required
              />
              <div className="text-right mr-2 mb-2">
    <Link
      to="/forgot-password"
      className="text-sm text-blue-600 hover:underline"
    >
      {t('loginPage.forgotPassword')}
    </Link>
  </div>
              <button
                className="bg-[#03045E] hover:bg-[#023E8A] font-semibold text-[20px]  text-white hover:text-gray-300 rounded-full px-8 py-2 m-2 mt-6"
                type="submit"
              >
                {t('loginPage.loginButton')}
              </button>
            </form>
            <div className="w-full flex flex-row items-center justify-center mt-8">
              <div className="items-center justify-center text-center inline-block h-[2px] w-[120px] bg-[#03045E] rounded-lg mr-2"></div>
              <p className="text-[18px] font-bold font-sans-serif text-[#FF5400] tracking-tight leading-[135%]">
              {t('loginPage.or')}
              </p>
              <div className="items-center justify-center text-center inline-block h-[2px] w-[120px] bg-[#03045E] rounded-lg ml-2"></div>
            </div>
            <div className="w-full flex flex-row flex-wrap items-center justify-center mt-4">
              <button className="bg-[#03045E]/10 hover:bg-[#03045E]/15 font-semibold text-[20px] rounded-full p-4 mr-2">
                <a
                  href=""
                  className="flex flex-row items-center justify-center"
                >
                  <FcGoogle />
                </a>
              </button>
              <button className="bg-[#03045E]/10 hover:bg-[#03045E]/15 font-semibold text-[20px] rounded-full p-4 ml-2">
                <a
                  href=""
                  className="flex flex-row items-center justify-center"
                >
                  <FaApple className="text-black" />
                </a>
              </button>
            </div>
            <div className="w-full flex flex-wrap items-center justify-between mt-12 mx-2">
              <p className="text-[12px] font-semibold font-sans-serif text-[#FF6D00]/50 tracking-tight leading-[135%]">
              {t('loginPage.privacyMessage.part1')}{" "}
                <span className="font-bold text-[#FF6D00]/70 underline">
                {t('loginPage.privacyMessage.continue')}
                </span>
                {t('loginPage.privacyMessage.privacy')}{" "}
                <span className="font-bold text-[#FF6D00]/70 underline">
                {t('loginPage.privacyMessage.and')}
                </span>{" "}
                and{" "}
                <span className="font-bold text-[#FF6D00]/70 underline">
                {t('loginPage.privacyMessage.terms')}
                </span>
                .
              </p>
            </div>
          </div>
          <div className=" w-full  sm:w-2/5 flex flex-wrap bg-[#FF5400] items-center justify-center rounded-lg p-8">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-sans-serif text-white font-bold -tracking-tight leading-[135%] mb-4">
              {t('loginPage.welcomeTitle')}
              </h1>
              <p className="text-[16px] font-sans-serif text-[#F5F5F5] -tracking-tight leading-[135%]">
              {t('loginPage.welcomeMessage')}
              </p>
              <button className="w-full bg-white/20 backdrop-blur-[16px]  mt-12 py-2 rounded-full cursor-pointer hover:bg-white/10 transition duration-300 ease-in-out">
              <Link
    to="/signup"
    className="text-[16px] font-serif font-medium text-white hover:text-gray-00"
  >
    {t('loginPage.newToJeevaFit')}
  </Link>
              </button>
              <button className="w-full bg-white/20 backdrop-blur-[16px]  mt-12 py-2 rounded-full cursor-pointer hover:bg-white/10 transition duration-300 ease-in-out">
              <Link
    to="/"
    className="text-[16px] font-serif font-medium text-white hover:text-gray-00"
  >
    {t('loginPage.Home')}
  </Link>
                </button>
            </div>
          </div>
        </div>
      </div>
    </>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginPage;
