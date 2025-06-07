import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/AppointmentModel.js";

const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body
    const docData = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
    res.json({ success: true, message: "Availability Changed" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email'])
    res.json({ success: true, doctors })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
// API for Doctor login

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email, password);

    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      console.log("Doctor not found");
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    console.log("Doctor found:", doctor.email);

    const isMatch = await bcrypt.compare(password, doctor.password);
    console.log("Password match:", isMatch);

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};
// API  to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.doctor.docId
    console.log(docId)
    const appointments = await appointmentModel.find({ docId })
    res.json({ success: true, appointments })


  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
}
// API to mark appointment complete for doctor panel

const appointmentComplete = async (req, res) => {
  try {
    const docId = req.doctor.docId
    const { appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
      return res.json({ success: true, message: "Appointment Completed!" })
    } else {
      return res.json({ success: false, message: "Mark Failed!" })

    }
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
}
// API to cancel the appointment for doctor panel
const appointmentCancel = async (req, res) => {
  try {

    const docId = req.doctor.docId
    const { appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
      return res.json({ success: true, message: "Appointment Cancelled" })
    } else {
      return res.json({ success: false, message: "Cancellation Failed!" })

    }
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
}
// API to get dashboard data for doctor panel

const doctorDashboard = async (req, res) => {
  try {
    const docId = req.doctor.docId

    const appointments = await appointmentModel.find({ docId })
    let earnings = 0;
    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount
      }
    })
    let patients = []
    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId)
      }
    })

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5)
    }
    res.json({ success: true, dashData })
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
}
// API to get Doctor Profile for doctor panel
const doctorProfile = async (req, res) => {
  try {
    const docId = req.doctor.docId
    if (!docId) {
      return res.status(400).json({
        success: false,
        message: 'doctor ID not found in request',
      });
    }
    const profileData = await doctorModel.findById(docId).select('-password')
   
    res.json({ success: true, profileData })
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
}
// API to update doctor profile data from doctor panel
const updatedDoctorProfile = async (req, res) => {
  try {
    const docId = req.doctor.docId
    const { fees, address, available } = req.body

    await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

    res.json({ success: true, message: "Profile Updated" })

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }

}

export { changeAvailablity, doctorList, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, updatedDoctorProfile }