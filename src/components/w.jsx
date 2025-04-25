// const companyCommonStyles = "bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl transition-all duration-300 p-4 flex items-center justify-center flex-col h-32";

// const [isHovered, setIsHovered] = useState(false);

// return (
// <div className="flex w-full justify-center items-center">
// <div className="flex md:flex-row flex-col items-start justify-between max-w-7xl mx-auto sm:px-6 lg:px-8 md:p-20 py-12 px-4">
// <div className="flex flex-1 justify-start items-start flex-col md:mr-10">
// <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#4681ee] dark:text-white leading-tight mb-4">
// Send Money
// <span className="block">even when offline</span>
// </h1>
// <p className="text-[#4681ee]/80 dark:text-white/80 text-lg mb-8 md:w-9/12">
// Explore the offconnectx world. Buy and sell currencies easily on OffConnectX.
// </p>


//       {/* container 1 */}
//       {!!account ? (
//         <div className=" dark:bg-[#1a1b1f]/50 rounded-xl p-6 backdrop-blur-sm shadow-lg w-full max-w-md">
//           <div className="space-y-2">
//               <span className="text-lg semi-bold text-[#4681ee] dark:text-white">{account.address.slice(0, 12) + "..."}</span>
              
//               <span className="text-[#4681ee]/70 dark:text-white/70">{account.balance.slice(0, 10) + ((account.balance.length > 10) ? ("...") : (""))} ETH</span>
              

//               <p className="text-2xl font-bold text-[#4681ee] dark:text-white ">UZAR Balance: {uzarBalance}</p>
//               <p className=" text-[#4681ee]/80 dark:text-white/80 ">Allowance: {allowance}</p>
//               <button className="px-6 py-2 bg-[#4681ee] dark:bg-[#2952e3] hover:bg-[#3671de] dark:hover:bg-[#2546bd] text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105" onClick={approveUzar}>Approve UZAR</button>
//           </div>
//         </div>
//         ) : (
//           <button
//             type="button"
//             onClick={connectMetamask}
//             className="flex items-center bg-[#4681ee] dark:bg-[#2952e3] hover:bg-[#3671de] dark:hover:bg-[#2546bd] px-6 py-3 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 "
//           >
//             <AiFillPlayCircle className=" mr-2 text-xl" />
//             <span>
//               Connect Wallet
//             </span>
//           </button>
//           )}
        
        
//       <div className=" w-full py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//             <div className={`rounded-tl-2xl ${companyCommonStyles}`}>Reliability</div>
//           <div className={companyCommonStyles}>Security</div>
//           <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>Offline</div>
//           <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>Privacy</div>
//           <div className={companyCommonStyles}>Low Fees</div>
//           <div className={`rounded-br-2xl ${companyCommonStyles}`}>Zero Knowledge</div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-10 w-full max-w-md">
//       <h2 className="text-xl font-semibold text-[#4681ee] dark:text-white mb-4">Your QR Code</h2>
//         {!isScanned ? (
//           <div className="bg-white dark:bg-[#1a1b1f]/50 rounded-xl p-6 backdrop-blur-sm shadow-lg">
//             <img
//               src={qrCodeURL}
//               alt="Generated QR Code with Amount"
//               onClick={handleScan} // Simulate scan event on click
//               // style={{ cursor: "pointer" }}
//               className="w-full max-w-xs mx-auto cursor-pointer hover:opacity-90 transition-opacity"

//             />
//             <p className="text-[#4681ee]/70 dark:text-white/70 mt-4 text-sm">Click on the QR Code to simulate scanning.</p>
//           </div>
//         ) : (
//           <div className="text-center">
//             {/* <h1 style={{ color: "red", fontSize: "5rem" }}>X</h1> */}
//             <div className="text-red-500 text-6xl mb-4">X</div>

