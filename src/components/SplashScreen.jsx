import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import light from "../../images/light.png";
import dark from "../../images/dark.png";

const SplashScreen = ({ onFinish }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeQuery.matches);

        const listener = (e) => setIsDarkMode(e.matches);
        darkModeQuery.addEventListener('change', listener);

        const timer = setTimeout(() => {
            onFinish();
        }, 3000);

        return () => {
            clearTimeout(timer);
            darkModeQuery.removeEventListener('change', listener);
        };
    }, [onFinish]);

    const bgColor = isDarkMode ? 'bg-[#2a4065]' : 'bg-[#3585e4]';
    const textColor = isDarkMode ? 'text-[#fafcfe]' : 'text-[#e7ecef]';
    const logoSrc = isDarkMode ? dark : light;

    return (
        <motion.div 
            className={`fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center z-50 ${bgColor}`}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <motion.img
                    src={logoSrc}
                    alt="OffConnectX Logo"
                    className="w-32 h-32 mb-6"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                        duration: 1.2,
                        type: "spring",
                        stiffness: 100
                    }}
                />
                <motion.h1
                    className={`text-2xl font-bold ${textColor}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    OffConnectX
                </motion.h1>
            </motion.div>
        </motion.div>
    );
};

export default SplashScreen;