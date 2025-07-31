"use client"

import React from "react";
import { RiMailLine } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";
import light from "../../public/images/light.png";
import dark from "../../public/images/dark.png";


const Footer = () => (
  <footer className="bg-[#d8dede] dark:bg-[#244f6b] w-full py-8 border-t border-[#4681ee]/10 dark:border-white/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center mb-4">
            <Image src={light} alt="logo-light" className="w-12 block dark:hidden" />
            <Image src={dark} alt="logo-dark" className="w-12 hidden dark:block" /> 
            <span className="ml-2 font-bold text-[#346f8f] dark:text-white">OffConnectX</span>
          </Link>
          <p className="text-[#4681ee]/70 dark:text-white/70 text-sm">Secure, fast, and reliable cryptocurrency platform.</p>
        </div>

      <div>
        <h3 className="text-[#346f8f] dark:text-white font-medium mb-4">Services</h3>
        <ul className="space-y-2">
        <li><Link  className=" text-[#346f8f]/70 dark:text-white/70 hover:text-[#346f8f] dark:hover:text-white transition-colors" href="#">Transfer</Link></li>
        <li><Link  className=" text-[#346f8f]/70 dark:text-white/70 hover:text-[#346f8f] dark:hover:text-white transition-colors" href="#">Exchange</Link></li>
        <li><Link  className=" text-[#346f8f]/70 dark:text-white/70 hover:text-[#346f8f] dark:hover:text-white transition-colors" href="#">Onramp</Link></li>
        <li><Link  className=" text-[#346f8f]/70 dark:text-white/70 hover:text-[#346f8f] dark:hover:text-white transition-colors" href="#">Wallets</Link></li>
        </ul>
      </div>

      <div>
          <h3 className="text-[#346f8f] dark:text-white font-medium mb-4">Company</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="text-[#346f8f]/70 dark:text-white/70 hover:text-[#346f8f] dark:hover:text-white transition-colors">About</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[#346f8f] dark:text-white font-medium mb-4">Contact</h3>
          <div className="flex items-center mb-2 text-[#346f8f]/70 dark:text-white/70">
            <RiMailLine className="h-4 w-4 mr-2"/>
            <Link href="mailto:info@offconnectx.com" className="hover:text-[#346f8f] dark:hover:text-white transition-colors">
              offconnectx@gmail.com
            </Link>
          </div>
          <p className="text-[#346f8f]/70 dark:text-white/70 text-sm">Come join us and hear for the unexpected miracle</p>
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