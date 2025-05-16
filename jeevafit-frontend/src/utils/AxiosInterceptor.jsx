// src/utils/AxiosInterceptor.jsx
import { useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';
import { setupInterceptors } from './axios';

const AxiosInterceptor = () => {
  const { setLoading } = useLoading();

  useEffect(() => {
    setupInterceptors(setLoading);
  }, [setLoading]);

  return null; // This component doesn't render anything
};

export default AxiosInterceptor;
