// src/pages/SignUpPage.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import i18n from "../locales/i18n";
import { useLoading } from "../context/LoadingContext";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("Male");
  const [height, setHeight] = useState("");
  const [emergencyContactEmail, setEmergencyContactEmail] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };
  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };
  const validateHeight = (height) => {
    const heightValue = parseFloat(height);
    return heightValue >= 0.5 && heightValue <= 2.7; // Height in meters, between 0.5 meters and 2.7 meters
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };
  const validateAge = (age) => {
    return age >= 12 && age <= 120;
  };

  // Inside  SignUpPage component
  const { loading, setLoading } = useLoading();
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !password ||
      !age ||
      !weight ||
      !height ||
      !emergencyContactEmail ||
      !emergencyContactPhone ||
      !bloodGroup
    ) {
      setError("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePhone(emergencyContactPhone)) {
      setError("Please enter a valid emergency contact phone number.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and include a mix of letters and numbers."
      );
      return;
    }

    if (!validateAge(age)) {
      setError("Please enter a valid age (15-120).");
      return;
    }
    if (!height || !validateHeight(height)) {
      setError("Height should be between 0.5 meters and 2.7 meters.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("/userRoute/signup", {
        name,
        email,
        password,
        age,
        weight,
        gender,
        height,
        emergencyContactEmail,
        emergencyContactPhone,
        bloodGroup,
      });
      console.log("response", response);
      const data = response.data.msg;

      if (response.status === 201) {
        const userEmail = response.data.user.email;
        localStorage.setItem("signupEmail", userEmail);
        // ✅ Show success alert
        alert(
          "Signup successful! Please check your email to verify your account."
        );

        // ✅ Redirect to login or OTP verification page
        navigate("/resendverification", { state: { email: userEmail } });
      } else {
        setError(response.data.msg || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("Error during signup", err);
    } finally {
      setLoading(false); // ⬅️ Hide loading spinner
    }
  };

  return (
    <>
      <div className="max-w-screen-lg mx-auto h-screen flex flex-wrap items-center justify-center">
        <div className="absolute top-4 right-4">
          <select
            className="bg-white text-[#03045E] font-semibold rounded px-2 py-1 shadow-sm"
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            value={i18n.language}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>

        <div className="w-full m-4 sm:mx-32 flex flex-wrap flex-col sm:flex-row bg-[#FFEEDD]/25 rounded-lg shadow-sm shadow-[#FFEEDD] backdrop-blur-[4px] border border-[#FF5400]/20">
          <div className="w-full sm:w-2/5 flex flex-col bg-[#03045E]  justify-center rounded-lg p-8">
            <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-sans-serif text-white font-bold -tracking-tight leading-[135%] mb-4">
              {t("signup.welcomeTitle")}
            </h1>
            <p className="text-[16px] font-sans-serif text-[#F5F5F5] -tracking-tight leading-[135%]">
              {t("signup.welcomeSubtitle")}
            </p>
            <button className="bg-white/20 backdrop-blur-[16px]  mt-12 py-2 rounded-full cursor-pointer hover:bg-white/15 transition duration-300 ease-in-out">
              <Link
                to="/login"
                className="text-[16px] font-serif font-medium text-white hover:text-gray-200"
              >
                {t("signup.alreadyHaveAccount")}
              </Link>
            </button>
          </div>
          <div className="w-full sm:w-3/5 flex flex-col mx-auto sm:p-4 sm:px-8  p-4 items-center justify-center my-6">
            <h1 className="text-[24px] sm:text-[28px] font-sans-serif text-[#03045E] font-bold  leading-[135%">
              {t("signup.registerTitle")}
            </h1>
            <p className="text-[16px] font-semibold font-sans-serif text-[#FF6D00] tracking-tight leading-[135%]">
              {t("signup.registerSubtitle")}
            </p>
            <div className="w-full flex flex-wrap items-center justify-center text-center mt-2">
              {error && (
                <p className="text-red-500 text-[14px] font-semibold tracking-tight leading-[135%]">
                  {error}
                </p>
              )}
            </div>
            <form
              className="w-full flex flex-col mx-auto mt-8 text-gray-700 font-semibold font-sans-serif"
              onSubmit={handleSignUp}
            >
              <input
                className="bg-[#FF5400]/5 focus:bg:white rounded-md p-2 m-2"
                type="text"
                value={name}
                disabled={loading}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("signup.name")}
                required
              />

              <input
                className="bg-[#FF5400]/5 focus:bg:white rounded-md p-2 m-2"
                type="email"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("signup.email")}
                required
              />

              <input
                className="bg-[#FF5400]/5 focus:bg:white rounded-md p-2 m-2"
                type="tel"
                value={emergencyContactPhone}
                disabled={loading}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                placeholder={t("signup.phoneNumber")}
                required
              />

              <input
                className="bg-[#FF5400]/5 focus:bg:white rounded-md p-2 m-2"
                type="password"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("signup.password")}
                required
              />

              <input
                className="bg-[#FF5400]/5 focus:bg:white rounded-md p-2 m-2"
                type="number"
                value={age}
                disabled={loading}
                onChange={(e) => setAge(e.target.value)}
                placeholder={t("signup.age")}
                required
              />

              <input
                className="bg-[#FF5400]/5 focus:bg:white rounded-md p-2 m-2"
                type="number"
                value={weight}
                disabled={loading}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={t("signup.weight")}
                required
              />

              <input
                className="bg-[#FF5400]/5 focus:bg:white rounded-md p-2 m-2"
                type="number"
                value={height}
                disabled={loading}
                onChange={(e) => setHeight(e.target.value)}
                placeholder={t("signup.height")}
                required
              />

              <select
              disabled={loading}
                className="bg-[#FF5400]/5 focus:bg:white rounded-md p-2 m-2"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">{t("signup.male")}</option>
                <option value="Female">{t("signup.female")}</option>
              </select>

              <input
                className="bg-[#FF5400]/5 focus:bg:white rounded-md p-2 m-2"
                type="email"
                value={emergencyContactEmail}
                disabled={loading}
                onChange={(e) => setEmergencyContactEmail(e.target.value)}
                placeholder={t("signup.emergencyEmail")}
                required
              />

              <select
                disabled={loading}
                className="bg-[#FF5400]/5 focus:bg:white rounded-md p-2 m-2"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                required
              >
                <option value="" disabled>
                  {t("signup.bloodGroup")}
                </option>{" "}
                {/* Placeholder */}
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A1+">A1+</option>
                <option value="A1-">A1-</option>
                <option value="A2+">A2+</option>
                <option value="A2-">A2-</option>
                <option value="Bombay Blood Group">Bombay Blood Group</option>
              </select>

              <div className="w-full flex flex-row items-center justify-between mt-4">
                <p className="text-[12px] font-semibold font-sans-serif text-[#03045E]/50 tracking-tight leading-[135%]">
                  {t("signup.acknowledgement.text")}{" "}
                  <span className="font-bold text-[#03045E]/70 underline">
                    {t("signup.acknowledgement.acknowledge")}
                  </span>{" "}
                  {t("signup.acknowledgement.continue")}{" "}
                  <span className="font-bold text-[#03045E]/70 underline">
                    {t("signup.acknowledgement.privacy")}
                  </span>{" "}
                  {t("signup.acknowledgement.and")}{" "}
                  <span className="font-bold text-[#03045E]/70 underline">
                    {t("signup.acknowledgement.terms")}
                  </span>
                  .
                </p>
              </div>

              <button
    className="bg-[#FF5400] hover:bg-[#FF6D00] font-semibold text-[20px] text-white hover:text-gray-300 rounded-full px-8 py-2 m-2 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
    type="submit"
    disabled={loading}
    aria-busy={loading}
  >
    {loading ? t("signup.submitting") || "Submitting..." : t("signup.submit")}
  </button>
  {loading && (
    <div className="flex items-center justify-center mt-4 space-x-2">
      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-blue-600">
        {t("signup.loadingMessage") || "Creating your account..."}
      </span>
    </div>
  )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
