import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({ speciality, docId }) => {
    const { doctors } = useContext(AppContext)
    const navigate = useNavigate()
    const [relDoc, setRelDoc] = useState([])

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
            setRelDoc(doctorsData)
        }
    }, [doctors, speciality, docId])

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 px-4 md:px-10'>
            <h1 className="text-3xl font-bold text-center">Top Doctors to Book</h1>
            <p className="text-center text-gray-600 text-sm md:text-base">
                Simply browse through our extensive list of trusted doctors
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-screen-xl">
                {relDoc.slice(0, 5).map((item) => (
                    <div
                        key={item._id}
                        onClick={() => {
                            navigate(`/appointment/${item._id}`)
                            scrollTo(0, 0)
                        }}
                        className="bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-64 sm:h-72 md:h-80 object-cover"
                        />
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-green-600 text-xs font-semibold bg-green-100 px-2 py-1 rounded-full">
                                    Available
                                </span>
                            </div>
                            <h2 className="text-lg font-semibold">{item.name}</h2>
                            <p className="text-sm text-gray-600">{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-8">
                <button
                    onClick={() => {
                        navigate('/doctors')
                        scrollTo(0, 0)
                    }}
                    className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full hover:bg-blue-100 transition-all"
                >
                    More
                </button>
            </div>
        </div>
    )
}

export default RelatedDoctors
