import express from 'express';
import uploadMiddleware from '../middlewares/multer.js';
import { addDoctor, allDoctors, loginAdmin, appointmentAdmin, appointmentCancel, adminDashboard } from '../controllers/adminController.js';
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailablity } from '../controllers/doctorController.js';
const adminRouter = express.Router();
adminRouter.post('/add-doctor', authAdmin, uploadMiddleware.single('image'), addDoctor);
adminRouter.post('/login', loginAdmin);
adminRouter.post('/all-doctors', authAdmin, allDoctors)
adminRouter.post('/change-availability', authAdmin, changeAvailablity)
adminRouter.get('/appointments', authAdmin, appointmentAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)
export default adminRouter
