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

const StepButton = ({ disabled, onClick, children }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`
      flex items-center justify-center px-6 py-3 text-base font-medium rounded-full 
      transition-all duration-300 transform hover:scale-105 shadow-md
      bg-[#346f8f] hover:bg-[#185371] disabled:bg-[#346f8f]/40 shadow-[#346f8f]/20
      dark:bg-[#346f8f] dark:hover:bg-[#35677c] dark:disabled:bg-[#346f8f]/40 dark:shadow-[#346f8f]/20
      text-white disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
    `}
  >
    {children}
  </button>
)

const StepsProgress = () => {
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
      bg-white/10 border border-gray-200 text-[#346f8f]
      dark:bg-white/5 dark:border dark:border-white/10 dark:text-white
    `} 
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-[#346f8f] dark:text-white">
        How It Works
      </h2>

      {/* steps progress bar */}
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
                    ? "bg-[#346f8f] text-white shadow-lg shadow-[#346f8f]/30 dark:bg-[#346f8f] dark:text-white dark:shadow-lg dark:shadow-[#346f8f]/30"
                    : "bg-gray-100 text-gray-400 border border-gray-200 dark:bg-white/10 dark:text-white/60 dark:border-white/20"
                }
              `}
            >
              {index + 1}

              {/* step label below the circle */}
              <span
                className={`
                absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap
                text-[#346f8f]/70 dark:text-white/70
                ${isCurrent && "text-[#346f8f] font-medium dark:text-white"}
              `}
              >
                Step {index + 1}
              </span>
            </div>
          )
        })}

        {/* progress bar */}
        <div className="absolute w-full h-1 top-5 md:top-6 bg-gray-200 dark:bg-white/10 -z-0">
          <div
            className="h-full transition-all duration-500 ease-in-out bg-[#346f8f] dark:bg-[#346f8f]"
            style={{ width: calculateProgress() }}
          />
        </div>
      </div>

      {/* step content */}
      <div
        className="
        mb-8 text-center p-6 rounded-xl min-h-[160px] flex flex-col items-center justify-center
        bg-gray-50 border border-gray-100 shadow-sm dark:bg-white/5 dark:border dark:border-white/10
      "
      >
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-[#346f8f] dark:text-white">
          {stepContents[currentStep - 1].title}
        </h3>
        <p className="text-base max-w-2xl text-black dark:text-white/80">
          {stepContents[currentStep - 1].description}
        </p>
      </div>

      {/* action button example */}
      {currentStep === 3 && (
        <div className="mb-8 flex justify-center">
          <button
            className="
            w-full max-w-md py-3 px-6 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md
            bg-[#346f8f] hover:bg-[#185371] text-white shadow-[#346f8f]/20
            dark:bg-[#346f8f] dark:hover:bg-[#3671de] dark:text-white dark:shadow-[#346f8f]/20
          "
          >
            Approve UZAR
          </button>
        </div>
      )}

      {currentStep === 4 && (
        <div className="mb-8 flex justify-center">
          <button
            className="
            w-full max-w-md py-3 px-6 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md
            bg-green-600 hover:bg-green-700 text-white shadow-green-500/20
            dark:bg-green-600 dark:hover:bg-green-700 dark:text-white dark:shadow-green-500/20
          "
          >
            Deposit UZAR
          </button>
        </div>
      )}

      {currentStep === 5 && (
        <div className="mb-8 flex flex-col items-center gap-4">
          <div
            className="
            w-full max-w-md rounded-xl p-4
            bg-gray-50 border border-gray-200 shadow-inner
            dark:bg-white/5 dark:border dark:border-white/10 dark:shadow-inner
          "
          >
            <p className="text-[#346f8f]/60 dark:text-white/60 mb-1 text-sm">Paste your proof here...</p>
          </div>
          <button
            className="
            w-full max-w-md py-3 px-6 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md
            bg-red-600 hover:bg-red-700 text-white shadow-red-500/20
            dark:bg-red-600 dark:hover:bg-red-700 dark:text-white dark:shadow-red-500/20
          "
          >
            Withdraw UZAR
          </button>
        </div>
      )}

      {/* nav buttons */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <StepButton disabled={currentStep === 1} onClick={() => updateStep("prev")}>
          Previous
        </StepButton>
        <StepButton disabled={currentStep === totalSteps} onClick={() => updateStep("next")}>
          Next
        </StepButton>
      </div>
    </div>
  )
}

export default StepsProgress