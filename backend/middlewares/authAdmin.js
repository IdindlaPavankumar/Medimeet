import jwt from 'jsonwebtoken'

//admin authencation middleware
const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers
        if (!atoken) {
            return res.status(500).json({ error: "Not Authorized Login Again " })
        }
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(500).json({ error: "Not Authorized Login Again" })
        }
        next()
    }
    catch (error) {
        console.error('Error adding doctor:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
export default authAdmin