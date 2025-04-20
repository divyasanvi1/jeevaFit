// src/pages/LoginPage.js

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/authSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";


const LoginPage = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      setError('Oops! Those credentials don’t match our records. Double-check and try again.');
    }
  };

  return (
    <>
    <div className='max-w-screen-lg mx-auto h-screen flex flex-wrap items-center justify-center'>
      <div className='w-full m-4 sm:mx-32 flex flex-wrap flex-col sm:flex-row bg-[#F8F7FF] rounded-lg '>
        <div className='w-full sm:w-3/5 flex flex-col mx-auto sm:p-4 sm:px-8 pt-8 p-4 items-center justify-center my-6'>
        <h1 className='text-[24px] sm:text-[28px] font-sans-serif text-[#1e1e1e] font-bold  leading-[135%'>
        Login to JeevaFit
        </h1>
        <p className='text-[16px] font-semibold font-sans-serif text-[#023E8A] tracking-tight leading-[135%]'>
         Login with your email and password
        </p>
        <div className='w-full flex flex-wrap items-center justify-center text-center mt-2'>
        {error && <p className='text-red-500 text-[14px] font-semibold tracking-tight leading-[135%]'>{error}</p>}
        </div>
      <form 
      className='w-full flex flex-col mx-auto mt-8'
      onSubmit={handleLogin}>
        <input 
        className='bg-[#03045E]/5 focus:bg:white rounded-md p-2 m-2'
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input 
        className='bg-[#03045E]/5 focus:bg:white rounded-md p-2 m-2'
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button
        className='bg-[#03045E] hover:bg-[#023E8A] font-semibold text-[20px]  text-white hover:text-gray-300 rounded-full px-8 py-2 m-2 mt-6'
         type="submit">Login</button>
      </form>
      <div className='w-full flex flex-row items-center justify-center mt-8'>
        <div className='items-center justify-center text-center inline-block h-[2px] w-[120px] bg-[#03045E] rounded-lg mr-2'></div>
        <p className='text-[18px] font-bold font-sans-serif text-[#FF5400] tracking-tight leading-[135%]'>or</p>
        <div className='items-center justify-center text-center inline-block h-[2px] w-[120px] bg-[#03045E] rounded-lg ml-2'></div>
      </div>
      <div className='w-full flex flex-row flex-wrap items-center justify-center mt-4'>
        <button className='bg-white hover:bg-gray-100 font-semibold text-[20px] rounded-full p-4 mr-2'>
        <a href="" className='flex flex-row items-center justify-center'><FcGoogle /></a>
        </button>
        <button className='bg-white hover:bg-gray-100 font-semibold text-[20px] rounded-full p-4 ml-2'>
        <a href="" className='flex flex-row items-center justify-center'><FaApple className='text-black'/></a>
        </button>
      </div>
      <div className='w-full flex flex-wrap items-center justify-between mt-12 mx-2'>
        <p className='text-[12px] font-semibold font-sans-serif text-[#FF6D00]/50 tracking-tight leading-[135%]'>
        By <span className='font-bold text-[#FF6D00]/70 underline'>continuing</span>, I agree to HeathMate’s <span className='font-bold text-[#FF6D00]/70 underline'>Privacy Policy</span> and <span className='font-bold text-[#FF6D00]/70 underline'>Terms of Use</span>. 
        </p>
        </div>
        </div>
        <div className='w-full sm:w-2/5 flex flex-col bg-[#FF5400]  justify-center rounded-lg p-8'>
        <h1 className='text-[24px] sm:text-[28px] md:text-[32px] font-sans-serif text-white font-bold -tracking-tight leading-[135%] mb-4'>
        Welcome Back!
        </h1>
        <p className='text-[16px] font-medium font-sans-serif text-[#e5e5e5] -tracking-tight leading-[135%]'>
        Log in to continue your journey toward a healthier, more balanced life by managing your health effortlessly. 
        </p>
        <button className='bg-white/20 backdrop-blur-[16px]  mt-12 py-2 rounded-full cursor-pointer hover:bg-white/10 transition duration-300 ease-in-out'>
        <a href="/signup" className='text-[16px] font-serif font-medium text-white hover:text-gray-00'>New to JeevaFit</a>
        </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
