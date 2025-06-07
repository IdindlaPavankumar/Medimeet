import React, { useContext, useState, useRef } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../Context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddDoctor = () => {
    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const { backendUrl, aToken } = useContext(AdminContext)
    const fileInputRef = useRef();

    // Move resetForm outside of onSubmitHandler
    const resetForm = () => {
        setDocImg(false);
        setName('');
        setEmail('');
        setPassword('');
        setExperience('1 Year');
        setFees('');
        setAbout('');
        setSpeciality('General physician');
        setDegree('');
        setAddress1('');
        setAddress2('');

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            if (!docImg) {
                return toast.error('Image is not selected')
            }

            const formData = new FormData()
            formData.append("image", docImg);
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);

            const experienceNumber = experience.split(' ')[0];
            formData.append("experience", experienceNumber);
            formData.append("fees", fees);
            formData.append("about", about);
            formData.append("speciality", speciality);
            formData.append("degree", degree);

            const addressObj = {
                line1: address1,
                line2: address2
            };
            formData.append("address", JSON.stringify(addressObj));

            const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
                headers: { aToken }
            })

            if (data.success) {
                toast.success("Doctor added successfully!");

                // Use setTimeout to ensure toast shows before confirm dialog
                setTimeout(() => {
                    const addAnother = confirm("Do you want to add another doctor?");
                    if (addAnother) {
                        resetForm();
                    }
                }, 1000);

            } else {
                toast.error(data.message || "Failed to add doctor")
            }

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add doctor')
            console.error(error)
        }
    }

    return (
        <form className="max-w-4xl mx-auto  rounded-lg " onSubmit={onSubmitHandler}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Doctor</h2>

            <div className='bg-gray-100 px-8 py-5'>
                <div className="flex items-center space-x-4">
                    <label htmlFor="doc-img" className="cursor-pointer">
                        <img
                            src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                            alt="Upload"
                            className="h-28 w-28 object-cover rounded-full bg-gray-100"
                        />
                    </label>
                    <input
                        onChange={(e) => setDocImg(e.target.files[0])}
                        type="file"
                        name='image'
                        id="doc-img"
                        hidden
                        ref={fileInputRef}
                    />
                    <p className="text-gray-600">Upload doctor <br /> picture</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 mb-1">Doctor Name</label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            type="text"
                            placeholder="Name"
                            required
                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Doctor Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            placeholder="Email"
                            required
                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Experience</label>
                        <select
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            required
                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option disabled value="">Select Experience</option>
                            {Array.from({ length: 10 }, (_, i) => (
                                <option key={i} value={`${i + 1} Year${i > 0 ? 's' : ''}`}>
                                    {i + 1} Year{i > 0 ? 's' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Fees</label>
                        <input
                            onChange={(e) => setFees(e.target.value)}
                            value={fees}
                            type="number"
                            placeholder="Fees"
                            required
                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Speciality</label>
                        <select
                            onChange={(e) => setSpeciality(e.target.value)}
                            value={speciality}
                            required
                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="General physician">General physician</option>
                            <option value="Gynecologist">Gynecologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Pediatricians">Pediatricians</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Gastroenterologist">Gastroenterologist</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Education</label>
                        <input
                            onChange={(e) => setDegree(e.target.value)}
                            value={degree}
                            type="text"
                            placeholder="Education"
                            required
                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Address</label>
                        <input
                            type="text"
                            onChange={(e) => setAddress1(e.target.value)}
                            value={address1}
                            placeholder="Address 1"
                            required
                            className="w-full mb-2 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="text"
                            onChange={(e) => setAddress2(e.target.value)}
                            value={address2}
                            placeholder="Address 2"
                            required
                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">About Doctor</label>
                    <textarea
                        onChange={(e) => setAbout(e.target.value)}
                        value={about}
                        placeholder="Write about the doctor"
                        rows={5}
                        className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                        Add Doctor
                    </button>

                    {/* Test reset button - remove after testing */}
                    <button
                        type="button"
                        onClick={resetForm}
                        className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
                    >
                        Test Reset
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddDoctor;