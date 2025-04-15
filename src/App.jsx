import React, { useEffect } from 'react';
import { Navbar, Footer, Services, Onramp, Welcome } from "./components";

const App = () => {
  useEffect(() => {
    // Dynamically load the external script
    const script = document.createElement('script');
    script.src = '/js/snarkjs.min.js';
    script.async = true;
    script.onload = () => {
      console.log('snarkjs loaded successfully');
      // You can add any additional logic here once the script is loaded
    };
    script.onerror = (error) => {
      console.error('Error loading snarkjs script:', error);
    };
    document.body.appendChild(script);

    // Cleanup function to remove the script after component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty dependency array ensures this effect runs once when the component mounts


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





