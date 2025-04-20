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
      dispatch(loginFailure(err.response?.data?.msg || 'Something went wrong.'));
      setError('Error during signup');
    }
  };

  return (
    <>
    <div className='max-w-screen-lg mx-auto h-screen flex flex-wrap items-center justify-center'>
      <div className='w-full m-4 sm:mx-32 flex flex-wrap flex-col sm:flex-row bg-gray-100 rounded-lg '>
        <div className='w-full sm:w-2/5 flex flex-col bg-[#FF7700]  justify-center rounded-lg p-8'>
        <h1 className='text-[24px] sm:text-[28px] md:text-[32px] font-sans-serif text-white font-bold -tracking-tight leading-[135%] mb-4'>
        Welcome to JeevaFit!
        </h1>
        <p className='text-[16px] font-medium font-sans-serif text-[#e5e5e5] -tracking-tight leading-[135%]'>
         we are exicted to have you here. If you haven't already, create your account to start your journey towards better health and well-being.
        </p>
        <button className='bg-white/30 backdrop-blur-[16px]  mt-12 py-2 rounded-full cursor-pointer hover:bg-white/20 transition duration-300 ease-in-out'>
        <a href="/login" className='text-[16px] font-serif font-medium text-white hover:text-gray-00'>Already have acoount</a>
        </button>
        </div>
        <div className='w-full sm:w-3/5 flex flex-col mx-auto sm:p-4 sm:px-8 pt-8 p-4 items-center justify-center my-6'>
        <h1 className='text-[24px] sm:text-[28px] font-sans-serif text-[#1e1e1e] font-bold  leading-[135%'>
        Register yourself
        </h1>
        <p className='text-[16px] font-semibold font-sans-serif text-[#FF7700]/80 tracking-tight leading-[135%]'>
         Create your free account
        </p>
        <form 
      className='w-full flex flex-col mx-auto mt-8'
      onSubmit={handleSignUp}>
            <input 
        className='border-2  rounded-md p-2 m-2'
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input 
        className='border-2  rounded-md p-2 m-2'
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input 
        className='border-2  rounded-md p-2 m-2'
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Phone Number"
          required
        />
        <input 
        className='border-2  rounded-md p-2 m-2'
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input 
        className='border-2  rounded-md p-2 m-2'
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
        <button 
        className='bg-[#FF7700] hover:bg-[#FF7700]/60 font-semibold text-[20px]  text-white hover:text-gray-300 rounded-md px-8 py-2 m-2 mt-6'
        type="submit">Sign Up</button>
      </form>
      {error && <p>{error}</p>}
        </div>
      </div>
    </div>
    </>
  );
};

export default SignUpPage;
