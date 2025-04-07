const {verifyToken}=require("../service/auth")

async function restrictToLoggedInUserOnly(req,res,next) {
    try {
        const token = req.cookies.auth_token;
        //console.log("req:", req);
       // console.log("Incoming token:", token);
       // console.log("Incoming Cookies:", req.cookies);
        //console.log("Incoming Headers:", req.headers);
        if (!token) return res.status(401).json({ msg: "Unauthorized, please log in" });

        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ msg: "Invalid or expired token, please log in again" });
    }
}

module.exports={
    restrictToLoggedInUserOnly
};