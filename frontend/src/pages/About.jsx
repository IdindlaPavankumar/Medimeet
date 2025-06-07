import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div className="px-6 md:px-12 lg:px-20 py-10 bg-gray-50 text-gray-700">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-700">
          ABOUT <span className="text-blue-600">US</span>
        </h2>
      </div>

      {/* About Content */}
      <div className="flex flex-col md:flex-row gap-12 items-center bg-white p-6 md:p-10 rounded-xl shadow-lg">
        <img
          className="w-full md:max-w-md rounded-lg object-cover"
          src={assets.about_image}
          alt="About Us"
        />
        <div className="flex flex-col gap-6 text-sm md:text-base text-gray-600">
          <p>
            Welcome to <span className="font-medium text-blue-600">Prescripto</span>, your trusted partner in managing your healthcare needs conveniently and efficiently.
            At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
          </p>
          <p>
            We are committed to excellence in healthcare technology. We continuously strive to enhance our platform,
            integrating the latest advancements to improve user experience and deliver superior service. Whether you're
            booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.
          </p>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Our Vision</h3>
            <p>
              Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge
              the gap between patients and healthcare providers, making it easier for you to access the care you need, when
              you need it.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          WHY <span className="text-blue-600">CHOOSE US</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {[
          {
            title: 'EFFICIENCY',
            desc: 'Streamlined appointment scheduling that fits into your busy lifestyle.',
          },
          {
            title: 'CONVENIENCE',
            desc: 'Access to a network of trusted healthcare professionals in your area.',
          },
          {
            title: 'PERSONALIZATION',
            desc: 'Tailored recommendations and reminders to help you stay on top of your health.',
          },
        ].map((item, index) => (
          <div
            key={index}
            className="border rounded-lg p-6 md:p-8 text-center transition-all hover:bg-blue-500 hover:text-white cursor-pointer shadow-sm"
          >
            <h4 className="text-lg font-bold mb-2">{item.title}</h4>
            <p className="text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
