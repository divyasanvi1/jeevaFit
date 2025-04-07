const User=require("../models/user")
const { hashPassword, comparePassword, generateToken}=require("../service/auth")

async function handleUserSignUp(req,res){
    try{
        const {name,email,password}=req.body;
        console.log("Received signup request for:", email);
        if(!name || !email || !password)
        {
            return res.status(400).json({ msg: "All fields are required" });
        }
        const existingUser=await User.findOne({email});
        console.log("Existing user:", existingUser);
        if (existingUser) return res.status(400).json({ msg: "Email already in use" });

        const hashedPassword = await hashPassword(password);
        const newUser=await User.create({
            name,
            email,
            password:hashedPassword,
        })
        res.status(201).json({ msg: "User created successfully", user: { name: newUser.name, email: newUser.email } });
    }
    catch{
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

async function handleUserLogin(req,res){
    try{
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ msg: "Email and Password are required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
         
        const token = generateToken(user);
        res.cookie("auth_token",token,{
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        res.json({ msg: "Login successful", user: { name: user.name, email: user.email } });
    }
    catch{
        res.status(500).json({ msg: "Internal Server Error" });
    } 
}
async function handleUserLogout(req, res) {
    res.clearCookie("auth_token");
    res.json({ msg: "Logged out successfully" });
}

module.exports={
    handleUserSignUp,
    handleUserLogin,
    handleUserLogout,
}