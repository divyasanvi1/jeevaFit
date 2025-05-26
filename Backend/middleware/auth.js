const {verifyToken}=require("../service/auth")

async function restrictToLoggedInUserOnly(req,res,next) {
    console.log(`[App Middleware] ${req.method} ${req.url} Cookies:`, req.cookies);
    try {
        let token = req.cookies.auth_token;
        //console.log("req:", req);
        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
          }
        console.log("Incoming token:", token);
       console.log("Incoming Cookies:", req.cookies);
        //console.log("Incoming Headers:", req.headers);
        if (!token) return res.status(401).json({ msg: "Unauthorized, please log in" });

        const decoded = verifyToken(token);
        req.user = decoded;
        console.log("Decoded JWT:", decoded);
        next();
    } catch (error) {
        res.status(401).json({ msg: "Invalid or expired token, please log in again" });
    }
}

module.exports={
    restrictToLoggedInUserOnly
};