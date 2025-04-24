import React from "react";
import { RiMailLine } from "react-icons/ri";
import { BiEnvelope } from "react-icons/bi";

import light from "../../images/light.png";
import dark from "../../images/dark.png";


const Footer = () => (
  <footer className="w-full py-8 border-t border-[#4681ee]/10 dark:border-white/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-1">
          <div className="flex items-center mb-4">
            <img src={light} alt="logo-light" className="w-12 block dark:hidden" />
            <img src={dark} alt="logo-dark" className="w-12 hidden dark:block" /> 
            <span className="ml-2 font-bold text-[#4681ee] dark:text-white">OffConnectX</span>
          </div>
          <p className="text-[#4681ee]/70 dark:text-white/70 text-sm">Secure, fast, and reliable cryptocurrency platform.</p>
        </div>

      <div>
        <h3 className="text-[#4681ee] dark:text-white font-medium mb-4">Services</h3>
        <ul className="space-y-2">
        <li><a  className=" text-[#4681ee]/70 dark:text-white/70 hover:text-[#4681ee] dark:hover:text-white transition-colors" href="#">Transfer</a></li>
        <li><a  className=" text-[#4681ee]/70 dark:text-white/70 hover:text-[#4681ee] dark:hover:text-white transition-colors" href="#">Exchange</a></li>
        <li><a  className=" text-[#4681ee]/70 dark:text-white/70 hover:text-[#4681ee] dark:hover:text-white transition-colors" href="#">Onramp</a></li>
        <li><a  className=" text-[#4681ee]/70 dark:text-white/70 hover:text-[#4681ee] dark:hover:text-white transition-colors" href="#">Wallets</a></li>
        </ul>
      </div>

      <div>
          <h3 className="text-[#4681ee] dark:text-white font-medium mb-4">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-[#4681ee]/70 dark:text-white/70 hover:text-[#4681ee] dark:hover:text-white transition-colors">About</a></li>
            {/* <li><a href="#" className="text-[#4681ee]/70 dark:text-white/70 hover:text-[#4681ee] dark:hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="text-[#4681ee]/70 dark:text-white/70 hover:text-[#4681ee] dark:hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="text-[#4681ee]/70 dark:text-white/70 hover:text-[#4681ee] dark:hover:text-white transition-colors">Press</a></li> */}
          </ul>
        </div>

        <div>
          <h3 className="text-[#4681ee] dark:text-white font-medium mb-4">Contact</h3>
          <div className="flex items-center mb-2 text-[#4681ee]/70 dark:text-white/70">
            <RiMailLine className="h-4 w-4 mr-2"/>
            <a href="mailto:info@offconnectx.com" className="hover:text-[#4681ee] dark:hover:text-white transition-colors">
              offconnectx@gmail.com
            </a>
          </div>
          <p className="text-[#4681ee]/70 dark:text-white/70 text-sm">Come join us and hear for the unexpected miracle</p>
          {/* <p className=" text-sm text-center font-medium mt-2">info@offconnectx.com</p> */}
        </div>
    </div>

    <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-[#4681ee]/10 dark:border-white/10">
      <p className=" text-[#4681ee]/70 dark:text-white/70 text-sm mb-4 sm:mb-0">@offconnectx2024</p>
      <p className=" text-[#4681ee]/70 dark:text-white/70 text-sm">All rights reserved</p>
    </div>
  </div>
  </footer>

);

export default Footer;
