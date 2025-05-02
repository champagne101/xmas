"use client"

import { useState } from "react"

const stepContents = [
  {
    title: "Connect Your Wallet",
    description: "Start by connecting your wallet to access your account information and balances.",
  },
  {
    title: "View Balances",
    description: "After connecting, you'll see your ETH balance, UZAR balance, and current allowance.",
  },
  {
    title: "Approve UZAR",
    description:
      "Approve the UZAR tokens you'll be spending. This will update your allowance and requires wallet confirmation.",
  },
  {
    title: "Deposit UZAR",
    description: "Deposit your UZAR (default amount is 0.1 UZAR). After completion, you'll receive a proof string.",
  },
  {
    title: "Withdraw UZAR",
    description: "To withdraw, paste the proof string from your deposit. The UZAR will be added back to your balance.",
  },
]

const StepButton = ({ disabled, onClick, children, isDarkMode }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`
      flex items-center justify-center px-6 py-3 text-base font-medium rounded-full 
      transition-all duration-300 transform hover:scale-105 shadow-md
      ${
        isDarkMode
          ? "bg-[#4681ee] hover:bg-[#3671de] disabled:bg-[#4681ee]/40 shadow-[#4681ee]/20"
          : "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400/60 shadow-indigo-500/20"
      }
      text-white disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
    `}
  >
    {children}
  </button>
)

const StepsProgress = ({ isDarkMode = true }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  const updateStep = (direction) => {
    setCurrentStep((prev) => (direction === "next" ? Math.min(prev + 1, totalSteps) : Math.max(prev - 1, 1)))
  }

  const calculateProgress = () => {
    return `${((currentStep - 1) / (totalSteps - 1)) * 100}%`
  }

  return (
    <div
      className={`
      w-full p-8 rounded-xl backdrop-blur-sm shadow-lg transition-all duration-300
      ${
        isDarkMode ? "bg-white/5 border border-white/10 text-white" : "bg-white/80 border border-gray-200 text-gray-900"
      }
    `}
    >
      <h2 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        How It Works
      </h2>

      {/* Steps Progress Bar */}
      <div className="relative flex items-center justify-between mb-10 px-4">
        {[...Array(totalSteps)].map((_, index) => {
          const isActive = index + 1 <= currentStep
          const isCurrent = index + 1 === currentStep

          return (
            <div
              key={index + 1}
              className={`
                relative z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full 
                transition-all duration-300 
                ${isCurrent && "animate-pulse"}
                ${
                  isActive
                    ? isDarkMode
                      ? "bg-[#4681ee] text-white shadow-lg shadow-[#4681ee]/30"
                      : "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : isDarkMode
                      ? "bg-white/10 text-white/60 border border-white/20"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                }
              `}
            >
              {index + 1}

              {/* Step label below the circle */}
              <span
                className={`
                absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap
                ${isDarkMode ? "text-white/70" : "text-gray-500"}
                ${isCurrent && (isDarkMode ? "text-white" : "text-gray-800 font-medium")}
              `}
              >
                Step {index + 1}
              </span>
            </div>
          )
        })}

        {/* Progress Bar */}
        <div className={`absolute w-full h-1 top-5 md:top-6 ${isDarkMode ? "bg-white/10" : "bg-gray-200"} -z-0`}>
          <div
            className={`h-full transition-all duration-500 ease-in-out ${
              isDarkMode ? "bg-[#4681ee]" : "bg-indigo-600"
            }`}
            style={{ width: calculateProgress() }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div
        className={`
        mb-8 text-center p-6 rounded-xl min-h-[160px] flex flex-col items-center justify-center
        ${isDarkMode ? "bg-white/5 border border-white/10" : "bg-white border border-gray-100 shadow-sm"}
      `}
      >
        <h3 className={`text-xl md:text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          {stepContents[currentStep - 1].title}
        </h3>
        <p className={`text-base max-w-2xl ${isDarkMode ? "text-white/80" : "text-gray-600"}`}>
          {stepContents[currentStep - 1].description}
        </p>
      </div>

      {/* Action Button Example */}
      {currentStep === 3 && (
        <div className="mb-8 flex justify-center">
          <button
            className={`
            w-full max-w-md py-3 px-6 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md
            ${
              isDarkMode
                ? "bg-[#4681ee] hover:bg-[#3671de] text-white shadow-[#4681ee]/20"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20"
            }
          `}
          >
            Approve UZAR
          </button>
        </div>
      )}

      {currentStep === 4 && (
        <div className="mb-8 flex justify-center">
          <button
            className={`
            w-full max-w-md py-3 px-6 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md
            ${
              isDarkMode
                ? "bg-green-600 hover:bg-green-700 text-white shadow-green-500/20"
                : "bg-green-600 hover:bg-green-700 text-white shadow-green-500/20"
            }
          `}
          >
            Deposit UZAR
          </button>
        </div>
      )}

      {currentStep === 5 && (
        <div className="mb-8 flex flex-col items-center gap-4">
          <div
            className={`
            w-full max-w-md rounded-xl p-4
            ${
              isDarkMode
                ? "bg-white/5 border border-white/10 shadow-inner"
                : "bg-gray-50 border border-gray-200 shadow-inner"
            }
          `}
          >
            <p className={`${isDarkMode ? "text-white/60" : "text-gray-500"} mb-1 text-sm`}>Paste your proof here...</p>
          </div>
          <button
            className={`
            w-full max-w-md py-3 px-6 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md
            ${
              isDarkMode
                ? "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20"
                : "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20"
            }
          `}
          >
            Withdraw UZAR
          </button>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <StepButton disabled={currentStep === 1} onClick={() => updateStep("prev")} isDarkMode={isDarkMode}>
          Previous
        </StepButton>
        <StepButton disabled={currentStep === totalSteps} onClick={() => updateStep("next")} isDarkMode={isDarkMode}>
          Next
        </StepButton>
      </div>
    </div>
  )
}

export default StepsProgress
