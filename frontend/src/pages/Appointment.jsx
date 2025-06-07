import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysofWeeks = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
    console.log(docInfo)
  }
  const getAvailableSlots = async () => {
    setDocSlots([])
    //getting current date
    let today = new Date()
    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)
      // setting end time of the date with index
      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(24, 0, 0, 0)
      // setting hours
      if (today.toDateString() === currentDate.toDateString()) {
        // If current time is before 10AM, start from 10:00
        // Else round up to next half hour slot
        let now = new Date()
        let startHour = now.getHours() < 10 ? 10 : now.getHours()
        let startMinute = now.getMinutes()

        if (startMinute > 30) {
          startHour += 1
          startMinute = 0
        } else if (startMinute > 0) {
          startMinute = 30
        } else {
          startMinute = 0
        }

        currentDate.setHours(startHour, startMinute, 0, 0)
      } else {
        currentDate.setHours(10, 0, 0, 0)
      }

      let timeSlots = []
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        //  slotdate and slottime is already booked is hide

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const slotDate = day + "_" + month + "_" + year
        const slotTime = formattedTime

        const isSlotAvailable = docInfo?.slot_booked?.[slotDate]?.includes(slotTime) ? false : true;

        // if slotavailable is book
        if (isSlotAvailable) {
          //add slot to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          })

        }
        //Increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30)

      }
      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book an appointment')
      return navigate('/login')
    }

    try {

      // doctor slot booking time
      const date = docSlots[slotIndex][0].datetime

      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = `${day}_${month}_${year}`

      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointment')
      } else {
        toast.error(data.message)
      }

      // console.log(slotDate)
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }



  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    getAvailableSlots()
  }, [docInfo])
  useEffect(() => {
    // console.log(docSlots)
  }, [docSlots])
  return docInfo && (
    <div>
      {/* --------- Doctors Details  ------------ */}
      <div className='flex flex-col sm:flex-row gap-4 '>
        <img className='bg-blue-500 w-full sm:max-w-72 rounded-lg mt-5' src={docInfo.image} alt="" />

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mt-5 sm:mx-0 mt-[-80px]sm:mt-0'>
          {/* ------------ Doc Info : name, degree, experience ------------------- */}
          <p className='flex item-center text-2xl font-medium text-gray-900 gap-3'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
          <div className='flex item-center font-medium text-gray-600 gap-4 '>
            <p>{docInfo.degree}-{docInfo.speciality}</p>
            <button className='border border-gray-400 rounded-xl px-2  '>{docInfo.experience}</button>
          </div>
          {/* ---------- Doctor About----------- */}
          <div>
            <p className='flex item-center gap-1 mt-3 font-medium text-gray-900'>About <img src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
            <p className='text-gray-500 font-medium mt-4'>Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span></p>
          </div>
        </div>
      </div>
      {/* ------ Booking slots   -------- */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex gap-3 item-center w-full  mt-4'>
          {
            docSlots.length && docSlots.map((item, index) => (
              <div
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`text-center py-6 min-w-16 rounded-lg cursor-pointer ${slotIndex === index ? 'bg-blue-500 text-white' : 'border border-gray-600 text-gray-800'
                  }`}
              >
                <p>{item[0] && daysofWeeks[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>
        <div className='flex item-center gap-3 w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots[slotIndex].map((item, index) => (
              <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full ${item.time === slotTime ? 'bg-blue-500 text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
                {item.time.toLowerCase()}
              </p>
            ))
          }
        </div>
        <button onClick={bookAppointment} type='submit' className='bg-blue-500 text-white text-sm font-light px-14 py-3 rounded-full mt-10'>Book an appointment</button>
      </div>
      {/* Listing related doctors  */}
      <RelatedDoctors doctId={docId} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment