import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Activity, X, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { accountsApi } from '../../services/api';

// ── Market Instruments ────────────────────────────────────────────────────────
const INSTRUMENTS = {
  CRYPTO: [
    { symbol: 'BTCUSD',  name: 'Bitcoin / USD',    id: 'bitcoin',    pip: 0.01  },
    { symbol: 'ETHUSD',  name: 'Ethereum / USD',   id: 'ethereum',   pip: 0.01  },
    { symbol: 'SOLUSD',  name: 'Solana / USD',     id: 'solana',     pip: 0.001 },
    { symbol: 'XRPUSD',  name: 'XRP / USD',        id: 'ripple',     pip: 0.0001},
    { symbol: 'ADAUSD',  name: 'Cardano / USD',    id: 'cardano',    pip: 0.0001},
    { symbol: 'BNBUSD',  name: 'BNB / USD',        id: 'binancecoin',pip: 0.01  },
    { symbol: 'DOGEUSD', name: 'Dogecoin / USD',   id: 'dogecoin',   pip: 0.00001},
    { symbol: 'MATICUSD',name: 'Polygon / USD',    id: 'matic-network',pip: 0.0001},
    { symbol: 'DOTUSD',  name: 'Polkadot / USD',   id: 'polkadot',   pip: 0.001 },
    { symbol: 'LTCUSD',  name: 'Litecoin / USD',   id: 'litecoin',   pip: 0.01  },
  ],
  FOREX: [
    { symbol: 'EURUSD', name: 'EUR / USD', pip: 0.0001, mockPrice: 1.0842 },
    { symbol: 'GBPUSD', name: 'GBP / USD', pip: 0.0001, mockPrice: 1.2711 },
    { symbol: 'USDJPY', name: 'USD / JPY', pip: 0.01,   mockPrice: 157.43 },
    { symbol: 'AUDUSD', name: 'AUD / USD', pip: 0.0001, mockPrice: 0.6534 },
    { symbol: 'USDCAD', name: 'USD / CAD', pip: 0.0001, mockPrice: 1.3651 },
    { symbol: 'USDCHF', name: 'USD / CHF', pip: 0.0001, mockPrice: 0.8971 },
    { symbol: 'NZDUSD', name: 'NZD / USD', pip: 0.0001, mockPrice: 0.6012 },
    { symbol: 'EURGBP', name: 'EUR / GBP', pip: 0.0001, mockPrice: 0.8528 },
  ],
  INDICES: [
    { symbol: 'US500',  name: 'S&P 500',       pip: 0.01, mockPrice: 5472.30 },
    { symbol: 'US30',   name: 'Dow Jones',      pip: 0.01, mockPrice: 39124.50 },
    { symbol: 'NAS100', name: 'NASDAQ 100',     pip: 0.01, mockPrice: 19852.10 },
    { symbol: 'UK100',  name: 'FTSE 100',       pip: 0.01, mockPrice: 8182.70 },
    { symbol: 'GER40',  name: 'DAX 40',         pip: 0.01, mockPrice: 18421.30 },
  ],
  COMMODITIES: [
    { symbol: 'XAUUSD', name: 'Gold / USD',     pip: 0.01, mockPrice: 2327.40 },
    { symbol: 'XAGUSD', name: 'Silver / USD',   pip: 0.001,mockPrice: 29.18   },
    { symbol: 'USOIL',  name: 'Crude Oil (WTI)',pip: 0.01, mockPrice: 82.34   },
    { symbol: 'UKOIL',  name: 'Brent Crude',    pip: 0.01, mockPrice: 86.12   },
    { symbol: 'NATGAS', name: 'Natural Gas',     pip: 0.001,mockPrice: 2.41   },
  ],
};

const ALL_INSTRUMENTS = Object.values(INSTRUMENTS).flat();

