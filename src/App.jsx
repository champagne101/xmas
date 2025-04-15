import React, { useEffect } from 'react';
import { Navbar, Footer, Services, Onramp, Welcome } from "./components";

const App = () => {
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
    <div>
      <div className="min-h-screen">
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





