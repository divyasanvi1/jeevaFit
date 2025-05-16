// src/App.js
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingOverlay from "./components/LoadingOverlay";
import AxiosInterceptor from "./utils/AxiosInterceptor";

function App() {
  return (
    <>
      <Header />
      <AxiosInterceptor />
      <LoadingOverlay />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;