// Simulate real-time price changes
function useSimulatedPrices(instruments, liveCryptoPrices) {
  const [prices, setPrices] = useState(() => {
    const init = {};
    instruments.forEach(inst => {
      const base = liveCryptoPrices?.[inst.id] || inst.mockPrice || 1000;
      init[inst.symbol] = { bid: base, ask: base * 1.0002, change: 0, changePct: 0 };
    });
    return init;
  });

  const baseRef = useRef({});
  useEffect(() => {
    instruments.forEach(inst => {
      const base = liveCryptoPrices?.[inst.id] || inst.mockPrice || 1000;
      if (!baseRef.current[inst.symbol]) baseRef.current[inst.symbol] = base;
    });

    const interval = setInterval(() => {
      setPrices(prev => {
        const next = { ...prev };
        instruments.forEach(inst => {
          const base = baseRef.current[inst.symbol] || 1000;
          const volatility = base * 0.0003;
          const delta = (Math.random() - 0.5) * 2 * volatility;
          const newBid = Math.max(0.00001, base + delta);
          const spread = base * 0.0002;
          const change = newBid - base;
          next[inst.symbol] = {
            bid: newBid,
            ask: newBid + spread,
            change,
            changePct: (change / base) * 100,
          };
        });
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [JSON.stringify(Object.keys(liveCryptoPrices || {}))]);

  return prices;
}

export default function DashboardTrading() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  
  const [selectedCategory, setSelectedCategory] = useState('CRYPTO');
  const [selectedInstrument, setSelectedInstrument] = useState(INSTRUMENTS.CRYPTO[0]);
  const [liveCryptoPrices, setLiveCryptoPrices] = useState({});
  const [orderType, setOrderType] = useState('MARKET');
  const [direction, setDirection] = useState('BUY');
  const [lots, setLots] = useState('0.01');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [openTrades, setOpenTrades] = useState([]);
  const [orderMsg, setOrderMsg] = useState(null);
  const [priceSearch, setPriceSearch] = useState('');

  // Mobile states
  const [showOrderSheet, setShowOrderSheet] = useState(false);
  const [showMarketsSheet, setShowMarketsSheet] = useState(false);
  const [mobileTab, setMobileTab] = useState('CHART'); // CHART, POSITIONS

  const categoryInstruments = INSTRUMENTS[selectedCategory] || [];
  const filteredInstruments = categoryInstruments.filter(i =>
    i.symbol.toLowerCase().includes(priceSearch.toLowerCase()) ||
    i.name.toLowerCase().includes(priceSearch.toLowerCase())
  );

  const cryptoIds = INSTRUMENTS.CRYPTO.map(i => i.id).join(',');

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd&x_cg_demo_api_key=CG-WAubejf1BsCA9U4xqM9H4WZP`
        );
        const data = await res.json();
        const mapped = {};
        Object.entries(data).forEach(([id, val]) => { mapped[id] = val.usd; });
        setLiveCryptoPrices(mapped);
      } catch (e) { /* use mock */ }
    };
    fetchPrices();
    const iv = setInterval(fetchPrices, 30000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    accountsApi.list().then(accs => {
      setAccounts(accs);
      if (accs.length > 0) setSelectedAccount(accs[0]);
    }).catch(console.error);
  }, []);

  const prices = useSimulatedPrices(ALL_INSTRUMENTS, liveCryptoPrices);
  const currentPrice = prices[selectedInstrument.symbol];

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!selectedAccount) return setOrderMsg({ type: 'error', text: 'Select a trading account first.' });
    if (selectedAccount.balance <= 0) return setOrderMsg({ type: 'error', text: 'Insufficient account balance.' });
    if (parseFloat(lots) <= 0) return setOrderMsg({ type: 'error', text: 'Invalid lot size.' });

    const price = direction === 'BUY' ? currentPrice?.ask : currentPrice?.bid;
    const newTrade = {
      id: Date.now(),
      symbol: selectedInstrument.symbol,
      name: selectedInstrument.name,
      direction,
      lots: parseFloat(lots),
      openPrice: price,
      currentPrice: price,
      sl: stopLoss || null,
      tp: takeProfit || null,
      openTime: new Date().toLocaleTimeString(),
      pnl: 0,
    };

    setOpenTrades(prev => [newTrade, ...prev]);
    setOrderMsg({ type: 'success', text: `✅ ${direction} ${lots} lots of ${selectedInstrument.symbol} placed!` });
    setStopLoss(''); setTakeProfit('');
    
    // Close sheet on mobile if success after short delay
    setTimeout(() => {
      setOrderMsg(null);
      if (window.innerWidth < 1280) setShowOrderSheet(false);
    }, 2000);
  };

  const closeTrade = (id) => {
    setOpenTrades(prev => prev.filter(t => t.id !== id));
  };

  const getTradeWithPnL = (trade) => {
    const cur = prices[trade.symbol];
    if (!cur) return { ...trade, pnl: 0 };
    const closePrice = trade.direction === 'BUY' ? cur.bid : cur.ask;
    const pips = trade.direction === 'BUY'
      ? (closePrice - trade.openPrice)
      : (trade.openPrice - closePrice);
    const pnl = pips * trade.lots * 100000 * (selectedInstrument.pip || 0.0001);
    return { ...trade, currentPrice: closePrice, pnl: parseFloat(pnl.toFixed(2)) };
  };

  const liveTrades = openTrades.map(getTradeWithPnL);
  const totalPnl = liveTrades.reduce((sum, t) => sum + t.pnl, 0);

  // Reusable components
  const OrderPanelContent = () => (
    <>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
          <p className="text-red-400 text-[10px] font-bold mb-1">SELL / BID</p>
          <p className="text-white font-bold font-mono text-sm xl:text-lg">
            {currentPrice?.bid?.toFixed(selectedInstrument.symbol.includes('JPY') ? 3 : 5) ?? '...'}
          </p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center">
          <p className="text-emerald-400 text-[10px] font-bold mb-1">BUY / ASK</p>
          <p className="text-white font-bold font-mono text-sm xl:text-lg">
            {currentPrice?.ask?.toFixed(selectedInstrument.symbol.includes('JPY') ? 3 : 5) ?? '...'}
          </p>
        </div>
      </div>
      <p className="text-body-dark text-[10px] text-center mb-4">
        Spread: {currentPrice ? ((currentPrice.ask - currentPrice.bid) / (selectedInstrument.pip || 0.0001)).toFixed(1) : '—'} pips
      </p>

      <form onSubmit={handlePlaceOrder} className="flex flex-col gap-3">
        <div className="flex gap-1 bg-dark rounded-lg p-1">
          {['MARKET', 'LIMIT', 'STOP'].map(t => (
            <button key={t} type="button" onClick={() => setOrderType(t)}
              className={`flex-1 text-[10px] font-bold py-2 rounded transition-colors ${orderType === t ? 'bg-white/10 text-white' : 'text-body-dark hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-body-dark mb-1">Volume (Lots)</label>
          <input type="number" step="0.01" min="0.01" max="100" value={lots} onChange={e => setLots(e.target.value)}
            className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-primary" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-body-dark mb-1">Stop Loss</label>
            <input type="number" step="any" value={stopLoss} onChange={e => setStopLoss(e.target.value)} placeholder="Optional"
              className="w-full bg-dark border border-white/10 rounded-lg px-3 py-3 text-white text-xs font-mono focus:outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-body-dark mb-1">Take Profit</label>
            <input type="number" step="any" value={takeProfit} onChange={e => setTakeProfit(e.target.value)} placeholder="Optional"
              className="w-full bg-dark border border-white/10 rounded-lg px-3 py-3 text-white text-xs font-mono focus:outline-none focus:border-emerald-500" />
          </div>
        </div>

        {orderMsg && (
          <div className={`text-xs p-3 rounded-lg flex items-center gap-2 ${orderMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {orderMsg.text}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            type="submit"
            onClick={() => setDirection('SELL')}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-colors flex flex-col items-center shadow-lg shadow-red-500/20"
          >
            <TrendingDown className="w-5 h-5 mb-0.5" />
            <span className="text-sm">SELL</span>
          </button>
          <button
            type="submit"
            onClick={() => setDirection('BUY')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition-colors flex flex-col items-center shadow-lg shadow-emerald-500/20"
          >
            <TrendingUp className="w-5 h-5 mb-0.5" />
            <span className="text-sm">BUY</span>
          </button>
        </div>
      </form>
    </>
  );

  const MarketWatchContent = () => (
    <>
      <div className="p-4 border-b border-white/5 sticky top-0 bg-dark-secondary z-10">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-body-dark" />
          <input
            value={priceSearch}
            onChange={e => setPriceSearch(e.target.value)}
            placeholder="Search markets..."
            className="w-full bg-dark border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>
      <div className="flex border-b border-white/5 sticky top-[69px] bg-dark-secondary z-10 overflow-x-auto scrollbar-none">
        {Object.keys(INSTRUMENTS).map(cat => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setPriceSearch(''); }}
            className={`px-4 py-3 text-[11px] font-bold transition-colors whitespace-nowrap ${selectedCategory === cat ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-body-dark hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="overflow-y-auto max-h-[60vh] xl:max-h-[600px] pb-24 xl:pb-0">
        {filteredInstruments.map(inst => {
          const p = prices[inst.symbol];
          const isSelected = selectedInstrument.symbol === inst.symbol;
          const isUp = (p?.change || 0) >= 0;
          return (
            <button
              key={inst.symbol}
              onClick={() => {
                setSelectedInstrument(inst);
                if (window.innerWidth < 1280) setShowMarketsSheet(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 border-b border-white/5 transition-colors text-left ${isSelected ? 'bg-primary/10' : 'hover:bg-white/[0.03]'}`}
            >
              <div>
                <p className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-white'}`}>{inst.symbol}</p>
                <p className="text-[10px] text-body-dark">{inst.name}</p>
              </div>
              <div className="text-right">
                <p className="text-white text-sm font-mono">{p?.bid?.toFixed(inst.symbol.includes('JPY') ? 3 : inst.symbol.length < 7 ? 5 : 2) ?? '...'}</p>
                <p className={`text-[11px] font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isUp ? '+' : ''}{p?.changePct?.toFixed(2) ?? '0.00'}%
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="p-0 sm:p-6 w-full max-w-full overflow-hidden h-[100dvh] sm:h-auto flex flex-col relative bg-dark">
      {/* ── TOP HEADER (Mobile + Desktop) ────────────────────────────────── */}
      <div className="px-4 py-3 sm:px-0 sm:py-0 flex items-center justify-between border-b border-white/5 sm:border-none sm:mb-6 shrink-0 bg-dark-secondary sm:bg-transparent z-10">
        <div className="flex items-center gap-2">
          {/* Mobile pair selector trigger */}
          <button 
            className="xl:hidden flex items-center gap-2"
            onClick={() => setShowMarketsSheet(true)}
          >
            <h1 className="text-xl sm:text-2xl font-bold text-white">{selectedInstrument.symbol}</h1>
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-[10px] text-white">▼</span>
            </div>
          </button>
          
          <div className="hidden xl:block">
            <h1 className="text-2xl font-bold text-white">Trading Terminal</h1>
            <p className="text-body-dark text-xs mt-0.5">Live simulated trading — real market prices, virtual execution.</p>
          </div>
        </div>
        
        {/* Account selector */}
        <div className="flex items-center gap-3">
          <select
            value={selectedAccount?.id || ''}
            onChange={e => setSelectedAccount(accounts.find(a => a.id === e.target.value))}
            className="bg-dark sm:bg-dark-secondary border border-white/10 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-white text-[10px] sm:text-sm focus:outline-none focus:border-primary"
          >
            {accounts.length === 0 && <option value="">No Accounts</option>}
            {accounts.map(a => (
              <option key={a.id} value={a.id}>{a.type} — ${a.balance.toLocaleString()}</option>
            ))}
          </select>
          {selectedAccount && (
            <div className="hidden sm:block bg-dark-secondary border border-white/5 rounded-lg px-3 py-2 text-right">
              <p className="text-body-dark text-[10px]">Equity</p>
              <p className="text-white font-bold text-sm">${(selectedAccount.balance + totalPnl).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="flex xl:hidden border-b border-white/5 shrink-0 bg-dark-secondary z-10">
        {['CHART', 'POSITIONS'].map(t => (
          <button 
            key={t}
            onClick={() => setMobileTab(t)}
            className={`flex-1 py-3 text-xs font-bold transition-colors ${mobileTab === t ? 'text-primary border-b-2 border-primary' : 'text-body-dark'}`}
          >
            {t} {t === 'POSITIONS' && liveTrades.length > 0 && `(${liveTrades.length})`}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto xl:overflow-hidden relative">
        <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr_320px] gap-4 h-full xl:h-[calc(100vh-140px)]">
          
          {/* ── LEFT: Market Watch (Desktop Only) ─────────────────────────────────────── */}
          <div className="hidden xl:flex flex-col bg-dark-secondary border border-white/5 rounded-xl overflow-hidden h-full">
            <MarketWatchContent />
          </div>

          {/* ── CENTRE: Chart + Open Trades ───────────────────────────── */}
          <div className={`flex-col gap-4 h-full ${mobileTab === 'CHART' ? 'flex' : 'hidden xl:flex'}`}>
            
            {/* Chart Area */}
            <div className="flex-1 bg-dark sm:bg-dark-secondary border-b sm:border border-white/5 sm:rounded-xl overflow-hidden flex flex-col relative min-h-[350px]">
              {/* Mobile Price Header in Chart */}
              <div className="xl:hidden px-4 py-3 flex justify-between items-end border-b border-white/5">
                <div className="flex flex-col">
                  <span className={`text-2xl font-bold font-mono leading-none ${(currentPrice?.changePct || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {currentPrice?.bid?.toFixed(selectedInstrument.symbol.includes('JPY') ? 3 : selectedInstrument.symbol.length < 7 ? 5 : 2) ?? '...'}
                  </span>
                  <span className={`text-xs font-bold mt-1 ${(currentPrice?.changePct || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {(currentPrice?.changePct || 0) >= 0 ? '+' : ''}{currentPrice?.changePct?.toFixed(2) ?? '0.00'}%
                  </span>
                </div>
              </div>
              
              {/* Desktop Price Header */}
              <div className="hidden xl:flex p-4 border-b border-white/5 items-center justify-between shrink-0">
                <div>
                  <p className="text-white font-bold">{selectedInstrument.symbol}</p>
                  <p className="text-body-dark text-xs">{selectedInstrument.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-xl font-mono">
                    {currentPrice?.bid?.toFixed(selectedInstrument.symbol.includes('JPY') ? 3 : selectedInstrument.symbol.length < 7 ? 5 : 2) ?? '...'}
                  </p>
                  <p className={`text-xs font-bold ${(currentPrice?.changePct || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {(currentPrice?.changePct || 0) >= 0 ? '+' : ''}{currentPrice?.changePct?.toFixed(3) ?? '0.000'}%
                  </p>
                </div>
              </div>

              {/* TradingView Widget */}
              <div className="flex-1 min-h-0 w-full pb-20 xl:pb-0">
                <iframe
                  key={selectedInstrument.symbol}
                  src={`https://www.tradingview.com/widgetembed/?symbol=${
                    selectedInstrument.symbol.includes('USD') && !selectedInstrument.symbol.includes('XAU') && !selectedInstrument.symbol.includes('XAG')
                      ? `BITSTAMP:${selectedInstrument.symbol}`
                      : selectedInstrument.symbol.startsWith('XAU') || selectedInstrument.symbol.startsWith('XAG')
                      ? `TVC:${selectedInstrument.symbol}`
                      : `FX:${selectedInstrument.symbol}`
                  }&interval=15&theme=dark&style=1&locale=en&hide_side_toolbar=1&allow_symbol_change=0&save_image=0&calendar=0&hide_volume=0`}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allowTransparency={true}
                  scrolling="no"
                  allowFullScreen={true}
                />
              </div>
            </div>

            {/* Open Trades (Desktop only here, Mobile uses tab) */}
            <div className="hidden xl:flex flex-col bg-dark-secondary border border-white/5 rounded-xl overflow-hidden h-[250px] shrink-0">
              <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                <p className="text-white font-bold text-sm">Open Positions ({liveTrades.length})</p>
                {liveTrades.length > 0 && (
                  <p className={`text-sm font-bold ${totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    Total P&L: {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
                  </p>
                )}
              </div>
              {liveTrades.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <Activity className="w-8 h-8 text-body-dark mb-2" />
                  <p className="text-body-dark text-sm">No open positions.</p>
                </div>
              ) : (
                <div className="flex-1 overflow-auto scrollbar-none">
                  <table className="w-full text-xs min-w-[600px]">
                    <thead className="border-b border-white/5 bg-white/[0.02] sticky top-0">
                      <tr>
                        {['Symbol','Dir','Lots','Open','Current','P&L',''].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left font-semibold text-body-dark uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {liveTrades.map(trade => (
                        <tr key={trade.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="px-4 py-2.5">
                            <p className="text-white font-bold">{trade.symbol}</p>
                            <p className="text-body-dark text-[10px]">{trade.openTime}</p>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${trade.direction === 'BUY' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'}`}>
                              {trade.direction}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-white">{trade.lots}</td>
                          <td className="px-4 py-2.5 text-white font-mono">{trade.openPrice?.toFixed(5)}</td>
                          <td className="px-4 py-2.5 text-white font-mono">{trade.currentPrice?.toFixed(5)}</td>
                          <td className="px-4 py-2.5">
                            <span className={`font-bold ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <button onClick={() => closeTrade(trade.id)} className="text-red-400 hover:text-red-300 text-[10px] font-bold border border-red-400/30 px-2 py-1 rounded transition-colors">
                              CLOSE
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Positions Tab Content */}
          <div className={`xl:hidden flex-1 overflow-y-auto ${mobileTab === 'POSITIONS' ? 'block' : 'hidden'}`}>
            <div className="p-4 flex items-center justify-between border-b border-white/5">
              <p className="text-white font-bold text-sm">Positions ({liveTrades.length})</p>
              {liveTrades.length > 0 && (
                <p className={`text-sm font-bold ${totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
                </p>
              )}
            </div>
            
            {liveTrades.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Activity className="w-12 h-12 text-body-dark mb-3 opacity-20" />
                <p className="text-body-dark text-sm">No open positions.</p>
              </div>
            ) : (
              <div className="flex flex-col pb-24">
                {liveTrades.map(trade => (
                  <div key={trade.id} className="p-4 border-b border-white/5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${trade.direction === 'BUY' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'}`}>
                          {trade.direction} {trade.lots}
                        </span>
                        <p className="text-white font-bold text-sm">{trade.symbol}</p>
                      </div>
                      <span className={`font-bold font-mono ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-body-dark font-mono">
                      <span>Open: {trade.openPrice?.toFixed(5)}</span>
                      <span>→</span>
                      <span>Cur: {trade.currentPrice?.toFixed(5)}</span>
                    </div>
                    <button onClick={() => closeTrade(trade.id)} className="w-full mt-1 bg-white/5 hover:bg-red-500/20 text-red-400 text-xs font-bold py-2 rounded-lg transition-colors border border-transparent hover:border-red-500/30">
                      Close Position
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Order Panel (Desktop) ─────────────────────────────────────── */}
          <div className="hidden xl:flex flex-col bg-dark-secondary border border-white/5 rounded-xl p-4 overflow-y-auto">
            <p className="text-white font-bold text-sm mb-4">Order Execution</p>
            <OrderPanelContent />
          </div>

        </div>
      </div>

      {/* ── MOBILE: Sticky Bottom Actions ────────────────────────────────── */}
      <div className="xl:hidden fixed bottom-0 left-0 w-full bg-dark border-t border-white/10 p-3 flex gap-3 z-20 pb-safe">
        <button 
          onClick={() => { setDirection('SELL'); setShowOrderSheet(true); }}
          className="flex-1 bg-red-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.3)] flex flex-col items-center"
        >
          <span className="text-sm">SELL</span>
          <span className="text-[10px] font-mono opacity-90 leading-none mt-1">{currentPrice?.bid?.toFixed(5) ?? '...'}</span>
        </button>
        <button 
          onClick={() => { setDirection('BUY'); setShowOrderSheet(true); }}
          className="flex-1 bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] flex flex-col items-center"
        >
          <span className="text-sm">BUY</span>
          <span className="text-[10px] font-mono opacity-90 leading-none mt-1">{currentPrice?.ask?.toFixed(5) ?? '...'}</span>
        </button>
      </div>

      {/* ── MOBILE: Bottom Sheet (Order Form) ────────────────────────────────── */}
      {showOrderSheet && (
        <div className="xl:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-dark border-t border-white/10 w-full rounded-t-3xl p-5 pb-8 animate-slide-up max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${direction === 'BUY' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                {direction} {selectedInstrument.symbol}
              </h2>
              <button onClick={() => setShowOrderSheet(false)} className="p-1 text-body-dark hover:text-white bg-white/5 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <OrderPanelContent />
          </div>
        </div>
      )}

      {/* ── MOBILE: Markets Sheet ────────────────────────────────── */}
      {showMarketsSheet && (
        <div className="xl:hidden fixed inset-0 z-50 flex flex-col bg-dark animate-fade-in">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0">
            <h2 className="text-lg font-bold text-white">Select Market</h2>
            <button onClick={() => setShowMarketsSheet(false)} className="p-1 text-body-dark hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto bg-dark-secondary">
            <MarketWatchContent />
          </div>
        </div>
      )}
    </div>
  );
}
