import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/JeevaFit_logo.svg";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { i18n,t } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en";
    if (i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, []);
  
  const handleChangeLanguage = (e) => {
    const selectedLang = e.target.value;
    i18n.changeLanguage(selectedLang);
    localStorage.setItem("language", selectedLang); // ← key i18next looks for
  };

  useEffect(() => {
    const token = localStorage.getItem("token"); // or whatever you save after login
    setIsLoggedIn(!!token); // set to true if token exists
  }, []);
  const handleLogout = async () => {
    try {
      // Call backend to clear the cookie
      await fetch("http://localhost:8001/userRoute/logout", {
        method: "POST",
        credentials: "include", // include cookies
      });

      // Clear token from localStorage
      localStorage.removeItem("token");

      // Update UI state
      setIsLoggedIn(false);

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleSideBar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-[16px] font-semibold font-sans transition duration-300 ease-in-out ${
      isActive ? "text-[#FF6D00]" : "text-white hover:text-[#FF6D00]"
    }`;

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50">
        <nav className="flex items-center justify-between bg-[#03045E] backdrop-blur-[8px] px-4 lg:px-6 py-3 lg:py-4">
          <div className="w-full flex flex-wrap justify-between items-center max-w-screen-2xl mx-auto px-2">
            {/* Mobile menu icon */}
            <div className="block lg:hidden" onClick={toggleSideBar}>
              {/* ...SVG icon remains same... */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="24"
                viewBox="0 0 256 256"
                className="cursor-pointer"
              >
                <g fill="#fffffa">
                  <path
                    d="M0,7.5v5h50v-5zM0,22.5v5h50v-5zM0,37.5v5h50v-5z"
                    transform="scale(5.12,5.12)"
                  />
                </g>
              </svg>
            </div>

            {/* Logo & Brand */}
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="JeevaFit Logo"
                className="w-[32px] md:w-[40px] h-[48px] object-fill"
              />
              <div className="ml-2 sm:ml-4">
                <h1 className="text-2xl font-bold font-serif text-[#FF6D00]">
                  JeevaFit
                </h1>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center space-x-4">
              <ul className="flex space-x-6">
                {!isLoggedIn && (
                  <li>
                    <NavLink
                      to="/"
                      onClick={closeSidebar}
                      className={navLinkClass}
                    >
                     {t("header.home")}
                    </NavLink>
                  </li>
                )}
                {isLoggedIn && (
                  <>
                    <li>
                      <NavLink to="/dashboard" className={navLinkClass}>
                      {t("header.health_dashboard")}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/nearest-hospitals" className={navLinkClass}>
                      {t("header.nearest_hospitals")}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/weather" className={navLinkClass}>
                      {t("header.weather")}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/health-learning" className={navLinkClass}>
                      {t("header.health_learning")}
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Notification & CTA */}
            <div className="flex items-center lg:space-x-6">
              <>
              <select
    value={i18n.language}
    onChange={handleChangeLanguage}
    className="bg-[#03045E] text-white border border-white px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6D00]"
  >
    <option value="en">English</option>
    <option value="hi">हिन्दी</option>
  </select>
              {isLoggedIn ? (
                <>
                  {/* Notification Icon */}
                  <Link to="/notifications">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      className="cursor-pointer p-1 w-8 sm:h-8 lg:w-9 lg:h-9 rounded-full hover:bg-white hover:fill-[#FF6D00] transition duration-300 ease-in-out"
                      fill="#fffffa"
                    >
                      <path d="M10.5 2v2.2C7.92 4.87 6 7.22 6 10v6l-2 2v1h16v-1l-2-2v-6c0-2.78-1.92-5.13-4.5-5.8V2h-3zM10 20c0 1.1.9 2 2 2s2-.9 2-2h-4z"></path>
                    </svg>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="ml-4 inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition"
                  >
                   {t("header.logout")}
                  </button>
                </>
              ) : (
                <div className="hidden lg:flex items-center justify-center">
                  <NavLink
                    to="/login"
                    className="inline-block bg-[#FF5400] hover:bg-[#FF6D00] text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-opacity-90 transition"
                  >
                    {t("header.get_started")}
                  </NavLink>
                </div>
              )}
              </>
            </div>
          </div>
        </nav>
      </header>

      {/* Sidebar (Mobile Nav) */}
      <div
        className={`fixed top-0 left-0 h-full w-full bg-[#03045E] text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 shadow-lg`}
      >
        <div className="flex flex-col px-6 py-8 space-y-6">
          <button
            onClick={closeSidebar}
            className="text-right text-white text-xl self-end"
          >
            ✕
          </button>
          <ul className="flex-col space-x-6 space-y-2">
          <select
    value={i18n.language}
    onChange={handleChangeLanguage}
    className="bg-[#03045E] text-white border border-white px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6D00]"
  >
    <option value="en">English</option>
    <option value="hi">हिन्दी</option>
  </select>
            {!isLoggedIn && (
              <li>
                <NavLink to="/" onClick={closeSidebar} className={navLinkClass}>
                {t("header.home")}
                </NavLink>
              </li>
            )}
            {isLoggedIn && (
              <>
                <li>
                  <NavLink to="/dashboard" className={navLinkClass}>
                  {t("header.health_dashboard")}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/nearest-hospitals" className={navLinkClass}>
                  {t("header.nearest_hospitals")}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/weather" className={navLinkClass}>
                  {t("header.weather")}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/health-learning" className={navLinkClass}>
                  {t("header.health_learning")}
                  </NavLink>
                </li>
              </>
            )}
            {isLoggedIn && (
              <>
                <li>
                  <NavLink to="/notifications" className={navLinkClass}>
                  {t("header.notifications")}
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-[16px] font-semibold font-sans text-white hover:text-[#FF6D00] transition duration-300 ease-in-out"
                  >
                   {t("header.logout")}
                  </button>
                </li>
              </>
            )}
            {!isLoggedIn && (
              <li>
                <NavLink
                  to="/login"
                  onClick={closeSidebar}
                  className={navLinkClass}
                >
                  <span className="inline-block mt-2 bg-[#FF6D00] text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-opacity-90 transition">
                  {t("header.get_started")}
                  </span>
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-40 z-40"
          onClick={closeSidebar}
        ></div>
      )}
    </>
  );
};

export default Header;