//             <p className="text-[#4681ee]/70 dark:text-white/70">QR Code has been scanned.</p>
//           </div>
//         )}


    
//         {qrCodeURL && (
//           <div className="mt-4">
//             <img src={qrCodeURL} alt="Custom QR Code" />
//             <br />
//             <button className="text-[#4681ee] dark:text-white hover:underline" onClick={downloadQRCode}>Download QR Code</button>
//           </div>
//         )}
//         {isScanned && <p className=" font-light text-sm">QR Code has been scanned!</p>}
//         {!qrCodeURL && <p className="text-[#4681ee]/70 dark:text-white/70">Loading QR Code...</p>}
//     </div>
//     </div>

//     <div className="flex flex-col flex-1 items-center justify-start w-full md:mt-0 mt-10">
//       <div
//        className="p-6 flex justify-end items-start flex-col rounded-xl sm:w-80 w-full my-5 h-48  overflow-hidden transition-transform  duration-700 ease-in-out hover:rotate-3 "
//        style={{
//         background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.7) 0%, rgba(236, 72, 153, 0.7) 100%)',
//         backdropFilter: 'blur(8px)',
//         boxShadow: '0 8px 32px rgba(70, 129, 238, 0.2)'
//       }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       >
//         {/* <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div> */}

//         <div className="flex justify-between flex-col  w-full h-full">
//           <div className="flex justify-between items-start">
//             <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
//               <SiEthereum fontSize={24} color="#fff" />
//             </div>
//             <BsInfoCircle fontSize={20} color="#fff" />
//           </div>

//           <div className={`transition-all duration-700 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-90'}`}>
//             <div>
//             {/* <p className=" font-light text-sm"> */}
//             {!!account ? (
//               // <div className="container">
//                 <div className=" text-white mb-1">
//                     <span className="font-semibold">{account.address.slice(0, 12) + "..."}</span>
//                     <br/>
//                     <span className="text-white/80">{account.balance.slice(0, 10) + ((account.balance.length > 4) ? ("...") : (""))} ETH</span>
//                     <p className=" font-bold text-2xl mt-2">{uzarBalance} UZAR </p>
//                 </div>
//               // </div>
//               ) : 
//               (
//                 // <button
//                 //   type="button"
//                 //   onClick={connectMetamask}
//                 //   className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
//                 // >
                  
//                 // </button>
//                 <div className="text-2xl font-bold text-white mb-1">
//                   0 UZAR
//                 </div>
//                 // null
//                 )}
//                  <div className="text-xs text-white/70">
//                 User Balance
//               </div>
//             {/* </p> */}
//             {/* <p className=" font-bold text-2xl mt-2">
//             {uzarBalance} UZAR */}
//             {/* </p> */}
//             </div>
//           </div>
//         </div>
//       </div>


//       <div className="p-6 sm:w-96 w-fullbg-white dark:bg-[#1a1b1f]/50 rounded-xl backdrop-blur-sm shadow-lg">
//         <div className="flex gap-4 mb-6" />
//             {/* <div className="btn-group" style={{ marginBottom: 20 }}> */}
//                   {/* { */}
//                       {/* (section == "Deposit") ? ( */}
//                           {/* <button className=" w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">Deposit</button> */}
//                       {/* ) : ( */}
//                           <button 
//                           onClick={() =>  updateSection("Deposit")} 
//                           className={`flex-1 py-3 px-6 font-medium transition-all duration-300 rounded-full 
//                           ${ section === "Deposit" ? "bg-[#4681ee] dark:bg-[#2952e3] text-white"
//                             : "border border-[#4681ee]/20 dark:border-white/20 text-[#4681ee] dark:text-white hover:bg-[#4681ee]/5 dark:hover:bg-white/5"}`}>Deposit
//                             </button>  
                             
//                       {/* ) */}
//                   {/* } */}
//                   {/* {
//                       (section == "Deposit") ? (
//                           <button onClick={() => { updateSection("Withdraw"); }} className=" w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">Withdraw</button> 
//                       ) : (
//                           <button className=" w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer">Withdraw</button>
//                       )
//                   } */}
//                   <button 
//                           onClick={() =>  updateSection("Withdraw")} 
//                           className={`flex-1 py-3 px-6 font-medium transition-all duration-300 rounded-full 
//                           ${ section === "Deposit"  ? "bg-[#4681ee] dark:bg-[#2952e3] text-white"
//                             : "border border-[#4681ee]/20 dark:border-white/20 text-[#4681ee] dark:text-white hover:bg-[#4681ee]/5 dark:hover:bg-white/5"}`}>Withdraw
//                             </button>  
//               </div>
          

