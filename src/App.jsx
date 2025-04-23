import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navbar, Footer, Services, Onramp, Welcome, SplashScreen } from "./components";

const App = () => {
  const [showSplash, setShowSplash]= useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);


  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);
 
    const listener = (e) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', listener);

    const script = document.createElement('script');
    script.src = '/js/snarkjs.min.js';
    script.async = true;
    script.onload = () => {
      console.log('snarkjs loaded successfully');
    };
    script.onerror = (error) => {
      console.error('Error loading snarkjs script:', error);
    };
    document.body.appendChild(script);

    return () => {
      if(document.body.contains(script)) {
        document.body.removeChild(script);
      }
      darkModeQuery.removeEventListener('change', listener);
    };
  }, []); 


  // matches the main app's initial bg to the splash screen
  const appBg = isDarkMode ? 'bg-[#244f6b]' : 'bg-[#f6f7fc]';
  

  return (
    
      <div className={`min-h-screen relative overflow-hidden ${appBg}`}>
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen  key="splash" onFinish={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

        <div className={`min-h-screen transition-opacity duration-500 ${showSplash ? 'opacity-0' : 'opacity-100'}`}
        style={{ pointerEvents: showSplash ? "none" : "auto"}}>

          <div className="gradient-bg-welcome bg-[#f6f7fc] text-[#4681ee] dark:bg-[#244f6b] dark:text-[#fafcfe]">
          <Navbar />
          <Welcome /> 
          {/* <Onramp /> */}
        </div>
        <Services />
        {/* {<Transactions /> } */}
        <Footer />
      </div>
    </div>
  );
}

export default App;





