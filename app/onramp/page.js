'use client'

import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaCheck, FaSpinner } from "react-icons/fa";

const OnrampPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [formData, setFormData] = useState({
    bankName: "",
    bankAccountNumber: "",
    selectedChain: "",
    selectedToken: "",
    cryptoAmount: "",
    fiatAmount: "",
    contactInfo: "",
    otp: "",
  });

  const banks = [
    "FNB - First National Bank",
    "Standard Bank",
    "ABSA Bank",
    "Nedbank",
    "Capitec Bank",
    "Investec",
    "African Bank",
    "Discovery Bank",
    "TymeBank",
    "Bank Zero"
  ];

  const chains = [
    "Lisk",
  ];

  const tokens = [
    "UZAR",
    "USDT",
    "USDC"
  ];

  const exchangeRates = {
    UZAR: 1,
    USDT: 18.12,
  };

  const updateFormData = (field, value) => {
    const newData = { ...formData, [field]: value };
    
    // auto-calculating fiat amount when crypto amount or token changes
    if (field === "cryptoAmount" || field === "selectedToken") {
      if (newData.cryptoAmount && newData.selectedToken && exchangeRates[newData.selectedToken]) {
        newData.fiatAmount = (parseFloat(newData.cryptoAmount) * exchangeRates[newData.selectedToken]).toFixed(2);
      }
    }
    
    setFormData(newData);
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.bankName && formData.bankAccountNumber.length >= 10;
      case 2:
        return formData.selectedChain && formData.selectedToken && formData.cryptoAmount && parseFloat(formData.cryptoAmount) > 0;
      case 3:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
        return emailRegex.test(formData.contactInfo) || phoneRegex.test(formData.contactInfo);
      case 4:
        return formData.otp.length === 6 && /^\d{6}$/.test(formData.otp);
      case 5:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleProceed = () => {
    setShowProcessingModal(true);
    setTimeout(() => {
      setShowProcessingModal(false);
      window.location.href = "/";
    }, 3000);
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                step <= currentStep
                  ? "bg-gradient-to-r from-[#346f8f] to-[#185371] text-white shadow-lg"
                  : "bg-[#d8dede]/50 dark:bg-[#244f6b]/50 text-[#346f8f]/50 dark:text-[#fafcfe]/50"
              }`}
            >
              {step < currentStep ? <FaCheck size={20} /> : step}
            </div>
            {step < 5 && (
              <div
                className={`w-12 h-1 mx-2 transition-all duration-300 rounded-full ${
                  step < currentStep
                    ? "bg-gradient-to-r from-[#346f8f] to-[#185371]"
                    : "bg-[#d8dede]/50 dark:bg-[#244f6b]/50"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#346f8f] dark:text-[#fafcfe] mb-2">
          Enter Your Bank Account Info
        </h2>
        <p className="text-[#346f8f]/70 dark:text-white/70 mb-6">
          Please provide your banking details for the off-ramp transaction.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#346f8f] dark:text-[#fafcfe] mb-2">
            Bank Name
          </label>
          <select
            value={formData.bankName}
            onChange={(e) => updateFormData("bankName", e.target.value)}
            className="w-full bg-white/80 dark:bg-[#244f6b]/60 backdrop-blur-sm border border-[#346f8f]/20 dark:border-[#fafcfe]/20 rounded-xl px-4 py-3 text-[#346f8f] dark:text-[#fafcfe] focus:ring-2 focus:ring-[#346f8f]/40 dark:focus:ring-[#fafcfe]/40 focus:border-transparent transition-all duration-300"
          >
            <option value="">Select your bank</option>
            {banks.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#346f8f] dark:text-[#fafcfe] mb-2">
            Bank Account Number
          </label>
          <input
            type="text"
            value={formData.bankAccountNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              updateFormData("bankAccountNumber", value);
            }}
            placeholder="Enter your account number"
            className="w-full bg-white/80 dark:bg-[#244f6b]/60 backdrop-blur-sm border border-[#346f8f]/20 dark:border-[#fafcfe]/20 rounded-xl px-4 py-3 text-[#346f8f] dark:text-[#fafcfe] placeholder-[#346f8f]/50 dark:placeholder-[#fafcfe]/50 focus:ring-2 focus:ring-[#346f8f]/40 dark:focus:ring-[#fafcfe]/40 focus:border-transparent transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#346f8f] dark:text-[#fafcfe] mb-2">
          Choose Off-ramp Amount and Token
        </h2>
        <p className="text-[#346f8f]/70 dark:text-white/70 mb-6">
          Select the blockchain, token, and amount you want to convert to ZAR.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#346f8f] dark:text-[#fafcfe] mb-2">
            Select Chain
          </label>
          <select
            value={formData.selectedChain}
            onChange={(e) => updateFormData("selectedChain", e.target.value)}
            className="w-full bg-white/80 dark:bg-[#244f6b]/60 backdrop-blur-sm border border-[#346f8f]/20 dark:border-[#fafcfe]/20 rounded-xl px-4 py-3 text-[#346f8f] dark:text-[#fafcfe] focus:ring-2 focus:ring-[#346f8f]/40 dark:focus:ring-[#fafcfe]/40 focus:border-transparent transition-all duration-300"
          >
            <option value="">Select chain</option>
            {chains.map((chain) => (
              <option key={chain} value={chain}>
                {chain}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#346f8f] dark:text-[#fafcfe] mb-2">
            Select Token
          </label>
          <select
            value={formData.selectedToken}
            onChange={(e) => updateFormData("selectedToken", e.target.value)}
            className="w-full bg-white/80 dark:bg-[#244f6b]/60 backdrop-blur-sm border border-[#346f8f]/20 dark:border-[#fafcfe]/20 rounded-xl px-4 py-3 text-[#346f8f] dark:text-[#fafcfe] focus:ring-2 focus:ring-[#346f8f]/40 dark:focus:ring-[#fafcfe]/40 focus:border-transparent transition-all duration-300"
          >
            <option value="">Select token</option>
            {tokens.map((token) => (
              <option key={token} value={token}>
                {token}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#346f8f] dark:text-[#fafcfe] mb-2">
          Enter Crypto Amount
        </label>
        <input
          type="text"
          step="0.01"
          min="0"
          value={formData.cryptoAmount}
          onChange={(e) => updateFormData("cryptoAmount", e.target.value)}
          placeholder="0.00"
          className="w-full bg-white/80 dark:bg-[#244f6b]/60 backdrop-blur-sm border border-[#346f8f]/20 dark:border-[#fafcfe]/20 rounded-xl px-4 py-3 text-[#346f8f] dark:text-[#fafcfe] placeholder-[#346f8f]/50 dark:placeholder-[#fafcfe]/50 focus:ring-2 focus:ring-[#346f8f]/40 dark:focus:ring-[#fafcfe]/40 focus:border-transparent transition-all duration-300"
        />
      </div>

      {formData.fiatAmount && (
        <div className="bg-[#d8dede]/30 dark:bg-[#244f6b]/20 backdrop-blur-sm p-4 rounded-xl border border-[#346f8f]/20 dark:border-[#fafcfe]/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#346f8f]/70 dark:text-white/70">
              You Will Receive (in ZAR):
            </span>
            <span className="text-lg font-bold text-[#346f8f] dark:text-[#fafcfe]">
              R {formData.fiatAmount}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#346f8f] dark:text-[#fafcfe] mb-2">
          Verify Your Contact Information
        </h2>
        <p className="text-[#346f8f]/70 dark:text-white/70 mb-6">
          Enter your email address or South African phone number for verification.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#346f8f] dark:text-[#fafcfe] mb-2">
          Email or Phone Number
        </label>
        <input
          type="text"
          value={formData.contactInfo}
          onChange={(e) => updateFormData("contactInfo", e.target.value)}
          placeholder="example@email.com or +27123456789"
          className="w-full bg-white/80 dark:bg-[#244f6b]/60 backdrop-blur-sm border border-[#346f8f]/20 dark:border-[#fafcfe]/20 rounded-xl px-4 py-3 text-[#346f8f] dark:text-[#fafcfe] placeholder-[#346f8f]/50 dark:placeholder-[#fafcfe]/50 focus:ring-2 focus:ring-[#346f8f]/40 dark:focus:ring-[#fafcfe]/40 focus:border-transparent transition-all duration-300"
        />
        <p className="text-xs text-[#346f8f]/50 dark:text-[#fafcfe]/50 mt-2">
          Valid email format or SA phone number (+27XXXXXXXXX or 0XXXXXXXXX)
        </p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#346f8f] dark:text-[#fafcfe] mb-2">
          Enter One-Time Password (OTP)
        </h2>
        <p className="text-[#346f8f]/70 dark:text-white/70 mb-6">
          We've sent a 6-digit verification code to {formData.contactInfo}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#346f8f] dark:text-[#fafcfe] mb-2">
          6-Digit OTP
        </label>
        <input
          type="text"
          value={formData.otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 6);
            updateFormData("otp", value);
          }}
          placeholder="000000"
          maxLength="6"
          className="w-full bg-white/80 dark:bg-[#244f6b]/60 backdrop-blur-sm border border-[#346f8f]/20 dark:border-[#fafcfe]/20 rounded-xl px-4 py-3 text-[#346f8f] dark:text-[#fafcfe] placeholder-[#346f8f]/50 dark:placeholder-[#fafcfe]/50 focus:ring-2 focus:ring-[#346f8f]/40 dark:focus:ring-[#fafcfe]/40 focus:border-transparent transition-all duration-300 text-center text-2xl tracking-widest"
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#346f8f] dark:text-[#fafcfe] mb-2">
          Review and Confirm Transaction
        </h2>
        <p className="text-[#346f8f]/70 dark:text-white/70 mb-6">
          Please review your transaction details before proceeding.
        </p>
      </div>

      <div className="bg-[#d8dede]/30 dark:bg-[#244f6b]/20 backdrop-blur-sm p-6 rounded-xl border border-[#346f8f]/20 dark:border-[#fafcfe]/20 space-y-4">
        <h3 className="text-lg font-semibold text-[#346f8f] dark:text-[#fafcfe] mb-4">
          Transaction Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-[#346f8f]/70 dark:text-white/70">Bank:</span>
            <p className="font-medium text-[#346f8f] dark:text-[#fafcfe]">{formData.bankName}</p>
          </div>
          <div>
            <span className="text-sm text-[#346f8f]/70 dark:text-white/70">Account:</span>
            <p className="font-medium text-[#346f8f] dark:text-[#fafcfe]">***{formData.bankAccountNumber.slice(-4)}</p>
          </div>
          <div>
            <span className="text-sm text-[#346f8f]/70 dark:text-white/70">Chain:</span>
            <p className="font-medium text-[#346f8f] dark:text-[#fafcfe]">{formData.selectedChain}</p>
          </div>
          <div>
            <span className="text-sm text-[#346f8f]/70 dark:text-white/70">Token:</span>
            <p className="font-medium text-[#346f8f] dark:text-[#fafcfe]">{formData.selectedToken}</p>
          </div>
          <div>
            <span className="text-sm text-[#346f8f]/70 dark:text-white/70">Crypto Amount:</span>
            <p className="font-medium text-[#346f8f] dark:text-[#fafcfe]">{formData.cryptoAmount} {formData.selectedToken}</p>
          </div>
          <div>
            <span className="text-sm text-[#346f8f]/70 dark:text-white/70">You'll Receive:</span>
            <p className="font-bold text-[#346f8f] dark:text-[#fafcfe] text-lg">R {formData.fiatAmount}</p>
          </div>
        </div>

        <div className="border-t border-[#346f8f]/20 dark:border-[#fafcfe]/20 pt-4">
          <span className="text-sm text-[#346f8f]/70 dark:text-white/70">Contact:</span>
          <p className="font-medium text-[#346f8f] dark:text-[#fafcfe]">{formData.contactInfo}</p>
        </div>
      </div>
    </div>
  );

  const renderProcessingModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white/95 dark:bg-[#244f6b]/95 backdrop-blur-sm border border-[#346f8f]/20 dark:border-[#fafcfe]/20 rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <FaSpinner className="w-12 h-12 text-[#346f8f] dark:text-[#fafcfe] animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-[#346f8f] dark:text-[#fafcfe]">
            Processing Your Transaction...
          </h3>
          <p className="text-[#346f8f]/70 dark:text-white/70">
            Please wait while we process your off-ramp request.
          </p>
          <div className="w-full bg-[#d8dede]/50 dark:bg-[#244f6b]/50 rounded-full h-2">
            <div className="bg-gradient-to-r from-[#346f8f] to-[#185371] h-2 rounded-full animate-pulse" style={{ width: "70%" }} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNavigationButtons = () => (
    <div className="flex justify-between mt-8">
      <button
        onClick={prevStep}
        disabled={currentStep === 1}
        className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
          currentStep === 1
            ? "bg-[#d8dede]/50 dark:bg-[#244f6b]/50 text-[#346f8f]/50 dark:text-[#fafcfe]/50 cursor-not-allowed"
            : "bg-[#d8dede]/80 dark:bg-[#244f6b]/80 text-[#346f8f] dark:text-[#fafcfe] hover:bg-[#d8dede] dark:hover:bg-[#244f6b] transform hover:scale-105"
        }`}
      >
        <FaChevronLeft size={20} className="mr-2" />
        Previous
      </button>

      {currentStep < 5 ? (
        <button
          onClick={nextStep}
          disabled={!validateStep(currentStep)}
          className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            validateStep(currentStep)
              ? "bg-gradient-to-r from-[#346f8f] to-[#185371] text-white hover:from-[#185371] hover:to-[#346f8f] transform hover:scale-105 shadow-lg"
              : "bg-[#d8dede]/50 dark:bg-[#244f6b]/50 text-[#346f8f]/50 dark:text-[#fafcfe]/50 cursor-not-allowed"
          }`}
        >
          Next
          <FaChevronRight size={20} className="ml-2" />
        </button>
      ) : (
        <button
          onClick={handleProceed}
          className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Proceed
          <FaChevronRight size={20} className="ml-2" />
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d8dede] via-[#d8dede] to-[#b8c8c8] dark:from-[#244f6b] dark:via-[#1a3a52] dark:to-[#0f2837] pt-8 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#346f8f] dark:text-white mb-2">
            Offramp Crypto
          </h2>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderStepIndicator()}
        
        <div className="bg-white/60 dark:bg-[#244f6b]/40 backdrop-blur-xl border border-[#346f8f]/20 dark:border-[#fafcfe]/20 rounded-3xl p-8 shadow-2xl">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          
          {renderNavigationButtons()}
        </div>
      </div>

      {showProcessingModal && renderProcessingModal()}
    </div>
  );
};

export default OnrampPage;