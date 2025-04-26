// src/pages/SignUpPage.js

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/authSlice';
import axios from 'axios';

const SignUpPage = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('Male');
  const [height, setHeight] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await axios.post('http://localhost:8001/userRoute/signup', {
        name,
        email,
        password,
        age,
        weight,
        gender,
        height,
      });

      const { token, user } = response.data;
      dispatch(loginSuccess({ token, user }));
      setError('');
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.msg || 'Oops! We could not complete your sign-up. Please try again in a moment.'));
      setError('Error during signup');
    }
  };

  return (
    <>
    <div className='max-w-screen-lg mx-auto h-screen flex flex-wrap items-center justify-center'>
      <div className='w-full m-4 sm:mx-32 flex flex-wrap flex-col sm:flex-row bg-[#FFEEDD]/25 rounded-lg shadow-sm shadow-[#FFEEDD] backdrop-blur-[4px] border border-[#FF5400]/20'>
        <div className='w-full sm:w-2/5 flex flex-col bg-[#03045E]  justify-center rounded-lg p-8'>
        <h1 className='text-[24px] sm:text-[28px] md:text-[32px] font-sans-serif text-white font-bold -tracking-tight leading-[135%] mb-4'>
        Welcome to JeevaFit!
        </h1>
        <p className='text-[16px] font-sans-serif text-[#F5F5F5] -tracking-tight leading-[135%]'>
         we are exicted to have you here. If you haven't already, create your account to start your journey towards better health and well-being.
        </p>
        <button className='bg-white/20 backdrop-blur-[16px]  mt-12 py-2 rounded-full cursor-pointer hover:bg-white/15 transition duration-300 ease-in-out'>
        <a href="/login" className='text-[16px] font-serif font-medium text-white hover:text-gray-00'>Already have acoount</a>
        </button>
        </div>
        <div className='w-full sm:w-3/5 flex flex-col mx-auto sm:p-4 sm:px-8  p-4 items-center justify-center my-6'>
        <h1 className='text-[24px] sm:text-[28px] font-sans-serif text-[#03045E] font-bold  leading-[135%'>
        Register yourself
        </h1>
        <p className='text-[16px] font-semibold font-sans-serif text-[#FF6D00] tracking-tight leading-[135%]'>
         Create your free account
        </p>
        <div className='w-full flex flex-wrap items-center justify-center text-center mt-2'>
        {error && <p className='text-red-500 text-[14px] font-semibold tracking-tight leading-[135%]'>{error}</p>}
        </div>
        <form 
      className='w-full flex flex-col mx-auto mt-8 text-gray-700 font-semibold font-sans-serif'
      onSubmit={handleSignUp}>
            <input 
        className='bg-[#FF5400]/5 focus:bg:white rounded-md p-2 m-2'
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input 
        className='bg-[#FF5400]/5 focus:bg:white rounded-md p-2 m-2'
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input 
        className='bg-[#FF5400]/5 focus:bg:white rounded-md p-2 m-2'
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Phone Number"
          required
        />
        <input 
        className='bg-[#FF5400]/5 focus:bg:white rounded-md p-2 m-2'
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input 
        className='bg-[#FF5400]/5 focus:bg:white rounded-md p-2 m-2'
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        {/* <input 
        className='border-2  rounded-md p-2 m-2'
          type="number" 
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          required
        />
        <input 
        className='border-2  rounded-md p-2 m-2'
          type="number" 
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight"
          required
        />
        <select 
        className='border-2  rounded-md p-2 m-2'
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input 
        className='border-2  rounded-md p-2 m-2'
          type="number" 
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Height"
          required
        /> */}
        <div className='w-full flex flex-row items-center justify-between mt-4'>
        <p className='text-[12px] font-semibold font-sans-serif text-[#03045E]/50 tracking-tight leading-[135%]'>
        By proceeding, I <span className='font-bold text-[#03045E]/70 underline'>acknowledge</span> that I have read and agree to JeevaFit’s <span className='font-bold text-[#03045E]/70 underline'>Privacy Policy</span> and <span className='font-bold text-[#03045E]/70 underline'>Terms of Use</span>. 
        </p>
        </div>
        <button 
        className='bg-[#FF5400] hover:bg-[#FF6D00] font-semibold text-[20px]  text-white hover:text-gray-300 rounded-full px-8 py-2 m-2 mt-6'
        type="submit">Sign Up</button>
      </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default SignUpPage;
