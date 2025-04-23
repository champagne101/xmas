import React, { useContext, useState, useEffect } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
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
const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light ";

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


  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-gradient py-1">
            Send Money <br /> even when offline
          </h1>
          <p className="text-left mt-5  font-light md:w-9/12 w-11/12 text-base">
            Explore the offconnectx world. Buy and sell currencies easily on OffConnectX.
          </p>
          
          


          {!!account ? (
            <div className="container">
          
              <div className=" text-base font-semibold">
                  <span><strong>{account.address.slice(0, 12) + "..."}</strong></span>
                  <br/>
                  <span className="small">{account.balance.slice(0, 10) + ((account.balance.length > 10) ? ("...") : (""))} ETH</span>
                  <br/>
                  <p className="sm:text-2xl  text-gradient py-1">UZAR Balance: {uzarBalance}</p>
                  <p className=" text-gradient">Allowance: {allowance}</p>
                  <button  className="  text-gradient" onClick={approveUzar}>Approve UZAR</button>
              </div>
            </div>
            ) : (
              <button
                type="button"
                onClick={connectMetamask}
                className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
              >
                <AiFillPlayCircle className=" mr-2" />
                <p className=" text-base font-semibold">
                  Connect Wallet
                </p>
              </button>
              )
            }
            
          <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
            <div className={`rounded-tl-2xl ${companyCommonStyles}`}>
              Reliability
            </div>
            <div className={companyCommonStyles}>Security</div>
            <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>
              Offline
            </div>
            <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>
              Privacy
            </div>
            <div className={companyCommonStyles}>Low Fees</div>
            <div className={`rounded-br-2xl ${companyCommonStyles}`}>
              Zero Knowledge
            </div>
          </div>

          <h1 className=" font-light text-sm">Your QR Code</h1>
            {!isScanned ? (
              <div>
                <img
                  src={qrCodeURL}
                  alt="Generated QR Code with Amount"
                  onClick={handleScan} // Simulate scan event on click
                  style={{ cursor: "pointer" }}
                />
                <p className=" font-light text-sm">Click on the QR Code to simulate scanning.</p>
              </div>
            ) : (
              <div>
                <h1 style={{ color: "red", fontSize: "5rem" }}>X</h1>
                <p className=" font-light text-sm">QR Code has been scanned.</p>
              </div>
            )}


        
            {qrCodeURL && (
              <div>
                <img src={qrCodeURL} alt="Custom QR Code" />
                <br />
                <button className=" font-light text-sm" onClick={downloadQRCode}>Download QR Code</button>
              </div>
            )}
            {isScanned && <p className=" font-light text-sm">QR Code has been scanned!</p>}
            {!qrCodeURL && <p className=" font-light text-sm">Loading QR Code...</p>}
        </div>

        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <BsInfoCircle fontSize={17} color="#fff" />
              </div>
              <div>
                <p className=" font-light text-sm">
                {!!account ? (
                  <div className="container">
                    <div className=" text-base font-semibold">
                        <span><strong>{account.address.slice(0, 12) + "..."}</strong></span>
                        <br/>
                        <span className="small">{account.balance.slice(0, 10) + ((account.balance.length > 4) ? ("...") : (""))} ETH</span>
                    </div>
                  </div>
                  ) : (
                    <button
                      type="button"
                      onClick={connectMetamask}
                      className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
                    >
                      
                    </button>
                    )
                  }
                </p>
                <p className=" font-semibold text-lg mt-1">
                {uzarBalance} UZAR
                </p>
              </div>
            </div>
          </div>
          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
            

            <div className="h-[1px] w-full bg-gray-400 my-2" />
                <div className="btn-group" style={{ marginBottom: 20 }}>
                      {
                          (section == "Deposit") ? (
                              <button className=" w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">Deposit</button>
                          ) : (
                              <button onClick={() => { updateSection("Deposit"); }} className=" w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">Deposit</button>   
                          )
                      }
                      {
                          (section == "Deposit") ? (
                              <button onClick={() => { updateSection("Withdraw"); }} className=" w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">Withdraw</button> 
                          ) : (
                              <button className=" w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">Withdraw</button>
                          )
                      }
                  </div>
              

              {
                (section == "Deposit" && !!account) && (
                  <div>
                    {
                      (!!proofElements) ? (
                        <div>
                          <div className="alert alert-success ">
                            <span><strong>Proof of Deposit:</strong></span>
                            <div className="p-1" style={{ lineHeight: "12px" }}>
                              <span style={{ fontSize: 10 }} ref={(proofStringEl) => { updateProofStringEl(proofStringEl); }}>{proofElements}</span>
                            </div>
                          </div>

                          <div>
                            <button className=" w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer" onClick={copyProof}><span className="small">Copy Proof String</span></button>
                            {
                              (!!displayCopiedMessage) && (
                                <span className="small" style={{ color: 'green' }}><strong> Copied!</strong></span>
                              )
                            }
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-left mt-5  font-light md:w-9/12 w-11/12 text-base">Note: All deposits and withdrawals are of the same denomination of 0.1 UZAR.</p>
                          <button 
                            className=" w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer" 
                            onClick={depositEther}
                            disabled={depositButtonState == ButtonState.Disabled}
                          ><span className="small">Deposit UZAR</span></button>
                        </div>
                      )
                    }
                  </div>
                )
              }

              {
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
                        <p className="text-left mt-5  font-light md:w-9/12 w-11/12 text-base">Note: All deposits and withdrawals are of the same denomination of UZAR.</p>
                        <div className="form-group">
                          <textarea className="form-control" style={{ resize: "none" }} ref={(ta) => { updateTextArea(ta); }}></textarea>
                        </div>
                        <button 
                          className=" w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer" 
                          onClick={withdraw}
                          disabled={withdrawButtonState == ButtonState.Disabled}
                        ><span className="small">Withdraw UZAR</span></button>
                        </div>                  
                      )
                    }
                  </div>
                )
              }







{
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
              }

                        
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
