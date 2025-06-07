import React from 'react';
import { assets } from '../assets/assets';

const Contact = () => {
  return (
    <div className="px-6 md:px-16 py-12 bg-gray-50 text-gray-700">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-semibold">
          CONTACT <span className="text-blue-600">US</span>
        </h2>
        <p className="mt-2 text-sm md:text-base text-gray-500">
          We’re here to help you with anything you need.
        </p>
      </div>

      {/* Contact Section */}
      <div className="flex flex-col lg:flex-row items-center gap-10">
        {/* Image */}
        <img
          src={assets.contact_image}
          alt="Contact Us"
          className="w-full max-w-md rounded-lg shadow-md"
        />

        {/* Contact Info */}
        <div className="flex flex-col gap-6 text-sm md:text-base w-full max-w-xl">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Our Office</h3>
            <p className="mt-1 text-gray-600">
              1234 HITEC City Road<br />
              Suite 210, Hyderabad, Telangana 500081, India
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">Contact Info</h3>
            <p className="mt-1 text-gray-600">
              Tel: +91-40-1234-5678<br />
              Email: <a href="mailto:prescripto@gmail.com" className="text-blue-600 hover:underline">prescripto@gmail.com</a>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">Careers at Prescripto</h3>
            <p className="mt-1 text-gray-600">
              Learn more about our teams and job openings.
            </p>
            <button className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
