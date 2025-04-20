import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import light from "../../images/light.png";
import dark from "../../images/dark.png";

const SplashScreen = ({ onFinish }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isExiting, setIsExiting] = useState(false);


    useEffect(() => {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeQuery.matches);

        const listener = (e) => setIsDarkMode(e.matches);
        darkModeQuery.addEventListener('change', listener);

        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, 2500);

        const completionTimer = setTimeout(() => {
            onFinish();
        }, 3200);

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(completionTimer);
            darkModeQuery.removeEventListener('change', listener);
        };
    }, [onFinish]);

    const bgColor = isDarkMode ? 'bg-[#356f91]' : 'bg-[#f6f7fc]';  //#244f6b dark mode colour p2
    const textColor = isDarkMode ? 'text-[#fafcfe]' : 'text-[#4681ee]';
    const logoSrc = isDarkMode ? dark : light;

    return (
        <motion.div 
            className={`fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center z-50 ${bgColor} overflow-hidden`}
            initial={{ y: 0 }}
            animate={{ y: isExiting ? "-100%": 0 }}
            transition={{ 
                duration: isExiting ? 0.7 : 0,
                ease: "easeInOut",
                delay: isExiting ? 0.1 : 0 
            }}
        >
            <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ 
                    opacity: isExiting ? 0 : 1,
                    y : isExiting ? -50 : 0 
                }}
                transition={{  
                    duration: isExiting ? 0.5 : 1,
                    ease: "easeInOut",
                    opacity: { duration: isExiting ? 0.3 : 1 }
                }}
            >
                <motion.img
                    src={logoSrc}
                    alt="OffConnectX Logo"
                    className="w-32 h-32 mb-6"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ 
                        opacity: isExiting ? 0 : 1, 
                        scale: isExiting ? 0.8 : 1 
                    }}
                    transition={{ 
                        duration: isExiting ? 0.4 : 1.2,
                        type: isExiting ? "tween" : "spring",
                        stiffness: 100
                    }}
                />
                <motion.h1
                    className={`text-2xl font-bold ${textColor}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                        opacity: isExiting ? 0 : 1,
                         y: isExiting ? -20 : 0 
                        }}
                    transition={{ 
                        delay: isExiting ? 0 : 0.5, 
                        duration: isExiting ? 0.3 : 1 
                    }}
                >
                    OffConnectX
                </motion.h1>
            </motion.div>
        </motion.div>
    );
};

export default SplashScreen;