//           {(section == "Deposit" && !!account) && (
//               <div>
//                 {
//                   (!!proofElements) ? (
//                     <div className="space-y-4">
//                       <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
//                         <span className="font-semibold text-green-800 dark:text-green-200 mb-2">Proof of Deposit:</span>
//                         <div className=" bg-white dark:bg-[#1a1b1f] rounded p-2">
//                           <span className="text-xs break-all" ref={(proofStringEl) => { updateProofStringEl(proofStringEl); }}>{proofElements}</span>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-2">
//                         <button className="px-6 py-2 bg-[#4681ee] dark:bg-[#2952e3] hover:bg-[#3671de] dark:hover:bg-[#2546bd] rounded-full text-white font-medium transition-all duration-300" onClick={copyProof}>Copy Proof String</button>
//                         {
//                           (!!displayCopiedMessage) && (
//                             <span className="text-green-600 dark:text-green-400 font-medium">Copied!</span>
//                           )}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <p className="text-[#4681ee]/70 dark:text-white/70">Note: All deposits and withdrawals are of the same denomination of 0.1 UZAR.</p>
//                       <button 
//                         className=" w-full py-3 px-6 bg-[#4681ee] dark:bg-[#2952e3] hover:bg-[#3671de] dark:hover:bg-[#2546bd] text-white font-medium rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
//                         onClick={depositEther}
//                         disabled={depositButtonState == ButtonState.Disabled}
//                       >Deposit UZAR
//                       </button>
//                     </div>
//                   )}
//               </div>
//             )}

//           {(section != "Deposit" && !!account) && (
//               <div>
//                 {
//                   (withdrawalSuccessful) ? (
//                   // <div>
//                     <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg  p-4">
//                         <span className="font-semibold text-green-800 dark:text-green-200">Success!</span>
//                         {/* <div style={{ marginTop: 5 }}> */}
//                           <span className="text-green-700 dark:text-green-300 mt-2">Withdrawal successful.</span>
//                         {/* </div> */}

//                     </div>
//                   // </div>
//                   ) : (
//                   <div className="space-y-4">
//                     <p className="text-[#4681ee]/70 dark:text-white/70">Note: All deposits and withdrawals are of the same denomination of UZAR.</p>
//                     {/* <div className="form-group"> */}
//                       <textarea className="w-full p-3 rounded-lg bg-[#f6f7fc] dark:bg-[#1a1b1f] border border-[#4681ee]/20 dark:border-white/20 text-[#4681ee] dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#4681ee] dark:focus:ring-[#2952e3]"
//                           rows={4} 
//                           ref={(ta) => { updateTextArea(ta); }}/>
//                     {/* </div> */}
//                     <div className="flex gap-2">
//                     <button 
//                       className=" flex-1 px-6 py-3 bg-[#4681ee] dark:bg-[#2952e3] hover:bg-[#3671de] dark:hover:bg-[#2546bd] text-white font-medium 
//                        rounded-fulltransition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
//                       onClick={withdraw}
//                       disabled={withdrawButtonState == ButtonState.Disabled}
//                     >Withdraw UZAR
//                     </button>
//                     <button
//                     onClick={tester}
//                     className="flex-1 px-6 py-3 border border-[#4681ee]/20 dark:border-white/20 text-[#4681ee] dark:text-white hover:bg-[#4681ee]/5 dark:hover:bg-white/5 font-medium rounded-full transition-all duration-300"
//                   >
//                     Test UZAR Proof
//                   </button>
//                     </div>
//                     </div>                
//                   )}
//               </div>
//             )}
//       {/* </div> */}
//     </div>
//   </div>
// </div>
// );
// };

// export default Welcome;