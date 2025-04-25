import React, { useContext, useState, useEffect } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { FaUserShield, FaLock, FaWifi, FaShieldAlt, FaDollarSign, FaBook } from "react-icons/fa";
import fs from "fs"; 

//import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";
import { Loader } from ".";
import $u from '../utils/$u.js';
import { ethers } from "ethers";
import wc from "../circuit/witness_calculator.js";
import tornadoJSON from "../json/Tornado.json";
import UzarTokenABI from "../json/abizar.json";

import QRCode from "qrcode";
// import QrReader from "react-qr-reader";


const UZAR_TOKEN_ADDRESS = "0xBf715EB900bbEAa2C7e136E9c2A0C6AED93E8aeb"; // lisk sepolia // '0x5315E2c1B45f58c468dE6a31eBF8ae9f06790F32'; sepolia eth 11155111
const CONTRACT_ADDRESS = "0x46c321234896293Fae383C9768b338902db6B20E"; // lisk sepolia // "0x2836692157Dd96cb74870a12210273983144Cf3C"; sepolia eth
const tornadoAddress = "0x46c321234896293Fae383C9768b338902db6B20E"; // lisk sepolia  // "0x2836692157Dd96cb74870a12210273983144Cf3C"; sepolia  eth
const tornadoABI = tornadoJSON.abi;
const tornadoInterface = new ethers.utils.Interface(tornadoABI);
const ButtonState = { Normal: 0, Loading: 1, Disabled: 2 };
const companyCommonStyles = "bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl transition-all duration-300 p-4 flex items-center justify-center flex-col h-32";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent  border-none text-sm white-glassmorphism"
  />
);



// const WalletCard = ({ account, uzarBalance }) => {
//   const [isHovered, setIsHovered] = useState(false);
  
//   return (
//     <div 
//       className="relative w-72 h-44 rounded-xl overflow-hidden transition-transform duration-700 ease-in-out hover:rotate-3"
//       style={{
//         background: 'linear-gradient(135deg, rgba(70, 129, 238, 0.7) 0%, rgba(54, 113, 222, 0.7) 100%)',
//         backdropFilter: 'blur(8px)',
//         boxShadow: '0 8px 32px rgba(70, 129, 238, 0.2)'
//       }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      
//       <div className="relative p-6 h-full flex flex-col justify-between">
//         <div className="flex justify-between items-start">
//           <CreditCard className="h-8 w-8 text-white" />
//           <Info className="h-5 w-5 text-white/70 hover:text-white cursor-pointer transition-colors" />
//         </div>
        
//         <div className={`transition-all duration-700 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-90'}`}>
//           {account ? (
//             <>
//               <div className="mb-1">
//                 <div className="text-sm text-white/70">{account.address.slice(0, 12)}...</div>
//                 <div className="text-sm text-white/70">{account.balance.slice(0, 10)}{account.balance.length > 10 ? "..." : ""} ETH</div>
//               </div>
//               <div className="text-2xl font-bold text-white mb-1">
//                 {uzarBalance} UZAR
//               </div>
//             </>
//           ) : (
//             <div className="text-2xl font-bold text-white mb-1">
//               0 UZAR
//             </div>
//           )}
//           <div className="text-xs text-white/70">
//             User Balance
//           </div>
//         </div>
//       </div>
      
//       <div className={`absolute inset-0 bg-white/5 transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
//     </div>
//   );
// };



