import { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { Loader2, Settings, Wallet } from 'lucide-react';

const CRYPTO_COINS = [
  { id: 'BTC',   name: 'Bitcoin',          key: 'btcWallet',   network: 'Bitcoin Network'    },
  { id: 'ETH',   name: 'Ethereum',         key: 'ethWallet',   network: 'ERC-20'             },
  { id: 'USDT',  name: 'Tether',           key: 'usdtWallet',  network: 'ERC-20 / TRC-20'   },
  { id: 'BNB',   name: 'BNB',              key: 'bnbWallet',   network: 'BNB Smart Chain'    },
  { id: 'SOL',   name: 'Solana',           key: 'solWallet',   network: 'Solana Network'     },
  { id: 'XRP',   name: 'XRP',              key: 'xrpWallet',   network: 'XRP Ledger'         },
  { id: 'ADA',   name: 'Cardano',          key: 'adaWallet',   network: 'Cardano Network'    },
  { id: 'DOGE',  name: 'Dogecoin',         key: 'dogeWallet',  network: 'Dogecoin Network'   },
  { id: 'MATIC', name: 'Polygon',          key: 'maticWallet', network: 'Polygon Network'    },
  { id: 'DOT',   name: 'Polkadot',         key: 'dotWallet',   network: 'Polkadot Network'   },
  { id: 'LTC',   name: 'Litecoin',         key: 'ltcWallet',   network: 'Litecoin Network'   },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await adminApi.settings();
        
        // Initialize state with fetched data, ensuring all keys exist
        const initialState = {};
        CRYPTO_COINS.forEach(coin => {
          initialState[coin.key] = data[coin.key] || '';
        });
        setSettings(initialState);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminApi.updateSettings(settings);
      alert('Settings saved successfully!');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 w-full max-w-full flex justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 w-full max-w-full overflow-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" /> Platform Settings
        </h1>
        <p className="text-body-dark text-sm mt-1">Configure global settings such as receiving crypto wallet addresses.</p>
      </div>

      <div className="bg-dark-secondary border border-white/5 rounded-xl p-6 max-w-3xl">
        <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">Cryptocurrency Deposit Wallets</h2>
        <p className="text-sm text-body-dark mb-6">
          These are the wallet addresses shown to users when they request a deposit. Leave blank if you do not want to accept a specific cryptocurrency.
        </p>
        
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CRYPTO_COINS.map(coin => (
            <div key={coin.id} className="bg-dark p-4 rounded-lg border border-white/5">
              <label className="block text-sm font-semibold text-white mb-1 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" /> {coin.name} ({coin.id})
              </label>
              <p className="text-[10px] text-body-dark mb-3 uppercase tracking-wider">{coin.network}</p>
              <input 
                type="text" 
                name={coin.key}
                value={settings[coin.key]} 
                onChange={handleChange}
                placeholder={`Enter ${coin.id} receiving address...`}
                className="w-full bg-dark-secondary border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary font-mono text-xs" 
              />
            </div>
          ))}

          <div className="md:col-span-2 pt-4 border-t border-white/5 mt-2 flex justify-end">
            <button 
              type="submit" 
              disabled={isSaving} 
              className="bg-primary hover:bg-primary-dark disabled:opacity-70 text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
