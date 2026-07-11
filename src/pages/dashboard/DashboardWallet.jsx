import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { walletApi, accountsApi } from '../../services/api';
import { Loader2, ArrowRightLeft, ArrowDownToLine, ArrowUpFromLine, CheckCircle2, Clock, Copy, Check } from 'lucide-react';

const CRYPTO_COINS = [
  { id: 'BTC',   name: 'Bitcoin',   key: 'btcWallet',   network: 'Bitcoin Network'  },
  { id: 'ETH',   name: 'Ethereum',  key: 'ethWallet',   network: 'ERC-20'           },
  { id: 'USDT',  name: 'Tether',    key: 'usdtWallet',  network: 'ERC-20 / TRC-20' },
  { id: 'BNB',   name: 'BNB',       key: 'bnbWallet',   network: 'BNB Smart Chain'  },
  { id: 'SOL',   name: 'Solana',    key: 'solWallet',   network: 'Solana'           },
  { id: 'XRP',   name: 'XRP',       key: 'xrpWallet',   network: 'XRP Ledger'       },
  { id: 'ADA',   name: 'Cardano',   key: 'adaWallet',   network: 'Cardano'          },
  { id: 'DOGE',  name: 'Dogecoin',  key: 'dogeWallet',  network: 'DOGE Network'     },
  { id: 'MATIC', name: 'Polygon',   key: 'maticWallet', network: 'Polygon'          },
  { id: 'DOT',   name: 'Polkadot',  key: 'dotWallet',   network: 'Polkadot'         },
  { id: 'LTC',   name: 'Litecoin',  key: 'ltcWallet',   network: 'Litecoin'         },
];