const Welcome = () => {
  const [provider, setProvider] = useState(null);
  const [accounts, setAccount] = useState(null);
  const [uzarBalance, setUzarBalance] = useState("0");
  const [allowance, setAllowance] = useState("0");
  const [uzarToken, setUzarToken] = useState(null);
  const [contract, setContract] = useState(null);



  const [account, updateAccount] = useState(null);
  const [proofElements, updateProofElements] = useState(null);
  const [proofStringEl, updateProofStringEl] = useState(null);
  const [textArea, updateTextArea] = useState(null);

  // interface states
  const [section, updateSection] = useState("Deposit");
  const [displayCopiedMessage, updateDisplayCopiedMessage] = useState(false);
  const [withdrawalSuccessful, updateWithdrawalSuccessful] = useState(false);
  const [metamaskButtonState, updateMetamaskButtonState] = useState(ButtonState.Normal);
  const [depositButtonState, updateDepositButtonState] = useState(ButtonState.Normal);
  const [withdrawButtonState, updateWithdrawButtonState] = useState(ButtonState.Normal);

  const [qrCodeURL, setQRCodeURL] = useState("");
  const [isScanned, setIsScanned] = useState(false); 



  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        const _provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(_provider);

        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const signer = _provider.getSigner();
          const userAccount = await signer.getAddress();
          setAccount(userAccount);

          const _contract = new ethers.Contract(CONTRACT_ADDRESS, tornadoABI, signer);
          setContract(_contract);

          const _uzarToken = new ethers.Contract(UZAR_TOKEN_ADDRESS, UzarTokenABI, signer);
          setUzarToken(_uzarToken);

          fetchBalance(_uzarToken, _contract, userAccount);
        } catch (err) {
          console.error("Error connecting to MetaMask:", err);
        }
      } else {
        alert("Please install MetaMask to use this app");
      }
    };

    init();
  }, []);

  const fetchBalance = async (uzarToken, contract, userAccount) => {
    try {
      const balance = await uzarToken.balanceOf(userAccount);
      setUzarBalance(ethers.utils.formatEther(balance));

      const _allowance = await uzarToken.allowance(userAccount, CONTRACT_ADDRESS);
      setAllowance(ethers.utils.formatEther(_allowance));
    } catch (err) {
      console.error("Error fetching UZAR balance or allowance:", err);
    }
  };

  const approveUzar = async () => {
    try {
      const amountToApprove = ethers.utils.parseEther("1000000"); // Amount to approve
      const tx = await uzarToken.approve(CONTRACT_ADDRESS, amountToApprove);
      await tx.wait(); // Wait for the transaction to be mined
      alert("UZAR approved successfully");
      fetchBalance(uzarToken, contract, account); // Refresh balance and allowance
    } catch (err) {
      console.error("Error approving UZAR:", err);
    }
  };
  


  const connectMetamask = async () => {
    try{
        updateMetamaskButtonState(ButtonState.Disabled);
        if(!window.ethereum){
            alert("Please install Metamask to use this app.");
            throw "no-metamask";
        }

        var accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        var chainId = window.ethereum.networkVersion;

        // if(chainId != "11155111"){
        //     alert("Please switch to Sepolia Testnet");
        //     throw "wrong-chain";
        // }

        var activeAccount = accounts[0];
        var balance = await window.ethereum.request({ method: "eth_getBalance", params: [activeAccount, "latest"] });
        balance = $u.moveDecimalLeft(ethers.BigNumber.from(balance).toString(), 18);

        var newAccountState = {
            chainId: chainId,
            address: activeAccount,
            balance: balance
        };
        updateAccount(newAccountState);
    }catch(e){
        console.log(e);
    }

    updateMetamaskButtonState(ButtonState.Normal);
  };

  const depositEther = async (amount) => {
    updateDepositButtonState(ButtonState.Disabled);
    try {
      const secret = ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString();
      const nullifier = ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString();
  
      const input = {
        secret: $u.BN256ToBin(secret).split(""),
        nullifier: $u.BN256ToBin(nullifier).split("")
      };
      console.log("Proof Input:", input);
  
      const res = await fetch("/deposit.wasm");
      const buffer = await res.arrayBuffer();
      const depositWC = await wc(buffer);
  
      const r = await depositWC.calculateWitness(input, 0);
      const commitment = r[1];
      const nullifierHash = r[2];
  
      //const { instance } = await loadWasm();
  
      const tx = {
        to: tornadoAddress,
        from: account.address,
        data: tornadoInterface.encodeFunctionData("deposit", [commitment]),
        maxFeePerGas: "10000000",
      };
  
      
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [tx],
      });
  
      console.log("Transaction sent. Hash:", txHash);
  
      // Wait for receipt
      let receipt = null;
      while (!receipt) {
        receipt = await window.ethereum.request({
          method: "eth_getTransactionReceipt",
          params: [txHash],
        });
  
        if (!receipt) {
          console.log("Waiting for the transaction receipt...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
  
      console.log("Transaction receipt received:", receipt);
  
      
      if (!receipt.logs || receipt.logs.length === 0) {
        throw new Error("No logs found in the transaction receipt.");
      }
  
      const log = receipt.logs[2];
      const decodeData = tornadoInterface.decodeEventLog("Deposit", log.data, log.topics);
      console.log("Decoded Event Data:", JSON.stringify(decodeData));

      const proofElements = {
        root: $u.BNToDecimal(decodeData.root),
        nullifierHash: `${nullifierHash}`,
        secret: secret,
        nullifier: nullifier,
        commitment: `${commitment}`,
        hashPairings: decodeData.hashPairings.map((n) => $u.BNToDecimal(n)),
        hashDirection: decodeData.pairDirection,
        txHash: txHash,
      };
  
      console.log("Proof Elements:", proofElements);
      updateProofElements(btoa(JSON.stringify(proofElements)));
      

      try {
        const canvas = document.createElement("canvas");
        await QRCode.toCanvas(canvas, (JSON.stringify(proofInput)), {
          // await QRCode.toCanvas(canvas, btoa(JSON.stringify(proofElements)), {
          errorCorrectionLevel: "L", 
          width: 300, 
        });

        const ctx = canvas.getContext("2d");

        
        const text = "20";
        ctx.font = "bold 40px Arial"; 
        ctx.fillStyle = "green"; 
        const textWidth = ctx.measureText(text).width;

        
        ctx.fillText(
          text,
          (canvas.width - textWidth) / 2,
          canvas.height / 2 + 10 
        );

       
        const qrCodeWithAmountURL = canvas.toDataURL();
        setQRCodeURL(qrCodeWithAmountURL);
      } catch (error) {
        console.error("Error generating QR Code with amount:", error);
      }
  
      

      
    } catch (e) {
      console.error("Error in depositEther:", e);
    } finally {
      updateDepositButtonState(ButtonState.Normal);
    }
  };
  


  const copyProof = () => {
      if(!!proofStringEl){
          flashCopiedMessage();
          navigator.clipboard.writeText(proofStringEl.innerHTML);
      }  
  };

  const withdraw = async () => {
    updateWithdrawButtonState(ButtonState.Disabled);

    if(!textArea || !textArea.value){ alert("Please input the proof of deposit string."); }

    try{
        const proofString = textArea.value;
        const proofElements = JSON.parse(atob(proofString));
        console.log("Proof Elements:",proofElements);

        receipt = await window.ethereum.request({ method: "eth_getTransactionReceipt", params: [proofElements.txHash] });
        if(!receipt){ throw "empty-receipt"; }

        const log = receipt.logs[2];
        const decodedData = tornadoInterface.decodeEventLog("Deposit", log.data, log.topics);

        const SnarkJS = window['snarkjs'];

        const proofInput = {
            "root": $u.BNToDecimal(decodedData.root),
            "nullifierHash": proofElements.nullifierHash,
            "recipient": $u.BNToDecimal(account.address),
            "secret": $u.BN256ToBin(proofElements.secret).split(""),
            "nullifier": $u.BN256ToBin(proofElements.nullifier).split(""),
            "hashPairings": decodedData.hashPairings.map((n) => ($u.BNToDecimal(n))),
            "hashDirections": decodedData.pairDirection
        };

        console.log("final proof",proofInput)

        const { proof, publicSignals } = await SnarkJS.groth16.fullProve(proofInput, "/withdraw.wasm", "/setup_final.zkey");

        const callInputs = [
            proof.pi_a.slice(0, 2).map($u.BN256ToHex),
            proof.pi_b.slice(0, 2).map((row) => ($u.reverseCoordinate(row.map($u.BN256ToHex)))),
            proof.pi_c.slice(0, 2).map($u.BN256ToHex),
            publicSignals.slice(0, 2).map($u.BN256ToHex)
        ];

        const callData = tornadoInterface.encodeFunctionData("withdraw", callInputs);
        const tx = {
            to: tornadoAddress,
            from: account.address,
            data: callData
        };
        const txHash = await window.ethereum.request({ method: "eth_sendTransaction", params: [tx] });

        var receipt;
        while(!receipt){
            receipt = await window.ethereum.request({ method: "eth_getTransactionReceipt", params: [txHash] });
            await new Promise((resolve, reject) => { setTimeout(resolve, 1000); });
        }

        if(!!receipt){ updateWithdrawalSuccessful(true); }
    }catch(e){
        console.log(e);
    }

    updateWithdrawButtonState(ButtonState.Normal);
  };



  const tester1 = async () => {
    updateWithdrawButtonState(ButtonState.Disabled);

    if(!textArea || !textArea.value){ alert("Please input the proof of deposit string."); }

    try {
        const proofString = textArea.value;
        const proofElements = JSON.parse(atob(proofString));
        console.log("Proof Elements:", proofElements);

        console.log("Root:", proofElements.root);
        console.log("Hash:", proofElements.nullifierHash);

        receipt = await window.ethereum.request({ method: "eth_getTransactionReceipt", params: [proofElements.txHash] });
        if(!receipt){ throw "empty-receipt"; }

        const log = receipt.logs[2];
        const decodedData = tornadoInterface.decodeEventLog("Deposit", log.data, log.topics);

        const SnarkJS = window['snarkjs'];

        const proofInput = {
            "root": $u.BNToDecimal(decodedData.root),
            "nullifierHash": proofElements.nullifierHash,
            "recipient": $u.BNToDecimal(account.address),
            "secret": $u.BN256ToBin(proofElements.secret).split(""),
            "nullifier": $u.BN256ToBin(proofElements.nullifier).split(""),
            "hashPairings": decodedData.hashPairings.map((n) => ($u.BNToDecimal(n))),
            "hashDirections": decodedData.pairDirection
        };

        console.log("final proof", proofInput);
        console.log("Nullifier Hash:", proofInput.nullifierHash);

        // Save proofInput to a JSON file
        const jsonBlob = new Blob([JSON.stringify(proofInput, null, 2)], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = jsonUrl;
        downloadLink.download = 'proofInput.json'; 
        downloadLink.click();
        
        const { proof, publicSignals } = await SnarkJS.groth16.fullProve(proofInput, "/withdraw.wasm", "/setup_final.zkey");

        const callInputs = [
            proof.pi_a.slice(0, 2).map($u.BN256ToHex),
            proof.pi_b.slice(0, 2).map((row) => ($u.reverseCoordinate(row.map($u.BN256ToHex)))),
            proof.pi_c.slice(0, 2).map($u.BN256ToHex),
            publicSignals.slice(0, 2).map($u.BN256ToHex)
        ];

        console.log("Proof data:", callInputs);

        var receipt;
        while(!receipt){
            receipt = await window.ethereum.request({ method: "eth_getTransactionReceipt", params: [txHash] });
            await new Promise((resolve, reject) => { setTimeout(resolve, 1000); });
        }

        if(!!receipt){ updateWithdrawalSuccessful(true); }

    } catch (e) {
        console.log(e);
    }

    updateWithdrawButtonState(ButtonState.Normal);
  };

  const tester = async () => {
    updateWithdrawButtonState(ButtonState.Disabled);

    if (!textArea || !textArea.value) { alert("Please input the proof of deposit string."); }

    try {
        const proofString = textArea.value;
        const proofElements = JSON.parse(atob(proofString));
        console.log("Proof Elements:", proofElements);

        console.log("Root:", proofElements.root);
        console.log("Hash:", proofElements.nullifierHash);

        receipt = await window.ethereum.request({ method: "eth_getTransactionReceipt", params: [proofElements.txHash] });
        if (!receipt) { throw "empty-receipt"; }

        const log = receipt.logs[2];
        const decodedData = tornadoInterface.decodeEventLog("Deposit", log.data, log.topics);

        const SnarkJS = window['snarkjs'];

        const proofInput = {
            "root": $u.BNToDecimal(decodedData.root),
            "nullifierHash": proofElements.nullifierHash,
            "recipient": $u.BNToDecimal(account.address),
            "secret": $u.BN256ToBin(proofElements.secret).split(""),
            "nullifier": $u.BN256ToBin(proofElements.nullifier).split(""),
            "hashPairings": decodedData.hashPairings.map((n) => ($u.BNToDecimal(n))),
            "hashDirections": decodedData.pairDirection
        };

        console.log("final proof", proofInput);
        console.log("Nullifier Hash:", proofInput.nullifierHash);

        // Generate the proof and public signals
        const { proof, publicSignals } = await SnarkJS.groth16.fullProve(proofInput, "/withdraw.wasm", "/setup_final.zkey");

        console.log("Public Signals:", publicSignals);

        // Prepare the inputs for the verification
        const callInputs = [
            proof.pi_a.slice(0, 2).map($u.BN256ToHex),
            proof.pi_b.slice(0, 2).map((row) => ($u.reverseCoordinate(row.map($u.BN256ToHex)))),
            proof.pi_c.slice(0, 2).map($u.BN256ToHex),
            publicSignals.slice(0, 2).map($u.BN256ToHex)
        ];

        console.log("Proof data:", callInputs);

        console.log("Public Signals:", publicSignals);
        console.log("Proof:", proof);

        const vKeyResponse = await fetch("/verification_key.json");
        const vKey = await vKeyResponse.json();



        // Verify the proof with the public signals
        const isValid = await SnarkJS.groth16.verify(vKey, publicSignals, proof);
        if (isValid) {
            console.log("Proof is valid.");
            // Continue with your logic if the proof is valid
            var receipt;
            while (!receipt) {
                receipt = await window.ethereum.request({ method: "eth_getTransactionReceipt", params: [txHash] });
                await new Promise((resolve) => { setTimeout(resolve, 1000); });
            }

            if (!!receipt) { updateWithdrawalSuccessful(true); }
        } else {
            console.log("Invalid proof.");
            // Handle invalid proof case here
        }

    } catch (e) {
        console.log(e);
    }

    updateWithdrawButtonState(ButtonState.Normal);
};



  const flashCopiedMessage = async () => {
      updateDisplayCopiedMessage(true);
      setTimeout(() => {
          updateDisplayCopiedMessage(false);
      }, 1000);
  }


  // useEffect(() => {
  //   const generateQRCodeWithAmount = async () => {
  //     const proofData = {
  //       proof: {
  //         root: "12345",
  //         nullifierHash: "67890",
  //         commitment: "abcdef",
  //         txHash: "0x1234567890abcdef",
  //       },
  //       amount: "50 UZAR",
  //     };

      
  //   };

  //   generateQRCodeWithAmount();
  // }, []);

  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.href = qrCodeURL;
    link.download = "zkp_ocx.png";
    link.click();
  };

  const handleScan = () => {
    setIsScanned(true); // Set scan state to true
  };

  const [isHovered, setIsHovered] = useState(false);



  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 md:py-20 py-12 px-4">
        <div className="flex flex-col lg:flex-row items-start gap-12">

          {/* left column */}
          <div className="flex-1 space-y-10">
            {/* hero section */}
            <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Send Money 
            <span className="block">even when offline</span>
          </h1>
          <p className="text-[#4681ee]/80 dark:text-white/80 text-lg mb-8 max-w-lg">
            Explore the offconnectx world. Buy and sell currencies easily on OffConnectX.
          </p>


          {/* Wallet Conn */}
           {!!account ? (
            <div className=" dark:bg-[#1a1b1f]/50 rounded-xl p-6 backdrop-blur-sm shadow-lg w-full max-w-md">
              <div className="space-y-2">
                  <span className="text-lg semi-bold text-[#4681ee] dark:text-white">{account.address.slice(0, 12) + "..."}</span>
                  
                  <span className="text-[#4681ee]/70 dark:text-white/70">{account.balance.slice(0, 10) + ((account.balance.length > 10) ? ("...") : (""))} ETH</span>
                  

                  <p className="text-2xl font-bold text-[#4681ee] dark:text-white ">UZAR Balance: {uzarBalance}</p>
                  <p className=" text-[#4681ee]/80 dark:text-white/80 ">Allowance: {allowance}</p>
                  <button className="px-6 py-2 bg-[#4681ee] dark:bg-[#2952e3] hover:bg-[#3671de] dark:hover:bg-[#2546bd] text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105" onClick={approveUzar}>Approve UZAR</button>
              </div>
            </div>
            ) : (
              <button
                type="button"
                onClick={connectMetamask}
                className="flex items-center bg-[#4681ee] dark:bg-[#2952e3] hover:bg-[#3671de] dark:hover:bg-[#2546bd] px-6 py-3 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 "
              >
                <AiFillPlayCircle className=" mr-2 text-xl" />
                <span>
                  Connect Wallet
                </span>
              </button>
              )}
            </div>

            {/* features */}
               
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                // yet to change icons
                { icon: <FaUserShield className="h-6 w-6" />, title: 'Reliability' },
                { icon: <FaLock className="h-6 w-6" />, title: 'Security' },
                { icon: <FaWifi className="h-6 w-6" />, title: 'Offline' },
                { icon: <FaShieldAlt className="h-6 w-6" />, title: 'Privacy' },
                { icon: <FaDollarSign className="h-6 w-6" />, title: 'Low Fees' },
                { icon: <FaBook className="h-6 w-6" />, title: 'Zero Knowledge' }
              ].map((feature, index) => (
                <div key={index} className="bg-white dark:bg-[#1a1b1f]/50 hover:bg-[#4681ee]/5 dark:hover:bg-white/5 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center h-32 transition-all duration-300">
                  <div className="mb-2 text-[#4681ee] dark:text-white">{feature.icon}</div>
                  <h3 className="text-sm md:text-base font-medium">{feature.title}</h3>
                </div>
              ))}
            </div>


            {/* qr code section */}
          <div className="w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Your QR Code</h2>
              {!isScanned ? (
                <div className="bg-white dark:bg-[#1a1b1f]/50 rounded-xl p-6 backdrop-blur-sm shadow-lg">
                  <img
                    src={qrCodeURL}
                    alt="Generated QR Code with Amount"
                    onClick={handleScan} // Simulate scan event on click
                    // style={{ cursor: "pointer" }}
                    className="w-full max-w-xs mx-auto cursor-pointer hover:opacity-90 transition-opacity"
                  />
                  <p className="text-[#4681ee]/70 dark:text-white/70 mt-4 text-sm">Click on the QR Code to simulate scanning.</p>
                </div>
              ) : (
                <div className="text-center">
                  {/* <h1 style={{ color: "red", fontSize: "5rem" }}>X</h1> */}
                  <div className="text-red-500 text-6xl mb-4">X</div>
                  <p className="text-[#4681ee]/70 dark:text-white/70">QR Code has been scanned.</p>
                </div>
              )}
          
              {qrCodeURL && (
                <div className="mt-4">
                  <img src={qrCodeURL} alt="Custom QR Code" />
                  <button className=" mt-2 text-[#4681ee] dark:text-white hover:underline" onClick={downloadQRCode}>Download QR Code</button>
                </div>
              )}
              {isScanned && <p className=" font-light text-sm">QR Code has been scanned!</p>}
              {!qrCodeURL && <p className="text-[#4681ee]/70 dark:text-white/70">Loading QR Code...</p>}
          </div>
        </div>


        {/* right column */}
        <div className="flex-1  w-full space-y-8">
          <div
           className=" relative rounded-xl sm:w-80 w-full max-w-md mx-auto h-48  overflow-hidden transition-transform  duration-700 ease-in-out hover:rotate-3 "
           style={{
            background: 'linear-gradient(135deg, rgba(70, 129, 238, 0.7) 0%, rgba(54, 113, 222, 0.7) 100%)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 32px rgba(70, 129, 238, 0.2)'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

            <div className="flex justify-between flex-col h-full p-6 relative">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={24} color="#fff" />
                </div>
                <BsInfoCircle fontSize={20} color="#fff" />
              </div>

              <div className={`transition-all duration-700 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-90'}`}>
                <div>
                {/* <p className=" font-light text-sm"> */}
                {!!account ? (
                  // <div className="container">
                    <div className=" text-white mb-1">
                        <span className="font-semibold">{account.address.slice(0, 12) + "..."}</span>
                        <br/>
                        <span className="text-white/80">{account.balance.slice(0, 10) + ((account.balance.length > 4) ? ("...") : (""))} ETH</span>
                        <p className=" font-bold text-2xl mt-2">{uzarBalance} UZAR </p>
                    </div>
                  // </div>
                  ) : 
                  (
                    // <button
                    //   type="button"
                    //   onClick={connectMetamask}
                    //   className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
                    // >
                      
                    // </button>
                    <div className="text-2xl font-bold text-white mb-1">0 UZAR</div>
                    // null
                    )}
                     <div className="text-xs text-white/70">User Balance</div>
                {/* </p> */}
                {/* <p className=" font-bold text-2xl mt-2">
                {uzarBalance} UZAR */}
                {/* </p> */}
                </div>
              </div>
            </div>



            {/* txn section */}
            <div className=" bg-white dark:bg-[#1a1b1f]/50 rounded-xl p-6 backdrop-blur-sm shadow-lg">
            {/* action buttons */}
            <div className="flex gap-4 mb-6" />
                {/* <div className="btn-group" style={{ marginBottom: 20 }}> */}
                      {/* { */}
                          {/* (section == "Deposit") ? ( */}
                              {/* <button className=" w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">Deposit</button> */}
                          {/* ) : ( */}
                              <button 
                              onClick={() =>  updateSection("Deposit")} 
                              className={`flex-1 py-3 px-6 font-medium transition-all duration-300 rounded-full 
                              ${ section === "Deposit" ? "bg-[#4681ee] dark:bg-[#2952e3] text-white"
                                : "border border-[#4681ee]/20 dark:border-white/20 text-[#4681ee] dark:text-white hover:bg-[#4681ee]/5 dark:hover:bg-white/5"}`}>Deposit
                                </button>  
                                 
                          {/* ) */}
                      {/* } */}
                      {/* {
                          (section == "Deposit") ? (
                              <button onClick={() => { updateSection("Withdraw"); }} className=" w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">Withdraw</button> 
                          ) : (
                              <button className=" w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">Withdraw</button>
                          )
                      } */}
                      <button 
                      onClick={() =>  updateSection("Withdraw")} 
                      className={`flex-1 py-3 px-6 font-medium transition-all duration-300 rounded-full 
                      ${ section === "Deposit"  ? "bg-[#4681ee] dark:bg-[#2952e3] text-white"
                        : "border border-[#4681ee]/20 dark:border-white/20 text-[#4681ee] dark:text-white hover:bg-[#4681ee]/5 dark:hover:bg-white/5"}`}>Withdraw
                        </button>  
                  </div>




                  {/* deposit section */}
                  {(section == "Deposit" && !!account) && (
                  <div className="space-y-4">
                    {(!!proofElements) ? (
                        <div>
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                            <span className="font-semibold text-green-800 dark:text-green-200 mb-2">Proof of Deposit:</span>
                            <div className=" bg-white dark:bg-[#1a1b1f] rounded p-2">
                              <span className="text-xs break-all" ref={(proofStringEl) => { updateProofStringEl(proofStringEl); }}>{proofElements}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button className="px-6 py-2 bg-[#4681ee] dark:bg-[#2952e3] hover:bg-[#3671de] dark:hover:bg-[#2546bd] rounded-full text-white font-medium transition-all duration-300" onClick={copyProof}>Copy Proof String</button>
                            {
                              (!!displayCopiedMessage) && (
                                <span className="text-green-600 dark:text-green-400 font-medium">Copied!</span>
                              )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-[#4681ee]/70 dark:text-white/70">Note: All deposits and withdrawals are of the same denomination of 0.1 UZAR.</p>
                          <button 
                            className=" w-full py-3 px-6 bg-[#4681ee] dark:bg-[#2952e3] hover:bg-[#3671de] dark:hover:bg-[#2546bd] text-white font-medium rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                            onClick={depositEther}
                            disabled={depositButtonState == ButtonState.Disabled}
                          >Deposit UZAR
                          </button>
                        </div>
                      )}
                  </div>
                )}


                {/* withdraw section */}
                {(section != "Deposit" && !!account) && (
                  <div>
                    {(withdrawalSuccessful) ? (
                      // <div>
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg  p-4">
                            <span className="font-semibold text-green-800 dark:text-green-200">Success!</span>
                            {/* <div style={{ marginTop: 5 }}> */}
                              <span className="block text-green-700 dark:text-green-300 mt-2">Withdrawal successful.</span>
                            {/* </div> */}

                        </div>
                      // </div>
                      ) : (
                      <div className="space-y-4">
                        <p className="text-[#4681ee]/70 dark:text-white/70">Note: All deposits and withdrawals are of the same denomination of UZAR.</p>
                        {/* <div className="form-group"> */}
                          <textarea className="w-full p-3 rounded-lg bg-[#f6f7fc] dark:bg-[#1a1b1f] border border-[#4681ee]/20 dark:border-white/20 text-[#4681ee] dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#4681ee] dark:focus:ring-[#2952e3]"
                              rows={4} 
                              ref={(ta) => { updateTextArea(ta); }}/>
                        {/* </div> */}
                        <div className="flex gap-2">
                        <button 
                          className=" flex-1 px-6 py-3 bg-[#4681ee] dark:bg-[#2952e3] hover:bg-[#3671de] dark:hover:bg-[#2546bd] text-white font-medium 
                           rounded-fulltransition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                          onClick={withdraw}
                          disabled={withdrawButtonState == ButtonState.Disabled}
                        >Withdraw UZAR
                        </button>
                        <button
                        onClick={tester}
                        className="flex-1 px-6 py-3 border border-[#4681ee]/20 dark:border-white/20 text-[#4681ee] dark:text-white hover:bg-[#4681ee]/5 dark:hover:bg-white/5 font-medium rounded-full transition-all duration-300"
                      >
                        Test UZAR Proof
                      </button>
                        </div>
                        </div>                
                      )}
                  </div>
                )}
          </div>
          </div>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default Welcome;



{/* {
                (section != "Deposit" && !!account) && (
                  <div>
                    {
                      (withdrawalSuccessful) ? (
                      <div>
                        <div className="alert alert-success p-3">
                            <div><span><strong>Success!</strong></span></div>
                            <div style={{ marginTop: 5 }}>
                              <span className="text-secondary ">Withdrawal successful.</span>
                            </div>

                        </div>
                      </div>
                      ) : (
                      <div>
                        <div className="form-group">
                          <textarea className="form-control" style={{ resize: "none" }} ref={(ta) => { updateTextArea(ta); }}></textarea>
                        </div>
                        <button 
                          className=" w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer" 
                          onClick={tester}
                         
                        ><span className="small">Test UZAR Proof</span></button>
                        </div>                  
                      )
                    }
                  </div>
                )
              } */}

                        
          {/* </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome; */}
