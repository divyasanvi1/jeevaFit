const User=require("../models/userModel")
const { hashPassword, comparePassword, generateToken}=require("../service/auth")
const { sendVerificationEmail } = require('../service/emailVerification');
const crypto = require('crypto');

async function handleUserSignUp(req, res) {
  try {
      const { name, email, password, age, weight, gender, height, phoneNumber, emergencyContactEmail, emergencyContactPhone, bloodGroup } = req.body;
      
      console.log("Received signup request for:", req.body);
      
      // Validate all required fields
      if (!name || !email || !password || !age || !weight || !gender || !height  || !emergencyContactEmail || !emergencyContactPhone || !bloodGroup) {
          console.log("Missing fields:", { name, email, password, age, weight, gender, height,  emergencyContactEmail, emergencyContactPhone, bloodGroup });
          return res.status(400).json({ msg: "All fields are required" });
      }

      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      console.log("Existing user:", existingUser);
      if (existingUser) return res.status(400).json({ msg: "Email already in use" });

      // Hash the password before saving
      const hashedPassword = await hashPassword(password);
      console.log("Password hashed:", hashedPassword);

      // Create the new user with all required fields
      const newUser = await User.create({
          name,
          email,
          password: hashedPassword,
          age,
          weight,
          gender,
          height,
          emergencyContactEmail,
          emergencyContactPhone,
          bloodGroup,
          isVerified: false, 
      });
      // Generate a unique verification token using crypto
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationLink = `http://localhost:8001/api/verify/${verificationToken}`;

      // Set token expiry to 1 hour (or your desired time)
      const tokenExpiry = Date.now() + 60 * 60 * 1000;  // 1 hour from now

      // Save the verification token in the user document
      newUser.verificationToken = verificationToken;
      newUser.tokenExpiry = tokenExpiry;
      await newUser.save();

      // Send verification email
      await sendVerificationEmail(email, verificationLink);
      console.log("New user:", newUser);
      res.status(201).json({ msg: "User created successfully.email sent to user.", user: { name: newUser.name, email: newUser.email } });

  } catch (err) {
      console.error("Error during signup:", err);
      res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
}
async function verifyEmail(req, res) {
  try {
    const { verificationToken } = req.params; // Retrieve the token from URL parameters

    // Find the user with the matching token
    const user = await User.findOne({ verificationToken });
    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired verification token" });
    }

    // Check if the token has expired
    if (user.tokenExpiry && user.tokenExpiry < Date.now()) {
      return res.status(400).json({ msg: "Verification token has expired" });
    }

    // Update the user as verified
    user.isVerified = true;
    user.verificationToken = null;  // Optionally clear the verification token
    user.tokenExpiry = null;
    await user.save();

    res.status(200).json({ msg: "Email verified successfully" });
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
async function resendVerificationEmail(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ msg: "User is already verified" });
    }
    
    // Generate a new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    const verificationLink = `http://localhost:5000/api/user/verify/${verificationToken}`;

    // Update the user with new token and expiry
    user.verificationToken = verificationToken;
    user.tokenExpiry = tokenExpiry;
    await user.save();

    // Send verification email
    await sendVerificationEmail(email, verificationLink);

    res.status(200).json({ msg: "Verification email resent successfully" });
  } catch (error) {
    console.error("Error in resending verification email:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function handleUserLogin(req,res){
    try{
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ msg: "Email and Password are required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });
        
        if (!user.isVerified)return res.status(401).json({ msg: "Please verify your email before logging in" });
          
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
         
        const token = generateToken(user);
        res.cookie("auth_token",token,{
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        res.json({ msg: "Login successful",token, user: {
          _id: user._id, 
           name: user.name,
            email: user.email,
            age: user.age,
            weight: user.weight,
            gender: user.gender,
            height: user.height, } });
    }
    catch{
        res.status(500).json({ msg: "Internal Server Error" });
    } 
}
async function handleUserLogout(req, res) {
    res.clearCookie("auth_token");
    res.json({ msg: "Logged out successfully" });
}
async function handleUpdateUserData(req, res) {
    try {
      const { email, age, weight, gender, height } = req.body;
  
      if (!email) return res.status(400).json({ msg: "Email is required" });
      if (!age && !weight && !gender && !height) {
        return res.status(400).json({ msg: "At least one field must be provided to update" });
      }
  
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { age, weight, gender, height },
        { new: true }
      );
  
      if (!updatedUser) return res.status(404).json({ msg: "User not found" });
  
      res.status(200).json({
        msg: "User data updated successfully",
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
          age: updatedUser.age,
          weight: updatedUser.weight,
          gender: updatedUser.gender,
          height: updatedUser.height,
          id: updatedUser._id,
        }
      });
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ msg: "Internal Server Error", error: err.message });
    }
  }
  
async function handleUserDetails(req, res){
    // 👆 New route for fetching user profile
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ msg: "Email is required" });
  
      const user = await User.findOne({ email }).select("-password");
      if (!user) return res.status(404).json({ msg: "User not found" });
  
      res.status(200).json({ user });
    } catch (err) {
      console.error("Error in /user/details route:", err);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  }
  const getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error.message);
      res.status(500).json({ msg: "Server error" });
    }
  };
module.exports={
    handleUserSignUp,
    verifyEmail,
    resendVerificationEmail,
    handleUserLogin,
    handleUserLogout,
    handleUpdateUserData,
    handleUserDetails,
    getUserById,
}