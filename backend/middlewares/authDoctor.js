// middlewares/authUser.js
import jwt from 'jsonwebtoken';

// doctor Authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        //  Get token from custom 'token' header
        const dtoken = req.headers.dtoken;

        if (!dtoken) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        //  Verify token
        const decodedToken = jwt.verify(dtoken, process.env.JWT_SECRET);
        console.log(decodedToken)

        //  Attach user info to request object
        req.doctor = {
            docId: decodedToken.docId || decodedToken.id,
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

export default authDoctor;
