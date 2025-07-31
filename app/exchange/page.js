'use client'

import React, { useState, useEffect } from 'react';
import { BiSortAlt2 } from 'react-icons/bi'; 
import { FiChevronDown, FiSearch } from 'react-icons/fi'; 
import { useRouter } from "next/navigation";
import uzar from "../../public/images/uzar.jpg";
import axios from 'axios';

const TokenSelector = ({ 
  selectedToken, 
  placeholder = "Select a token",
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white/80 dark:bg-[#244f6b]/60 backdrop-blur-sm border border-[#346f8f]/20 dark:border-[#fafcfe]/20 rounded-xl px-4 py-3 flex items-center justify-between hover:border-[#346f8f]/40 dark:hover:border-[#fafcfe]/40 transition-all duration-200"
    >
      {selectedToken ? (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#346f8f] to-[#185371] rounded-full flex items-center justify-center shadow-sm overflow-hidden">
            {selectedToken.iconUrl ? (
              <img 
                src={selectedToken.iconUrl} 
                alt={selectedToken.symbol}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-bold">{selectedToken.icon}</span>
            )}
          </div>
          <div className="text-left">
            <div className="text-[#346f8f] dark:text-[#fafcfe] font-semibold text-sm">
              {selectedToken.symbol}
            </div>
          </div>
        </div>
      ) : (
        <span className="text-[#346f8f]/60 dark:text-[#fafcfe]/60 text-sm">
          {placeholder}
        </span>
      )}
      <FiChevronDown
        size={16} 
        className="text-[#346f8f] dark:text-[#fafcfe]" 
      />
    </button>
  );
};

const TokenSelectionModal = ({ 
  isOpen, 
  onClose, 
  onTokenSelect, 
  tokens, 
  // selectedFromToken,
  // selectedToToken
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const favoriteTokens = tokens.slice(0, 4);
  const filteredTokens = tokens.filter(token => 
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 dark:bg-[#244f6b]/95 backdrop-blur-sm border border-[#346f8f]/20 dark:border-[#fafcfe]/20 rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-[#346f8f]/10 dark:border-[#fafcfe]/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#346f8f] dark:text-[#fafcfe]">Select a token</h3>
            <button 
              onClick={onClose}
              className="text-[#346f8f]/50 dark:text-[#fafcfe]/50 hover:text-[#346f8f] dark:hover:text-[#fafcfe] text-xl"
            >
              ×
            </button>
          </div>
          
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#346f8f]/50 dark:text-[#fafcfe]/50" size={16} />
            <input
              type="text"
              placeholder="Search name or paste address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#d8dede]/50 dark:bg-[#244f6b]/50 border border-[#346f8f]/20 dark:border-[#fafcfe]/20 rounded-lg pl-10 pr-10 py-2 text-sm text-[#346f8f] dark:text-[#fafcfe] placeholder-[#346f8f]/50 dark:placeholder-[#fafcfe]/50 outline-none focus:border-[#346f8f]/40 dark:focus:border-[#fafcfe]/40"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#346f8f]/50 dark:text-[#fafcfe]/50 hover:text-[#346f8f] dark:hover:text-[#fafcfe] text-lg"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {!searchTerm && (
            <>
              <div className="p-4">
                <h4 className="text-sm font-medium text-[#346f8f] dark:text-[#fafcfe] mb-3">Favorite tokens</h4>
                <div className="grid grid-cols-4 gap-2">
                  {favoriteTokens.map((token) => (
                    <button
                      key={`fav-${token.symbol}`}
                      onClick={() => {
                        onTokenSelect(token);
                        setSearchTerm('');
                      }}
                      className="flex flex-col items-center p-2 bg-[#d8dede]/30 dark:bg-[#244f6b]/30 rounded-lg hover:bg-[#d8dede]/50 dark:hover:bg-[#244f6b]/50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-[#346f8f] to-[#185371] rounded-full flex items-center justify-center mb-1 overflow-hidden">
                        {token.iconUrl ? (
                          <img 
                            src={token.iconUrl} 
                            alt={token.symbol}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-xs font-bold">{token.icon}</span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-[#346f8f] dark:text-[#fafcfe]">{token.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t border-[#346f8f]/10 dark:border-[#fafcfe]/10"></div>
            </>
          )}

          <div className="p-2">
            {filteredTokens.map((token) => (
              <button
                key={token.symbol}
                onClick={() => {
                  onTokenSelect(token);
                  setSearchTerm('');
                }}
                className="w-full px-3 py-3 flex items-center space-x-3 hover:bg-[#d8dede]/30 dark:hover:bg-[#244f6b]/30 transition-colors rounded-lg"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#346f8f] to-[#185371] rounded-full flex items-center justify-center overflow-hidden">
                  {token.iconUrl ? (
                    <img 
                      src={token.iconUrl} 
                      alt={token.symbol}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm font-bold">{token.icon}</span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-[#346f8f] dark:text-[#fafcfe] font-semibold text-sm">
                    {token.symbol}
                  </div>
                  <div className="text-[#346f8f]/70 dark:text-white/70 text-xs">
                    {token.name}
                  </div>
                </div>
                <div className="text-[#346f8f]/70 dark:text-white/70 text-xs text-right">
                  <div className="font-medium">{token.balance.split(' ')[0]}</div>
                  <div>{token.symbol}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ExchangePage = () => {
  const [tokens, setTokens] = useState([]);
  const [usdToZarRate, setUsdToZarRate] = useState(18.12);
  const [fromToken, setFromToken] = useState(null); 
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [slippage, setSlippage] = useState('0.5');
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectingFor, setSelectingFor] = useState(null); // 'from' or 'to'
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tokensRes, exchangeRateRes] = await Promise.all([
          axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
              vs_currency: 'usd',
              ids: 'usd-coin,tether',
              order: 'market_cap_desc',
              per_page: 100,
              page: 1,
              sparkline: false
            },
            headers: {
              'x-cg-api-key': process.env.NEXT_PUBLIC_COIN_GHECKO_API_KEY 
            }
          }),
          axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
              ids: 'usd',
              vs_currencies: 'zar'
            },
            headers: {
              'x-cg-api-key': process.env.NEXT_PUBLIC_COIN_GHECKO_API_KEY 
            }
          })
        ]);

        const zarToUsdRate =  exchangeRateRes.data.usd?.zar || 18.18; 
        // setUsdToZarRate(exchangeRateRes.data.usd?.zar || 18.18);

        const formatted = tokensRes.data.map(token => ({
          symbol: token.symbol.toUpperCase(),
          name: token.name,
          icon: token.symbol.toUpperCase().substring(0, 2),
          iconUrl: token.image,
          balance: `0 ${token.symbol.toUpperCase()}`,
          price: token.current_price
        }));

         // manually add uzar with proper usd price calc
        const uzarToken = {
          symbol: 'UZAR',
          name: 'UZAR Stablecoin',
          icon: 'UZ', 
          iconUrl: uzar.src, 
          balance: '0 UZAR',
          price: zarToUsdRate, 
          isUzar: true // flag to identify uzar for special handling
        };

        setTokens([...formatted, uzarToken]);
      } catch (error) {
        console.error('Error fetching data:', error);
        
        // fallback: stikk create tokens with default exchange rate
        const uzarToken = {
          symbol: 'UZAR',
          name: 'UZAR Stablecoin',
          icon: 'UZ',
          iconUrl: uzar.src,
          balance: '0 UZAR',
          price: 0.055, 
          isUzar: true
        };
        setTokens([uzarToken]);
      }
    };

    fetchData();
  }, []);

  const openTokenSelector = (type) => {
    setSelectingFor(type);
    setIsModalOpen(true);
  };

  const handleTokenSelect = (token) => {
    if (selectingFor === 'from') {
      if (toToken && token.symbol === toToken.symbol) { 
          setToToken(null);
      }
      setFromToken(token);
    } else if (selectingFor === 'to') {
      if (fromToken && token.symbol === fromToken.symbol) {   
          setFromToken(null);
      }
      setToToken(token);
    }
    setIsModalOpen(false);
    setSelectingFor(null);
  };

  const handleSwapTokens = () => {
    if (!toToken || !fromToken) return;
    
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleSwap = () => {
    if (!toToken || !fromToken) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setIsRedirecting(true);
        
        setTimeout(() => {
          window.location.href = "/";
          console.log('Would redirect to home page');
        }, 2000);
      }, 1500);
    }, 2000);
  };

  // calculate exchange rate and usd values
  const exchangeRate = toToken && fromToken && parseFloat(toAmount) && parseFloat(fromAmount) ? parseFloat(toAmount) / parseFloat(fromAmount) : 0;
  const usdValue = fromToken && fromAmount ? parseFloat(fromAmount) * fromToken.price : 0;
  const receiveUsdValue = toToken && toAmount ? parseFloat(toAmount) * toToken.price : 0;

  // auto-calculate to amount when 'from' amount changes
  useEffect(() => {
    if (fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0) {
      const rate = toToken.price / fromToken.price;
      const calculatedAmount = parseFloat(fromAmount) * rate;
      setToAmount(calculatedAmount.toFixed(6));
    } else if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setToAmount('');
    }
  }, [fromAmount, fromToken, toToken]);

  const handleFromAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
    }
  };

  const handleToAmountChange = (e) => {
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setToAmount(value);
      
      // auto-calculate from amount when 'to' amount changes
      if (fromToken && toToken && value && parseFloat(value) > 0) {
        const rate = fromToken.price / toToken.price;
        const calculatedAmount = parseFloat(value) * rate;
        setFromAmount(calculatedAmount.toFixed(6));
      } else if (!value || parseFloat(value) <= 0) {
        setFromAmount('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d8dede] via-[#d8dede] to-[#b8c8c8] dark:from-[#244f6b] dark:via-[#1a3a52] dark:to-[#0f2837] pt-8 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#346f8f] dark:text-white mb-2">
            Swap Tokens
          </h2>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white/60 dark:bg-[#244f6b]/40 backdrop-blur-xl border border-[#346f8f]/20 dark:border-[#fafcfe]/20 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#346f8f] dark:text-[#fafcfe]">Swap</h2>
          </div>

          <div className="mb-4">
            <div className="bg-[#d8dede]/40 dark:bg-[#244f6b]/30 rounded-2xl p-4 border border-[#346f8f]/10 dark:border-[#fafcfe]/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={fromAmount}
                    onChange={handleFromAmountChange}
                    disabled={!fromToken}
                    className="w-full bg-transparent text-2xl font-bold text-[#346f8f] dark:text-[#fafcfe] outline-none placeholder-[#346f8f]/50 dark:placeholder-[#fafcfe]/50 disabled:opacity-50 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder={fromToken ? "0" : "0"}
                    style={{ MozAppearance: 'textfield' }}
                  />
                  <div className="text-sm text-[#346f8f]/70 dark:text-white/70 mt-1">
                    ≈ ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="ml-4 min-w-[140px]">
                   <TokenSelector
                    selectedToken={fromToken}
                    placeholder="Select a token"
                    onClick={() => openTokenSelector('from')}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={handleSwapTokens}
              disabled={!toToken || !fromToken}
              className="p-3 bg-gradient-to-r from-[#346f8f] to-[#185371] hover:from-[#185371] hover:to-[#346f8f] text-white rounded-full transition-all duration-300 hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BiSortAlt2 size={20} />
            </button>
          </div>

          <div className="mb-6">
            <div className="bg-[#d8dede]/40 dark:bg-[#244f6b]/30 rounded-2xl p-4 border border-[#346f8f]/10 dark:border-[#fafcfe]/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={toAmount}
                    onChange={handleToAmountChange}
                    disabled={!toToken}
                    className="w-full bg-transparent text-2xl font-bold text-[#346f8f] dark:text-[#fafcfe] outline-none placeholder-[#346f8f]/50 dark:placeholder-[#fafcfe]/50 disabled:opacity-50 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder={toToken ? "0" : "0"}
                    style={{ MozAppearance: 'textfield' }}
                  />
                  <div className="text-sm text-[#346f8f]/70 dark:text-white/70 mt-1">
                    ≈ ${receiveUsdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    {toToken && fromToken && (
                      <span className="ml-2">
                        (-0.33%)
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-4 min-w-[140px]">
                  <TokenSelector
                    selectedToken={toToken}
                    placeholder="Select a token"
                    onClick={() => openTokenSelector('to')}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {toToken && fromToken && toAmount && fromAmount && (
            <div className="bg-[#d8dede]/30 dark:bg-[#244f6b]/20 rounded-xl p-4 mb-6 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#346f8f]/70 dark:text-white/70">Receive (incl. costs)</span>
                <span className="text-[#346f8f] dark:text-[#fafcfe] font-medium font-bold">
                  {(parseFloat(toAmount) - parseFloat(toAmount) * 0.003).toFixed(6)} {toToken.symbol}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#346f8f]/70 dark:text-white/70">
                  1 {fromToken.symbol} = {exchangeRate.toFixed(6)} {toToken.symbol}
                </span>
                <span className="text-[#346f8f] dark:text-[#fafcfe] font-medium">
                  ≈ ${toToken.price.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="text-center mt-4">
            <button
              onClick={handleSwap}
              disabled={isLoading || !fromAmount || parseFloat(fromAmount) <= 0 || !toToken || !fromToken}
              className="w-full bg-gradient-to-r from-[#346f8f] to-[#185371] hover:from-[#185371] hover:to-[#346f8f] text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Swapping...</span>
                </div>
              ) : !fromToken || !toToken ? (
                "Select tokens"
              ) : (
                `Swap ${fromToken.symbol} to ${toToken.symbol}`
              )}
            </button>
          </div>
        </div>
      </div>

      <TokenSelectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectingFor(null);
        }}
        onTokenSelect={handleTokenSelect}
        tokens={tokens}
        selectedFromToken={fromToken}
        selectedToToken={toToken}
      />

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 dark:bg-[#244f6b]/95 backdrop-blur-sm border border-[#346f8f]/20 dark:border-[#fafcfe]/20 rounded-2xl shadow-xl p-8 text-center max-w-sm w-full">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#346f8f] dark:text-[#fafcfe] mb-2">
                Swap Completed Successfully!
              </h3>
              {!isRedirecting ? (
                <p className="text-[#346f8f]/70 dark:text-white/70 text-sm">
                  Your tokens have been swapped successfully.
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-[#346f8f]/70 dark:text-white/70 text-sm">
                    Redirecting to home page...
                  </p>
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[#346f8f]/30 dark:border-[#fafcfe]/30 border-t-[#346f8f] dark:border-t-[#fafcfe] rounded-full animate-spin"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExchangePage;