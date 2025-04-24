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
    <nav className="w-full flex md:justify-center justify-between items-center p-4 ">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img src={light} alt="logo-light" className="w-14 cursor-pointer block dark:hidden" />
        <img src={dark} alt="logo-dark" className="w-14 cursor-pointer hidden dark:block" />
        
      </div>
      <ul className=" md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {["Transfer", "Exchange", "Onramp", "Wallets"].map((item, index) => (
          <NavBarItem key={item + index} title={item} />
        ))}
        <li className="bg-[#4681ee] dark:bg-[#2952e3] hover:bg-[#3671de] dark:hover:bg-[#2546bd] py-2 px-6 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4681ee] dark:focus:ring-[#2952e3] focus:ring-opacity-50 cursor rounded-full cursor-pointer ml-4">
          Connect
        </li>
      </ul>
      <div className="flex relative">
        {!toggleMenu && (
          <HiMenuAlt4 fontSize={28} className=" md:hidden cursor-pointer text-[#4681ee] dark:text-white" onClick={() => setToggleMenu(true)} />
        )}
        {toggleMenu && (
          <AiOutlineClose fontSize={28} className=" md:hidden cursor-pointer text-[#4681ee] dark:text-white  " onClick={() => setToggleMenu(false)} />
        )}
        {toggleMenu && (
          <ul
            className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md  blue-glassmorphism  animate-slide-in"
          >
            <li className="text-xl w-full my-2 text-[#4681ee] dark:text-white "><AiOutlineClose onClick={() => setToggleMenu(false)} /></li>
            {["Transfer", "Exchange", "Onramp", "Wallets"].map(
              (item, index) => <NavBarItem key={item + index} title={item} classprops="my-2 text-lg w-full text-right " />,
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
