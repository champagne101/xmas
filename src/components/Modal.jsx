import React, { useState, useEffect } from 'react';
import { AiFillPlayCircle } from 'react-icons/ai';

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: wallet
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);


  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    
    const handler = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // handle escape key & overlay click
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const openModal = () => {
    setIsOpen(true);
    setStep(1);
    setEmail('');
    setOtp('');
  };

  const closeModal = () => {
    setIsOpen(false);
    setStep(1);
    setEmail('');
    setOtp('');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleSendOTP = async () => {
    setIsLoading(true);
    // simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep(2);
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    // simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep(3);
  };

  const handleConnectWallet = async () => {
    setIsLoading(true);
    // simulating wallet conn
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    closeModal();
    alert('Wallet connected successfully!');
  };

  const isEmailValid = email.includes('@') && email.includes('.');
  const isOTPValid = otp.length === 6 && /^\d{6}$/.test(otp);

  return (
    <div className={isDark ? 'dark' : ''}>
        {/* <div className="max-w-7xl mx-auto mb-8"> */}
          <button
            onClick={openModal}
            className="flex items-center bg-[#346f8f] hover:bg-[#185371] dark:bg-[#346f8f]  dark:hover:bg-[#35677c] px-6 py-3 text-white font-medium rounded-full transition-all duration-300"
          >
            <AiFillPlayCircle className="mr-2 text-xl" />
            Connect
          </button>
        {/* </div> */}

        {/* modal */}
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900/50 backdrop-blur-sm"
            onClick={handleOverlayClick}
          >
            <div className="relative p-4 w-full max-w-md">
              <div
                className="relative rounded-2xl shadow-lg overflow-hidden transition-all duration-700 ease-in-out"
                style={{
                  background: isDark 
                    ? 'linear-gradient(135deg, rgba(55,65,81,0.95) 0%, rgba(31,41,55,0.98) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.98) 100%)',
                  backdropFilter: "blur(20px)",
                  boxShadow: isDark 
                    ? "0 25px 50px rgba(0, 0, 0, 0.5)" 
                    : "0 25px 50px rgba(0, 0, 0, 0.15)",
                }}
              >
                <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-gradient-to-br from-[#346f8f]/20 to-transparent -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-gradient-to-tl from-[#346f8f]/10 to-transparent translate-x-1/2 translate-y-1/2"></div>

                <div className="flex items-center justify-between p-6 border-b border-gray-200/20 dark:border-gray-600/20 relative z-10">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {step === 1 && 'Enter Email'}
                    {step === 2 && 'Verify OTP'}
                    {step === 3 && 'Connect Wallet'}
                  </h3>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-gray-400 bg-transparent hover:bg-gray-200/50 hover:text-gray-900 dark:hover:bg-gray-600/50 dark:hover:text-white rounded-lg text-sm w-8 h-8 flex justify-center items-center transition-all duration-200"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6 relative z-10">
                  {step === 1 && (
                    <div className="space-y-4">
                      <p className="text-base text-gray-600 dark:text-gray-300">
                        Enter your email address to get started with wallet connection.
                      </p>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#346f8f] focus:border-transparent backdrop-blur-sm transition-all duration-200"
                        />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <p className="text-base text-gray-600 dark:text-gray-300">
                        We've sent a verification code to <strong>{email}</strong>. Please enter the 6-digit code below.
                      </p>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setOtp(value);
                          }}
                          placeholder="000000"
                          maxLength={6}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#346f8f] focus:border-transparent backdrop-blur-sm transition-all duration-200 text-center text-2xl tracking-widest"
                        />
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#346f8f] to-[#185371] flex items-center justify-center">
                        <AiFillPlayCircle className="text-white text-2xl" />
                      </div>
                      <p className="text-base text-gray-600 dark:text-gray-300">
                        Your email has been verified successfully. You can now connect your wallet to continue.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200/20 dark:border-gray-600/20 relative z-10">
                  {step === 1 && (
                    <>
                      <button
                        onClick={closeModal}
                        className="px-5 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 transition-all duration-200 backdrop-blur-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSendOTP}
                        disabled={!isEmailValid || isLoading}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-[#346f8f] hover:bg-[#185371] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg focus:ring-4 focus:ring-blue-300 transition-all duration-200 flex items-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          'Send OTP'
                        )}
                      </button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <button
                        onClick={() => setStep(1)}
                        className="px-5 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 transition-all duration-200 backdrop-blur-sm"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleVerifyOTP}
                        disabled={!isOTPValid || isLoading}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-[#346f8f] hover:bg-[#185371] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg focus:ring-4 focus:ring-blue-300 transition-all duration-200 flex items-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            Verifying...
                          </>
                        ) : (
                          'Verify OTP'
                        )}
                      </button>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <button
                        onClick={() => setStep(2)}
                        className="px-5 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 transition-all duration-200 backdrop-blur-sm"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleConnectWallet}
                        disabled={isLoading}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-[#346f8f] hover:bg-[#185371] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg focus:ring-4 focus:ring-blue-300 transition-all duration-200 flex items-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            Connecting...
                          </>
                        ) : (
                          <>
                            <AiFillPlayCircle className="text-lg" />
                            Connect Wallet
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Modal;