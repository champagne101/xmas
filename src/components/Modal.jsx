import React, { useState, useEffect, useRef } from 'react';
import { AiFillPlayCircle } from 'react-icons/ai';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase.config';

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [method, setMethod] = useState(null);
  const [step, setStep] = useState(0);
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  // using usRef to store recaptcha verifier
  const recaptchaVerifierRef = useRef(null);
  const recaptchaContainerRef = useRef('recaptcha-container-' + Date.now());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    
    const handler = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Handle escape key & overlay click
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

  // here cleaning up recaptcha on unmount
  useEffect(() => {
    return () => {
      cleanupRecaptcha();
    };
  }, []);

  const cleanupRecaptcha = () => {
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
        console.log('reCAPTCHA cleaned up successfully');
      } catch (error) {
        console.log('Error clearing reCAPTCHA:', error);
      }
      recaptchaVerifierRef.current = null;
    }
    
    // here just cleaning up the DOM element if it exists
    if (recaptchaContainerRef.current) {
      const container = document.getElementById(recaptchaContainerRef.current);
      if (container) {
        container.remove(); // remove from DOM 
      }
      recaptchaContainerRef.current = null;
    }
  };

  const openModal = () => {
    setIsOpen(true);
    setStep(0);
    setMethod(null);
    setContact('');
    setOtp('');
  };

  const closeModal = () => {
    setIsOpen(false);
    setStep(0);
    setMethod(null);
    setContact('');
    setOtp('');
    setConfirmationResult(null);
    
    // cleaning up reCAPTCHA
    cleanupRecaptcha();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // initializing reCAPTCHA with proper cleanup
  const initializeRecaptcha = () => {
    if (!auth) {
      console.error('Auth not initialized');
      return null;
    }

    try {
      // cleaning up any existing verifier first
      cleanupRecaptcha();
      
      // creating new container ID for each initialization
      const containerId = 'recaptcha-container-' + Date.now();
      recaptchaContainerRef.current = containerId;

      // ensuring the container exists in DOM
      let container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.style.display = 'none';
        document.body.appendChild(container);
      }

      console.log('Creating reCAPTCHA verifier with container:', containerId);

      const verifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: (response) => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          alert('reCAPTCHA expired. Please try again.');
          cleanupRecaptcha();
        },
        'error-callback': (error) => {
          console.error('reCAPTCHA error:', error);
          alert('reCAPTCHA error. Please refresh and try again.');
          cleanupRecaptcha();
        }
      });

      recaptchaVerifierRef.current = verifier;
      console.log('reCAPTCHA verifier created successfully');
      return verifier;
    } catch (error) {
      console.error('Failed to initialize reCAPTCHA:', error);
      return null;
    }
  };

  const handleSendOTP = async () => {
    if (!auth) {
      alert('Authentication not initialized. Please refresh the page.');
      return;
    }

    // Validate phone number format
    if (!contact || !/^\+\d{10,15}$/.test(contact)) {
      alert("Please enter a valid phone number in international format (e.g., +27123456789)");
      return;
    }

    setIsLoading(true);
    
    try {
      // Always create a fresh reCAPTCHA verifier
      const verifier = initializeRecaptcha();
      if (!verifier) {
        throw new Error('Failed to initialize reCAPTCHA');
      }

      console.log('Sending OTP to:', contact);
      
      // Send OTP
      const result = await signInWithPhoneNumber(auth, contact, verifier);
      setConfirmationResult(result);
      console.log('OTP sent successfully');
      setStep(2);
      
    } catch (error) {
      console.error("OTP Send Error:", error);
      
      let errorMessage = 'Failed to send OTP. ';
      
      switch (error.code) {
        case 'auth/invalid-phone-number':
          errorMessage += 'Please check your phone number format.';
          break;
        case 'auth/too-many-requests':
          errorMessage += 'Too many requests. Please try again later.';
          break;
        case 'auth/captcha-check-failed':
          errorMessage += 'Domain verification failed. Please ensure your domain is authorized in Firebase Console.';
          break;
        case 'auth/invalid-app-credential':
          errorMessage += 'App credentials are invalid. Please check your Firebase configuration.';
          break;
        case 'auth/unauthorized-domain':
          errorMessage += 'This domain is not authorized. Please add it to your Firebase console.';
          break;
        default:
          errorMessage += error.message || 'Please try again.';
      }
      
      alert(errorMessage);
      
      // Clean up on error
      cleanupRecaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!confirmationResult) {
      alert('No OTP request found. Please request OTP again.');
      return;
    }

    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      console.log('User verified:', result.user);
      setStep(3);
    } catch (error) {
      console.error('OTP verification error:', error);
      
      let errorMessage = 'Verification failed. ';
      switch (error.code) {
        case 'auth/invalid-verification-code':
          errorMessage = 'Invalid verification code. Please check and try again.';
          break;
        case 'auth/code-expired':
          errorMessage = 'Verification code has expired. Please request a new one.';
          break;
        default:
          errorMessage += 'Please try again.';
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const handleConnectWallet = async () => {
    setIsLoading(true);
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    closeModal();
    alert('Wallet connected successfully!');
  };

  const isContactValid = method === 'email'
    ? contact.includes('@') && contact.includes('.')
    : /^\+\d{10,15}$/.test(contact);
  
  const isOTPValid = otp.length === 6 && /^\d{6}$/.test(otp);

  const getModalTitle = () => {
    switch (step) {
      case 0: return 'Choose Method';
      case 1: return method === 'email' ? 'Enter Email' : 'Enter Phone Number';
      case 2: return 'Verify OTP';
      case 3: return 'Connect Wallet';
      default: return 'Connect';
    }
  };

  const getModalDescription = () => {
    switch (step) {
      case 1: 
        return method === 'email' 
          ? 'Enter your email address to get started with wallet connection.'
          : 'Enter your phone number to get started with wallet connection.';
      default: return '';
    }
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      {/* Dynamic reCAPTCHA container */}
      <div 
        id={recaptchaContainerRef.current} 
        style={{ display: 'none' }}
      ></div>
      <button
        onClick={openModal}
        className="flex items-center bg-[#346f8f] hover:bg-[#185371] dark:bg-[#346f8f] dark:hover:bg-[#35677c] px-6 py-3 text-white font-medium rounded-full transition-all duration-300"
      >
        <AiFillPlayCircle className="mr-2 text-xl" />
        Connect
      </button>

      {/* Modal */}
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
                  {getModalTitle()}
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
                {step === 0 && (
                  <div className="space-y-4 text-center">
                    <p className="text-base text-gray-600 dark:text-gray-300">
                      How would you like to connect?
                    </p>
                    <div className="flex justify-center gap-4">
                      <button 
                        onClick={() => {
                          setMethod('email');
                          setStep(1);
                        }}
                        className="px-5 py-2.5 bg-[#346f8f] text-white rounded-lg hover:bg-[#185371] transition-all"
                      >
                        With Email
                      </button>
                      <button
                        onClick={() => {
                          setMethod('phone');
                          setStep(1);
                        }}
                        className="px-5 py-2.5 bg-[#346f8f] text-white rounded-lg hover:bg-[#185371] transition-all"
                      >
                        With Phone
                      </button>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <p className="text-base text-gray-600 dark:text-gray-300">
                      {getModalDescription()}
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {method === 'email' ? 'Email Address' : 'Phone Number'}
                      </label>
                      <input
                        type={method === 'email' ? 'email' : 'tel'}
                        value={contact}                          
                        onChange={(e) => setContact(e.target.value)}
                        placeholder={method === 'email' ? 'Enter your email' : 'e.g. +27123456789'}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#346f8f] focus:border-transparent backdrop-blur-sm transition-all duration-200"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <p className="text-base text-gray-600 dark:text-gray-300">
                      We've sent a verification code to <strong>{contact}</strong>. Please enter the 6-digit code below.
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
                      Your {method} has been verified successfully. You can now connect your wallet to continue.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200/20 dark:border-gray-600/20 relative z-10">
                {step === 1 && (
                  <>
                    <button
                      onClick={() => setStep(0)}
                      className="px-5 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 transition-all duration-200 backdrop-blur-sm"
                    >
                      Back
                    </button>
                    <button
                      onClick={method === 'phone' ? handleSendOTP : () => setStep(2)}
                      disabled={!isContactValid || isLoading}
                      className="px-5 py-2.5 text-sm font-medium text-white bg-[#346f8f] hover:bg-[#185371] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg focus:ring-4 focus:ring-blue-300 transition-all duration-200 flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          {method === 'phone' ? 'Sending...' : 'Processing...'}
                        </>
                      ) : (
                        method === 'phone' ? 'Send OTP' : 'Continue'
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
                      onClick={method === 'phone' ? handleVerifyOTP : () => setStep(3)}
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