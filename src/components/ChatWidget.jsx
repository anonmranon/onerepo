import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Minimize2, Maximize2, ChevronDown } from 'lucide-react';

// ─── Liquid Broker Knowledge Base ─────────────────────────────────────────────
const KB = {
  // Greetings
  greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy'],

  // Core platform info
  about: {
    triggers: ['who are you', 'what is liquid', 'about liquid', 'about the company', 'tell me about', 'what do you do', 'who is liquid broker'],
    response: `**Liquid Broker** is a premier online trading platform offering access to a wide range of financial instruments including Forex, Crypto, Share CFDs, Indices, and Commodities. We are regulated, client-focused, and committed to providing world-class trading conditions and support.

We offer:
• **300+ trading instruments** across multiple asset classes
• **MetaTrader 5 (MT5)** — the world's most popular trading platform
• **Multiple account types** — Standard, Pro, VIP, and Demo
• **24/5 dedicated support** for all our clients`
  },

  // Account Types
  accounts: {
    triggers: ['account type', 'what accounts', 'demo account', 'live account', 'standard account', 'pro account', 'vip account', 'open account'],
    response: `We offer **4 account types** at Liquid Broker:

🟢 **Demo Account** — Start with $10,000 virtual funds. Practice risk-free with real market conditions. Perfect for beginners.

🔵 **Standard Account** — Entry-level live trading. Low spreads, no commission. Minimum deposit required.

🟡 **Pro Account** — For experienced traders. Tighter spreads, faster execution, advanced tools.

🔴 **VIP Account** — Exclusive conditions, dedicated account manager, priority support, custom leverage.

You can open an account at: **/create-account**`
  },

  // Markets & Instruments
  markets: {
    triggers: ['forex', 'crypto', 'cryptocurrency', 'bitcoin', 'stock', 'indices', 'commodity', 'gold', 'oil', 'what can i trade', 'markets', 'instruments', 'assets'],
    response: `At Liquid Broker, you can trade **300+ instruments** across 5 major asset classes:

📈 **Forex** — EUR/USD, GBP/USD, USD/JPY, AUD/USD, and 30+ more currency pairs
🪙 **Crypto** — BTC, ETH, SOL, XRP, ADA, BNB, DOGE, MATIC, DOT, LTC, and more
📊 **Indices** — S&P 500, NASDAQ 100, Dow Jones, FTSE 100, DAX 40
🥇 **Commodities** — Gold (XAU/USD), Silver, Crude Oil (WTI & Brent), Natural Gas
🏢 **Share CFDs** — Trade global equities as CFDs without owning the shares`
  },

  // Deposits
  deposits: {
    triggers: ['deposit', 'fund', 'add money', 'top up', 'how to pay', 'payment method', 'minimum deposit', 'how to deposit'],
    response: `**How to Deposit at Liquid Broker:**

1. Log in to your **client dashboard**
2. Navigate to **Wallet → Deposit**
3. Select your preferred method:
   - 🏦 Bank Wire Transfer
   - 🪙 Cryptocurrency (BTC, ETH, USDT, BNB, SOL, XRP, ADA, DOGE, MATIC, DOT, LTC)
4. Submit your deposit request
5. Admin reviews and **approves the deposit** — funds are credited to your main wallet
6. Transfer funds to your trading account to start trading!

Deposits are processed manually by our team to ensure security.`
  },

  // Withdrawals
  withdrawals: {
    triggers: ['withdraw', 'withdrawal', 'take out money', 'cashout', 'cash out', 'get my money'],
    response: `**How to Withdraw from Liquid Broker:**

1. Log in and go to **Wallet → Withdraw**
2. Enter the amount and your preferred withdrawal method
3. Submit the request — our team reviews it within 1-3 business days
4. Funds are sent to your designated bank account or crypto wallet

**Important:** You must complete **KYC Verification** (identity + proof of address) before withdrawals are processed.`
  },

  // KYC
  kyc: {
    triggers: ['kyc', 'verification', 'identity', 'id', 'verify', 'document', 'proof of address', 'verify my account', 'how to verify'],
    response: `**KYC (Know Your Customer) Verification** at Liquid Broker:

You need to submit **2 documents** to get verified:

1. 🪪 **Government-Issued ID** — Passport, National ID card, or Driver's License
2. 🏠 **Proof of Address** — Bank statement or utility bill (less than 3 months old)

**How to submit:**
- Log in to your **Dashboard → Identity Verification (KYC)**
- Upload your documents
- Our team reviews within 1-2 business days
- Once approved, you unlock withdrawals and higher trading limits`
  },

  // Trading
  trading: {
    triggers: ['how to trade', 'place order', 'buy', 'sell', 'lot', 'leverage', 'stop loss', 'take profit', 'margin', 'spread', 'how do i trade'],
    response: `**How to Trade at Liquid Broker:**

1. **Open a Trading Account** in your Dashboard
2. **Fund it** by transferring from your main wallet
3. Go to **Dashboard → Trade Now**
4. Select your **market** (Crypto, Forex, Indices, Commodities)
5. Choose your **instrument** (e.g. BTC/USD)
6. Set your **order details:**
   - Volume (Lots) — how much you're trading
   - Stop Loss — limit your downside risk
   - Take Profit — automatically lock in profits
7. Click **BUY** (if you think price goes up) or **SELL** (if you think it goes down)

We support Market, Limit, and Stop order types. Leverage up to 1:500 available on select accounts.`
  },

  // Platforms
  platforms: {
    triggers: ['metatrader', 'mt5', 'platform', 'app', 'mobile app', 'trading platform', 'download'],
    response: `**Liquid Broker supports MetaTrader 5 (MT5)** — the world's most popular trading platform.

Available on:
- 🖥️ **Windows Desktop** — Full-featured with advanced charting
- 🍎 **Mac** — Native macOS application
- 📱 **iOS** (iPhone/iPad) — Trade on the go
- 🤖 **Android** — Full mobile trading suite
- 🌐 **WebTrader** — Trade directly in your browser, no download needed

**Features:** 80+ technical indicators, 21 timeframes, Expert Advisors (automated trading), and built-in economic calendar.

Visit **/platforms** to learn more and download.`
  },

  // Fees & Spreads
  fees: {
    triggers: ['fee', 'cost', 'commission', 'spread', 'how much does it cost', 'charges', 'pricing'],
    response: `**Liquid Broker Fees & Pricing:**

- **Standard Account:** Spreads from 1.2 pips, no commission
- **Pro Account:** Spreads from 0.6 pips, small commission per trade
- **VIP Account:** Ultra-low spreads from 0.0 pips, commission-based

There are **no deposit fees** from our side (your bank or crypto network may charge small fees).

Withdrawal fees depend on the method used. Contact our support for exact rates on your account type.`
  },

  // Partnership / Affiliate
  partnership: {
    triggers: ['partner', 'affiliate', 'ib', 'introducing broker', 'refer', 'referral', 'partnership'],
    response: `**Liquid Broker Partnership Program:**

We offer excellent opportunities for:
- 🤝 **Introducing Brokers (IBs)** — Earn commissions for every client you refer
- 📊 **Affiliates** — Promote Liquid Broker and earn performance-based payouts
- 🏢 **White Label** — Launch your own branded trading solution powered by our infrastructure

**Benefits:**
- High commission rates
- Real-time tracking dashboard
- Dedicated partner support

To apply, visit **/company/partnership** or contact us directly.`
  },

  // Contact / Support
  contact: {
    triggers: ['contact', 'support', 'help', 'email', 'phone', 'talk to someone', 'customer service', 'live chat'],
    response: `**Liquid Broker Support:**

We're here to help 24 hours a day, 5 days a week (Mon–Fri).

📧 **Email:** support@liquidbroker.com
💬 **Live Chat:** Available on our website
📞 **Phone:** Contact us via the form for a callback

You can also visit our **Contact page** at **/contact** to send us a direct message.`
  },

  // Education
  education: {
    triggers: ['learn', 'education', 'tutorial', 'course', 'training', 'beginner', 'how do i start', 'getting started', 'new to trading'],
    response: `**Liquid Broker Education Centre:**

Whether you're a complete beginner or an experienced trader, we have resources for you:

📚 **Forex Course** — Step-by-step guide to Forex trading fundamentals
📈 **Trading Strategies** — Technical and fundamental analysis techniques
📰 **Market News** — Stay updated with global financial news
🎓 **Webinars** — Live sessions with our expert analysts

Visit **/education** to access all our free learning materials.`
  },

  // Regulation / Safety
  regulation: {
    triggers: ['regulated', 'safe', 'security', 'is liquid safe', 'trust', 'licence', 'license', 'is this legit'],
    response: `**Is Liquid Broker Safe?**

Yes! We take client security and transparency very seriously:

🛡️ **Regulation:** Liquid Broker operates under strict financial regulatory frameworks
🔒 **Fund Segregation:** Client funds are held in segregated accounts, separate from company funds
🔐 **Data Security:** Industry-standard SSL encryption on all data transmissions
✅ **KYC/AML:** We enforce Know Your Customer and Anti-Money Laundering policies

We are committed to maintaining a safe, fair, and transparent trading environment for all our clients.`
  },

  // Default / fallback
  default: `I'm the **Liquid Broker AI Assistant** and I can help you with information about our platform! 🤖

Here are some things I can help with:
- 📋 **Account Types** — Demo, Standard, Pro, VIP
- 💰 **Deposits & Withdrawals**
- 📈 **Markets & Instruments** — Forex, Crypto, Indices, Commodities
- 🪪 **KYC Verification**
- 💹 **How to Trade**
- 🖥️ **Trading Platforms (MT5)**
- 🤝 **Partnerships**

Just type your question and I'll do my best to help!`
};

