import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/AppointmentModel.js'
import mongoose from 'mongoose'
import razorpay from 'razorpay'
import crypto from 'crypto'

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Register API
const registerUser = async (req, res) => {
    try {
        const { name, email, password, imageUrl, address, gender, dob, phone } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Enter a valid email' })
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Enter a strong password' })
        }

        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already registered' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            address,
            gender,
            dob,
            phone
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.status(201).json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Login API
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: 'User does not exist' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.status(200).json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Get Profile API


const getProfile = async (req, res) => {
    try {
        console.log("Get Profile - req.user:", req.user);

        // Extract userId correctly from req.user
        const userId = req.user.userId || req.user.id

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID not found in request',
            });
        }

        // Fetch user by ID
        const user = await userModel.findById(userId).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            userData: user,
        });
    } catch (error) {
        console.error('Get Profile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching profile',
        });
    }
};


// Update Profile API
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId
        const { name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.status(400).json({ success: false, message: "Data is Missing" })
        }

        const updatedData = {
            name,
            phone,
            address: JSON.parse(address),
            dob,
            gender,
        }

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image",
            })
            updatedData.image = imageUpload.secure_url
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, { new: true })

        res.status(200).json({
            success: true,
            message: "Profile Updated",
            user: updatedUser,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Book Appointment API
const bookAppointment = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { docId, slotDate, slotTime } = req.body;

        console.log("Incoming docId:", docId);

        // Validate doctor ID
        if (!mongoose.Types.ObjectId.isValid(docId)) {
            return res.status(400).json({ success: false, message: 'Invalid doctor ID' });
        }

        // Fetch doctor data
        const docData = await doctorModel.findById(docId).select('-password');
        if (!docData) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // Check if doctor is available
        if (!docData.available) {
            return res.status(400).json({ success: false, message: 'Doctor not available' });
        }

        // Check if slot already booked in appointmentModel
        const existingAppointment = await appointmentModel.findOne({
            docId,
            slotDate,
            slotTime,
            cancelled: false,
        });
        if (existingAppointment) {
            return res.status(400).json({ success: false, message: 'Slot not available' });
        }

        // Check and update doctor's booked slots
        let slot_booked = docData.slot_booked || {};
        if (typeof slot_booked !== 'object' || slot_booked === null) slot_booked = {};

        if (slot_booked[slotDate]?.includes(slotTime)) {
            return res.status(400).json({ success: false, message: 'Slot already booked' });
        }

        if (!slot_booked[slotDate]) {
            slot_booked[slotDate] = [];
        }
        slot_booked[slotDate].push(slotTime);

        // Fetch user data
        const userData = await userModel.findById(userId).select('-password');
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prepare appointment data
        const userDataObj = userData.toObject();
        const docDataObj = docData.toObject();

        delete userDataObj.password;
        delete docDataObj.password;
        delete docDataObj.slot_booked;

        const appointmentData = {
            userId,
            docId,
            userData: JSON.stringify(userDataObj),
            docData: JSON.stringify(docDataObj),
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
            cancelled: false,
            payment: false,
            isCompleted: false,
        };

        // Save appointment
        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // Update doctor's booked slots
        await doctorModel.findByIdAndUpdate(docId, { slot_booked });

        return res.status(201).json({ success: true, message: 'Appointment is Booked' });
    } catch (error) {
        console.error('Error booking appointment:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// List User Appointments API
const listAppointment = async (req, res) => {
    try {
        const userId = req.user.userId;
        const appointments = await appointmentModel.find({ userId });
        res.status(200).json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
//  API to cancel appointment

const cancelAppointment = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (appointmentData.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized action" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);

        if (doctorData) {
            let slot_booked = doctorData.slot_booked || {};
            if (slot_booked[slotDate]) {
                slot_booked[slotDate] = slot_booked[slotDate].filter(e => e !== slotTime);
            }

            await doctorModel.findByIdAndUpdate(docId, { slot_booked });
        }

        res.json({ success: true, message: "Appointment Cancelled" });

    } catch (error) {
        console.error("Error cancelling appointment:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})
// API to make payment of appointment using razorpay

const paymentRazorpay = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment Cancelled or not found" })
        }
        // creating options for razorpay payment

        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order

        const order = await razorpayInstance.orders.create(options)
        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Missing payment details" });
        }

        // Create HMAC to verify signature
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`)
        const generatedSignature = hmac.digest('hex')

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" })
        }

        // Payment verified — now update the appointment
        const appointment = await appointmentModel.findOneAndUpdate(
            { _id: appointmentId },// find appointment by its unique _id
            {
                payment: true,
                status: "paid",
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            },
            { new: true }
        )

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        res.status(200).json({ success: true, message: "Payment verified successfully", appointment })

    } catch (error) {
        console.error("Payment verification error:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay }
