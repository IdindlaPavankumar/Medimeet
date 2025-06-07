import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <footer className=" text-gray-700 mt-20">
            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6 md:px-16 py-12">
                {/* Left */}
                <div>
                    <img src={assets.logo} alt="logo" className="h-10 mb-4" />
                    <p className="text-sm leading-relaxed leading-6">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                </div>

                {/* Center */}
                <div>
                    <p className="font-semibold text-lg mb-3">COMPANY</p>
                    <ul className="space-y-2 text-sm">
                        <li className="hover:text-blue-600 cursor-pointer">Home</li>
                        <li className="hover:text-blue-600 cursor-pointer">About Us</li>
                        <li className="hover:text-blue-600 cursor-pointer">Contact Us</li>
                        <li className="hover:text-blue-600 cursor-pointer">Privacy Policy</li>
                    </ul>
                </div>

                {/* Right */}
                <div>
                    <p className="font-semibold text-lg mb-3">GET IN TOUCH</p>
                    <ul className="space-y-2 text-sm">
                        <li>+1-212-456-7890</li>
                        <li>Medimeet@gmail.com</li>
                    </ul>
                </div>
            </div>

            {/* Bottom Copyright */}
            <div className="border-t border-gray-600 py-4 px-6 text-center text-sm text-gray-500">
                © 2025 Prescripto. All Rights Reserved.
            </div>
        </footer>
    )
}

export default Footer
