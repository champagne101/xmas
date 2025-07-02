"use client"

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

// const { ethereum } = window;

const createEthereumContract = () => {
   if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Ethereum object not found. Make sure MetaMask is installed.");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({ addressTo: "", amount: "", account: "", country: "", currency: "", referenceId: "", walletId: "", callbackUrl: "https://example.com"});
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(null);
  // const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);

   useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCount = localStorage.getItem("transactionCount");
      setTransactionCount(storedCount);
    }
  }, []);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const transactionsContract = createEthereumContract();

        const availableTransactions = await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
          account: transaction.account,
          country: transaction.country,
          amount: parseInt(transaction.amount._hex) / (10 ** 18),
          currency: transaction.currency,
          referenceId: transaction.referenceId,
          walletId: transaction.walletId,
          callbackUrl: transaction.callbackUrl
        }));

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        console.log("Please install MetaMask.");
        return;
      }

      const accounts = await window.ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const transactionsContract = createEthereumContract();
        const currentTransactionCount = await transactionsContract.getTransactionCount();

        window.localStorage.setItem("transactionCount", currentTransactionCount);
      }
    } catch (error) {
      console.log(error);

      // throw new Error("No ethereum object");
      console.error("checkIfWalletExists error:", error);

    }
  };

  const connectWallet = async () => {
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);

      // throw new Error("No ethereum object");
      console.error("checkConnectWallet error:", error);

    }
  };

  const sendTransaction = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const { addressTo, amount, account, country, currency, referenceId, walletId, callbackUrl } = formData;
        const transactionsContract = createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [{
            from: currentAccount,
            to: addressTo,
            gas: "0x5208",
            value: parsedAmount._hex,
          }],
        });

        const transactionHash = await transactionsContract.onRampBlockchain(
          addressTo, parsedAmount, account, country, currency, referenceId, walletId, callbackUrl);


        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount = await transactionsContract.getTransactionCount();

        setTransactionCount(transactionsCount.toNumber());
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      // throw new Error("No ethereum object");
      console.error("checkIfTransactionsExists error:", error);

    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      checkIfWalletIsConnect();
      checkIfTransactionsExists();
    }
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};