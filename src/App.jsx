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
      setIsLoading(false);

    };
    script.onerror = (error) => {
      console.error('Error loading snarkjs script:', error);
      setIsLoading(false); 

    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []); 
  

  return (
    <div>
      <div className="min-h-screen">
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        )}
      </AnimatePresence>
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





