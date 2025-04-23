import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/JeevaFit_logo.svg";

const Header = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [isEventDropDownOpen, setIsEventDropDownOpen] = useState(false);
  const [isDiscoverDropDownOpen, setIsDiscoverDropDownOpen] = useState(false);

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  const toggleDiscoverDropDown = () => {
    setIsDiscoverDropDownOpen(!isDiscoverDropDownOpen);
  };
  const toggleEventDropDown = () => {
    setIsEventDropDownOpen(!isEventDropDownOpen);
  };

  return (
    <>
      <header className="sticky top-0 z-50">
        <nav className="flex items-center justify-between bg-[#03045E] backdrop-blur-[8px] px-4 lg:px-6 py-3 lg:py-4">
          <div className="w-full flex flex-wrap justify-between items-center max-w-screen-2xl mx-auto px-2">
          <div className="block lg:hidden" onClick={toggleSideBar}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="20"
                height="24"
                viewBox="0,0,256,256"
                className="cursor-pointer "
              >
                <g
                  fill="#fffffa"
                  fillRule="nonzero"
                  stroke="none"
                  strokeWidth="1"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  strokeMiterlimit="10"
                  fontFamily="none"
                  fontWeight="none"
                  fontSize="none"
                  textAnchor="none"
                >
                  <g transform="scale(5.12,5.12)">
                    <path d="M0,7.5v5h50v-5zM0,22.5v5h50v-5zM0,37.5v5h50v-5z"></path>
                  </g>
                </g>
              </svg>
            </div>
            <div>
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="JeevaFit Logo"
                width={100}
                height={100}
                className="w-[32px] md:w-[40px] h-[48px object-fill"
              />
              <div className="ml-2 sm:ml-4">
                <h1 className="text-2xl font-bold font-serif text-[#FF6D00]">
                  JeevaFit
                </h1>
              </div>
            </Link>
            </div>
            <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                className=" cursor-pointer p-[4px] w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] lg:w-[36px] lg:h-[36px] rounded-full hover:bg-white hover:fill-[#FF6D00] transition duration-300 ease-in-out"
                fill="#fffffa"
                stroke="none"

              >
                <path d="M 10.5 2 L 10.5 4.1992188 C 7.9210135 4.8705935 6 7.2184253 6 10 L 6 16 L 4 18 L 4 19 L 20 19 L 20 18 L 18 16 L 18 10 C 18 7.2184253 16.078986 4.8705935 13.5 4.1992188 L 13.5 2 L 10.5 2 z M 10 20 C 10 21.1 10.9 22 12 22 C 13.1 22 14 21.1 14 20 L 10 20 z"></path>
              </svg>
            </div>
            <div className="hidden lg:flex flex-row items-center justify-center space-x-4">
              <ul className="flex flex-row items-center justify-center space-x-4">
                <li>
                  <NavLink
                    to="/login"
                    className={({isActive}) => `duration-200 ${
                      isActive ? "text-[#FF6D00] text-[16px] font-semibold font-sans-serif hover:text-[#FF6D00] transition duration-300 ease-in-out" : "text-[#fffffa] text-[16px] font-semibold font-sans-serif hover:text-[#FF6D00] transition duration-300 ease-in-out"} hover:text-[#FF6D00] font-sans-serif inline-block after:block after:h-1 after:w-0 after:bg-[#FF6D00] after:transition-all after:duration-300 hover:after:w-full`}
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/login"
                    className="text-[#fffffa] text-[16px] font-semibold font-sans-serif hover:text-[#FF6D00] transition duration-300 ease-in-out"
                  >
                    Login
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
