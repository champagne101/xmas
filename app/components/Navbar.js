"use client"

import React from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";
import light from "../../public/images/light.png";
import dark from "../../public/images/dark.png";
import { useRouter } from "next/navigation";


const NavBarItem = ({ title, classprops }) => (
  <li className={`mx-4 cursor-pointer px-4 py-2 text-[#346f8f]/80 dark:text-white/80 hover:text-[#346f8f] dark:hover:text-white font-medium transition-all duration-300 hover:bg-white/50 dark:hover:bg-white/10 rounded-full ${classprops}`}>
    <Link href={`/${title.toLowerCase()}`}>{title}</Link>
    </li>
);

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = React.useState(false);
  const router = useRouter();
  const menuItems = ["Transfer", "Exchange", "Onramp", "Wallets"];


  return (
    <nav className=" w-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image src={light} alt="logo-light" className="w-12 cursor-pointer block dark:hidden" />
            <Image src={dark} alt="logo-dark" className="w-12 cursor-pointer hidden dark:block" />
            <span className="ml-2 font-bold text-[#346f8f] dark:text-white">OffConnectX</span>
          </Link>
      </div>
      
      <ul className=" md:flex hidden items-center space-x-2 ">
        {menuItems.map((item, index) => (
          <NavBarItem key={item + index} title={item} />
        ))}
        <button className="bg-[#346f8f] dark:bg-[#346f8f] hover:bg-[#2c6889] dark:hover:bg-[#35677c] py-2 px-6 text-white font-medium rounded-full transition-all duration-300 
        transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#346f8f] dark:focus:ring-[#2952e3] focus:ring-opacity-50 ml-4">
          Connect
        </button>
      </ul>

      <div className="md:hidden">
        {!toggleMenu && (
          <HiMenuAlt4 fontSize={28} role="button" className=" cursor-pointer text-[#346f8f] dark:text-white" onClick={() => setToggleMenu(true)} />
        )}
        {toggleMenu && (
          <AiOutlineClose fontSize={28} role="button" className=" cursor-pointer text-[#346f8f] dark:text-white" onClick={() => setToggleMenu(false)} />
        )}

        {toggleMenu && (
        <div className="fixed inset-0 z-50 md:hidden ">
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" onClick={() => setToggleMenu(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-[280px] animate-slide-in  p-6 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <AiOutlineClose 
                fontSize={24} 
                className="cursor-pointer text-[#346f8f] dark:text-white " 
                onClick={() => setToggleMenu(false)} 
              />
            </div>
            <ul className="space-y-4">
              {menuItems.map((item, index) => (
                <li 
                  key={item + index} 
                  className="px-4 py-2 text-[#346f8f]/80 dark:text-white/80 hover:text-[#346f8f] dark:hover:text-white font-medium transition-all duration-300 hover:bg-white/20 dark:hover:bg-white/10 rounded-full cursor-pointer"
                >
                  <Link href={`/${item.toLowerCase()}`} onClick={() => setToggleMenu(false)}>
                  {item}
                  </Link>
                </li>
              ))}
              <li>
                <button className="w-full px-6 py-2 bg-[#346f8f] dark:bg-[#346f8f]  hover:bg-[#185371] dark:bg-[#346f8f] dark:hover:bg-[#35677c] text-white font-medium rounded-full transition-all duration-300">
                  Connect
                </button>
              </li>
            </ul>
          </div>
        </div>
        )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;