function getBotResponse(message) {
  const lower = message.toLowerCase().trim();

  // Greetings
  if (KB.greetings.some(g => lower.includes(g))) {
    return `Hello! 👋 Welcome to **Liquid Broker**! I'm your AI assistant. How can I help you today?\n\n${KB.default}`;
  }

  // Check all categories
  const categories = ['about', 'accounts', 'markets', 'deposits', 'withdrawals', 'kyc', 'trading', 'platforms', 'fees', 'partnership', 'contact', 'education', 'regulation'];
  for (const cat of categories) {
    if (KB[cat].triggers?.some(t => lower.includes(t))) {
      return KB[cat].response;
    }
  }

  return KB.default;
}

function formatMessage(text) {
  // Convert **bold** and • bullets
  return text
    .split('\n')
    .map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-white font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      return <span key={i}>{parts}<br /></span>;
    });
}

const SUGGESTED = [
  'What accounts do you offer?',
  'How do I deposit funds?',
  'How do I verify my account?',
  'What markets can I trade?',
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: `Hello! 👋 Welcome to **Liquid Broker**! I'm your AI assistant. I can answer questions about our platform, accounts, trading, and more.\n\nHow can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
      setHasNew(false);
    }
  }, [open, messages]);

  const sendMessage = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    const userMsg = { id: Date.now(), from: 'user', text: msg };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(msg);
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: response }]);
      setIsTyping(false);
      if (!open) setHasNew(true);
    }, 800 + Math.random() * 600);
  };

  return (
    <>
      {/* Chat bubble toggle */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {!open && (
          <div className="bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-xs text-body-dark shadow-xl animate-fade-in max-w-[180px]">
            💬 Chat with our AI
          </div>
        )}
        <button
          onClick={() => { setOpen(o => !o); setHasNew(false); }}
          className="relative w-14 h-14 rounded-full bg-primary shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:bg-primary-dark transition-all hover:scale-110 flex items-center justify-center"
          aria-label="Open chat"
        >
          {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
          {hasNew && !open && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-dark animate-pulse" />
          )}
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div className={`fixed bottom-24 right-6 z-50 w-[350px] max-w-[calc(100vw-24px)] bg-dark-secondary border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all ${minimized ? 'h-14' : 'h-[500px]'}`}>
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary/90 backdrop-blur shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-bold leading-none">Liquid Assistant</p>
                <p className="text-white/70 text-[10px] mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span> Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setMinimized(m => !m)} className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                {minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-none">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                    {msg.from === 'bot' && (
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mb-0.5">
                        <Bot className="w-3 h-3 text-primary" />
                      </div>
                    )}
                    <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      msg.from === 'user'
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-dark border border-white/5 text-body-dark rounded-bl-sm'
                    }`}>
                      {msg.from === 'bot' ? formatMessage(msg.text) : msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mb-0.5">
                      <Bot className="w-3 h-3 text-primary" />
                    </div>
                    <div className="bg-dark border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-body-dark rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
                        <span className="w-1.5 h-1.5 bg-body-dark rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                        <span className="w-1.5 h-1.5 bg-body-dark rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Suggested questions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2 flex flex-col gap-1.5">
                  <p className="text-body-dark text-[10px] font-semibold uppercase tracking-wider">Suggested</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED.map(q => (
                      <button key={q} onClick={() => sendMessage(q)}
                        className="text-[10px] bg-white/5 hover:bg-primary/20 text-body-dark hover:text-primary border border-white/10 hover:border-primary/30 px-2.5 py-1.5 rounded-full transition-colors">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="px-3 py-3 border-t border-white/5 flex gap-2 shrink-0">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-dark border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder-body-dark focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim()}
                  className="w-9 h-9 bg-primary hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
