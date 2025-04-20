import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navbar, Footer, Services, Onramp, Welcome, SplashScreen } from "./components";

const App = () => {
  const [showSplash, setShowSplash]= useState(true);

  useEffect(() => {
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
      document.body.removeChild(script);
    };
  }, []); 
  

  return (
    
      <div className="min-h-screen relative overflow-hidden">
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen  key="splash" onFinish={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

        <div className={`min-h-screen transition-opacity duration-500 ${showSplash ? 'opacity-0' : 'opacity-100'}`}
        style={{ pointerEvents: showSplash ? "none" : "auto"}}>
          <div className="gradient-bg-welcome">
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