export default function DashboardWallet() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('BANK_WIRE');
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [txHash, setTxHash] = useState('');
  const [cryptoWallets, setCryptoWallets] = useState({});
  const [transferTarget, setTransferTarget] = useState('');
  const [transferDirection, setTransferDirection] = useState('TO_ACCOUNT');
  const [copied, setCopied] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [hist, accs, settings] = await Promise.all([
        walletApi.history(),
        accountsApi.list(),
        walletApi.settings()
      ]);
      setHistory(hist);
      setAccounts(accs);
      setCryptoWallets(settings);
      if (accs.length > 0 && !transferTarget) setTransferTarget(accs[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const copyAddress = (addr) => {
    if (!addr) return;
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (method === 'CRYPTO' && !txHash) return alert('Please provide the Transaction Hash (TXID).');
    setActionLoading(true);
    try {
      await walletApi.deposit({
        amount: parseFloat(amount),
        method: method === 'CRYPTO' ? `CRYPTO_${selectedCoin}` : method,
        txHash: method === 'CRYPTO' ? txHash : undefined
      });
      alert('✅ Deposit submitted! Awaiting admin approval. Your balance will be updated once confirmed.');
      setShowDeposit(false);
      setAmount(''); setTxHash('');
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await walletApi.withdraw({ amount: parseFloat(amount), method });
      alert('Withdrawal request submitted! Amount secured in escrow.');
      setShowWithdraw(false);
      setAmount('');
      window.location.reload();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await walletApi.transfer({ amount: parseFloat(amount), accountId: transferTarget, direction: transferDirection });
      alert('Transfer successful!');
      setShowTransfer(false);
      setAmount('');
      window.location.reload();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const STATUS_COLORS = {
    PENDING: 'text-yellow-400 bg-yellow-400/10',
    COMPLETED: 'text-emerald-400 bg-emerald-400/10',
    REJECTED: 'text-red-400 bg-red-400/10',
  };

  const TYPE_LABELS = {
    DEPOSIT: 'Deposit',
    WITHDRAWAL: 'Withdrawal',
    TRANSFER_IN: 'Transfer (To Wallet)',
    TRANSFER_OUT: 'Transfer (To Account)'
  };

  const activeCoin = CRYPTO_COINS.find(c => c.id === selectedCoin);
  const activeCoinWallet = cryptoWallets[activeCoin?.key] || null;

  return (
    <div className="p-4 sm:p-8 w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Funds Management</h1>
          <p className="text-body-dark text-sm mt-1">Manage deposits, withdrawals, and internal transfers.</p>
        </div>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-dark-secondary border border-white/5 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ArrowDownToLine className="w-24 h-24 text-primary" />
          </div>
          <p className="text-body-dark text-sm font-semibold mb-1">Main Wallet Balance</p>
          <h2 className="text-4xl font-bold text-white mb-6">${(user?.walletBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
          <div className="flex gap-3 relative z-10">
            <button onClick={() => setShowDeposit(true)} className="flex-1 bg-primary hover:bg-primary-dark text-white text-sm font-bold py-2 rounded-full transition-colors text-center">Deposit</button>
            <button onClick={() => setShowWithdraw(true)} className="flex-1 border border-white/20 hover:border-white/50 text-white text-sm font-bold py-2 rounded-full transition-colors text-center">Withdraw</button>
          </div>
        </div>

        <div className="bg-dark-secondary border border-white/5 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ArrowRightLeft className="w-24 h-24 text-white" />
          </div>
          <p className="text-body-dark text-sm font-semibold mb-1">Total Trading Equity</p>
          <h2 className="text-4xl font-bold text-white mb-6">
            ${accounts.reduce((acc, a) => acc + (a.balance || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
          <button onClick={() => setShowTransfer(true)} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold py-2 rounded-full transition-colors text-center">
            Internal Transfer
          </button>
        </div>
      </div>

      {/* Deposit Flow Info Banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 flex gap-3">
        <div className="text-primary mt-0.5 flex-shrink-0">ℹ️</div>
        <div className="text-sm text-body-dark leading-relaxed">
          <span className="text-white font-semibold">How deposits work: </span>
          Submit a deposit request → Admin reviews & confirms → Funds appear in your Main Wallet → Transfer to a Trading Account to start trading.
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-dark-secondary border border-white/5 rounded-xl">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-white font-bold">Transaction History</h2>
        </div>
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="border-b border-white/5 bg-white/[0.02]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-body-dark uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-body-dark uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-body-dark uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-body-dark uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-body-dark uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center"><Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" /></td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-body-dark">No transactions found. Make your first deposit to get started.</td></tr>
              ) : history.map(tx => (
                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN' ? <ArrowDownToLine className="w-4 h-4 text-emerald-400" /> : <ArrowUpFromLine className="w-4 h-4 text-red-400" />}
                      <span className="text-white font-medium">{TYPE_LABELS[tx.type]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white font-bold">${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 text-body-dark">{tx.method}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${STATUS_COLORS[tx.status]}`}>
                      {tx.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-body-dark">{new Date(tx.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── DEPOSIT MODAL ── */}
      {showDeposit && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-secondary border border-white/10 rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-1">Deposit Funds</h3>
            <p className="text-body-dark text-xs mb-5">Your deposit will be credited after admin confirmation.</p>
            <form onSubmit={handleDeposit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-body-dark mb-1">Amount (USD)</label>
                <input type="number" min="10" required value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="Minimum $10"
                  className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-body-dark mb-1">Payment Method</label>
                <select value={method} onChange={e => setMethod(e.target.value)}
                  className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary">
                  <option value="BANK_WIRE">Bank Wire Transfer</option>
                  <option value="CREDIT_CARD">Credit / Debit Card</option>
                  <option value="CRYPTO">Cryptocurrency</option>
                </select>
              </div>

              {method === 'CRYPTO' && (
                <div className="bg-dark rounded-lg border border-white/10 p-4 flex flex-col gap-3">
                  <p className="text-xs font-bold text-white">Select Cryptocurrency</p>
                  {/* Coin grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {CRYPTO_COINS.map(coin => (
                      <button
                        key={coin.id}
                        type="button"
                        onClick={() => setSelectedCoin(coin.id)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs font-bold transition-colors ${
                          selectedCoin === coin.id
                            ? 'bg-primary/20 border-primary text-primary'
                            : 'border-white/10 text-body-dark hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <span className="text-base">{coin.id === 'BTC' ? '₿' : coin.id === 'ETH' ? 'Ξ' : coin.id[0]}</span>
                        <span>{coin.id}</span>
                      </button>
                    ))}
                  </div>

                  {/* Wallet Address Display */}
                  <div className="mt-1">
                    <p className="text-xs text-body-dark mb-1">
                      Send <span className="text-white font-bold">{activeCoin?.name}</span> via <span className="text-primary">{activeCoin?.network}</span> to:
                    </p>
                    {activeCoinWallet ? (
                      <div className="flex items-center gap-2 bg-black/30 rounded-lg px-3 py-2.5">
                        <span className="text-white text-xs font-mono flex-1 break-all">{activeCoinWallet}</span>
                        <button type="button" onClick={() => copyAddress(activeCoinWallet)} className="flex-shrink-0 text-body-dark hover:text-primary transition-colors">
                          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    ) : (
                      <p className="text-yellow-400 text-xs bg-yellow-400/10 px-3 py-2 rounded-lg">
                        ⚠️ Wallet address for {activeCoin?.id} not yet configured by admin. Please contact support.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-body-dark mb-1">Transaction Hash / TXID <span className="text-primary">*</span></label>
                    <input type="text" required value={txHash} onChange={e => setTxHash(e.target.value)}
                      placeholder={`Paste your ${selectedCoin} TXID after sending...`}
                      className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white text-xs font-mono focus:outline-none focus:border-primary" />
                    <p className="text-body-dark text-[10px] mt-1">Found in your wallet / exchange after sending. Required for verification.</p>
                  </div>
                </div>
              )}

              {method === 'BANK_WIRE' && (
                <div className="bg-dark rounded-lg border border-white/10 p-4 text-xs text-body-dark space-y-1">
                  <p className="text-white font-semibold mb-2">Wire Transfer Details</p>
                  <p><span className="text-white">Bank:</span> Barclays PLC</p>
                  <p><span className="text-white">Account Name:</span> Liquid Broker Ltd</p>
                  <p><span className="text-white">IBAN:</span> GB29 BARC 2000 0055 7799 11</p>
                  <p><span className="text-white">SWIFT/BIC:</span> BARCGB22</p>
                  <p className="text-yellow-400 mt-2">⚠️ Include your registered email as the payment reference.</p>
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowDeposit(false)} className="flex-1 py-3 text-body-dark font-medium hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={actionLoading} className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-70 text-white font-bold py-3 rounded-full transition-colors flex justify-center items-center gap-2">
                  {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />} Submit Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── WITHDRAW MODAL ── */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-secondary border border-white/10 rounded-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-4">Withdraw Funds</h3>
            <form onSubmit={handleWithdraw} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-body-dark mb-1">Amount (USD)</label>
                <input type="number" min="10" max={user?.walletBalance} required value={amount} onChange={e => setAmount(e.target.value)}
                  className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary" />
                <p className="text-body-dark text-xs mt-1">Available: ${(user?.walletBalance || 0).toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-body-dark mb-1">Method</label>
                <select value={method} onChange={e => setMethod(e.target.value)}
                  className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary">
                  <option value="BANK_WIRE">Bank Wire Transfer</option>
                  <option value="CRYPTO">Cryptocurrency (USDT / BTC)</option>
                </select>
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowWithdraw(false)} className="flex-1 py-3 text-body-dark font-medium hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={actionLoading} className="flex-1 bg-white hover:bg-gray-200 disabled:opacity-70 text-dark font-bold py-3 rounded-full transition-colors flex justify-center items-center gap-2">
                  {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />} Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── TRANSFER MODAL ── */}
      {showTransfer && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-secondary border border-white/10 rounded-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-4">Internal Transfer</h3>
            {accounts.length === 0 ? (
              <div className="text-center">
                <p className="text-body-dark mb-4">You don't have any trading accounts. Open one first.</p>
                <button onClick={() => setShowTransfer(false)} className="bg-white hover:bg-gray-200 text-dark font-bold py-2 px-6 rounded-full">Close</button>
              </div>
            ) : (
              <form onSubmit={handleTransfer} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-body-dark mb-1">Direction</label>
                  <select value={transferDirection} onChange={e => setTransferDirection(e.target.value)}
                    className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary">
                    <option value="TO_ACCOUNT">Wallet → Trading Account</option>
                    <option value="TO_WALLET">Trading Account → Wallet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-body-dark mb-1">Trading Account</label>
                  <select value={transferTarget} onChange={e => setTransferTarget(e.target.value)}
                    className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary">
                    {accounts.map(a => <option key={a.id} value={a.id}>{a.type} Account — ${a.balance.toLocaleString()}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-body-dark mb-1">Amount (USD)</label>
                  <input type="number" min="1" required value={amount} onChange={e => setAmount(e.target.value)}
                    className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary" />
                </div>
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setShowTransfer(false)} className="flex-1 py-3 text-body-dark font-medium hover:text-white transition-colors">Cancel</button>
                  <button type="submit" disabled={actionLoading} className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-70 text-white font-bold py-3 rounded-full transition-colors flex justify-center items-center gap-2">
                    {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />} Transfer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
