import bcrypt from 'bcrypt';
import cloudinary from '../config/cloudinary.js';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/AppointmentModel.js';
import userModel from '../models/userModel.js';
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !imageFile) {
            res.status(400).json({ error: "All fields are required include Image" })
        }

        // Regex Validations
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
        const numberRegex = /^\d+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters long and include letters, numbers, and a special character.'
            });
        }

        if (!numberRegex.test(experience)) {
            return res.status(400).json({ error: 'Experience must be a number.' });
        }

        if (!numberRegex.test(fees)) {
            return res.status(400).json({ error: 'Fees must be a number.' });
        }

        try {
            JSON.parse(address);
        } catch (err) {
            return res.status(400).json({ error: 'Invalid address format. Must be a valid JSON string.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        //  Cloudinary Upload with error handling
        const uploadImage = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: 'image'
        });

        const imageUrl = uploadImage.secure_url;

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            image: imageUrl,
            available: true,
            date: Date.now(),
            slot_booked: {}
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.status(201).json({ message: 'Doctor added successfully', doctor: newDoctor });
    } catch (error) {
        console.error('Error adding doctor:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
// API For Admin Login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.status(200).json({
                success: true,
                token,
                message: 'Login successful'
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid Credentials'
            });
        }
    } catch (error) {
        console.error('Error in admin login:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Internal server error' })
    }
}

//API to get all appointment list
const appointmentAdmin = async (req, res) => {

    try {
        const appointments = await appointmentModel
            .find({})
            //   .populate('user', 'name email') // Populate patient details
            //   .populate('doctor', 'name speciality fees') // Populate doctor details
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, appointments, })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
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

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})
        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }
        res.json({ success: true, dashData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addDoctor, loginAdmin, allDoctors, appointmentAdmin, appointmentCancel,adminDashboard };
