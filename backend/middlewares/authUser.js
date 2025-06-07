// middlewares/authUser.js
import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    console.log("=== AUTH MIDDLEWARE DEBUG ===");
    console.log("All headers:", req.headers);
    console.log("Token header:", req.headers.token);
    console.log("Token type:", typeof req.headers.token);
    console.log("Token length:", req.headers.token?.length);
    //  Get token from custom 'token' header
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    console.log("Incoming headers:", req.headers);

    //  Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decodedToken);


    //  Attach user info to request object
    req.user = {
      userId: decodedToken.userId || decodedToken.id,
      email: decodedToken.email
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please login again.'
    });
  }
};

export default authUser;
