import React from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

import light from "../../images/light.png";
import dark from "../../images/dark.png";

const NavBarItem = ({ title, classprops }) => (
  <li className={`mx-4 cursor-pointer px-4 py-2 text-[#4681ee]/80 dark:text-white/80 hover:text-[#4681ee] dark:hover:text-white font-medium transition-all duration-300 hover:bg-[#4681ee]/10 dark:hover:bg-white/10 rounded-full ${classprops}`}>{title}</li>
);

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = React.useState(false);

  return (
    <nav className="w-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center">
            <img src={light} alt="logo-light" className="w-12 cursor-pointer block dark:hidden" />
            <img src={dark} alt="logo-dark" className="w-12 cursor-pointer hidden dark:block" />
            <span className="ml-2 font-bold text-[#4681ee] dark:text-white">OffConnectX</span>
          </div>
      </div>
      
      <ul className=" md:flex hidden items-center space-x-2 ">
        {["Transfer", "Exchange", "Onramp", "Wallets"].map((item, index) => (
          <NavBarItem key={item + index} title={item} />
        ))}
        <button className="bg-[#4681ee] dark:bg-[#2952e3] hover:bg-[#3671de] dark:hover:bg-[#2546bd] py-2 px-6 text-white font-medium rounded-full transition-all duration-300 
        transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4681ee] dark:focus:ring-[#2952e3] focus:ring-opacity-50 ml-4">
          Connect
        </button>
      </ul>

      <div className="md:hidden">
        {!toggleMenu && (
          <HiMenuAlt4 fontSize={28} className=" cursor-pointer text-[#4681ee] dark:text-white" onClick={() => setToggleMenu(true)} />
        )}
        {toggleMenu && (
          <AiOutlineClose fontSize={28} className=" cursor-pointer text-[#4681ee] dark:text-white" onClick={() => setToggleMenu(false)} />
        )}

        {toggleMenu && (
        <div className="fixed inset-0 z-50 md:hidden ">
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" onClick={() => setToggleMenu(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-[280px] animate-slide-in  p-6 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <AiOutlineClose 
                fontSize={24} 
                className="cursor-pointer text-[#4681ee] dark:text-white " 
                onClick={() => setToggleMenu(false)} 
              />
            </div>
            <ul className="space-y-4">
              {["Transfer", "Exchange", "Onramp", "Wallets"].map((item, index) => (
                <li 
                  key={item + index} 
                  className="px-4 py-2 text-[#4681ee]/80 dark:text-white/80 hover:text-[#4681ee] dark:hover:text-white font-medium transition-all duration-300 hover:bg-[#4681ee]/10 dark:hover:bg-white/10 rounded-full cursor-pointer"
                >
                  {item}
                </li>
              ))}
              <li>
                <button className="w-full px-6 py-2 bg-[#4681ee] dark:bg-[#2952e3] hover:bg-[#3671de] dark:hover:bg-[#2546bd] text-white font-medium rounded-full transition-all duration-300">
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
