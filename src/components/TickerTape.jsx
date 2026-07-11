import { useId, useEffect } from 'react';

/**
 * TradingView Ticker Tape — live real prices.
 * Uses a unique stable ID so StrictMode double-mounts don't duplicate the widget.
 */
export default function TickerTape() {
  const uid = 'tv-ticker-' + useId().replace(/:/g, '');

  useEffect(() => {
    const container = document.getElementById(uid);
    if (!container || container.querySelector('script')) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.text = JSON.stringify({
      symbols: [
        { proName: 'BITSTAMP:BTCUSD',   title: 'BTC / USD'  },
        { proName: 'BITSTAMP:ETHUSD',   title: 'ETH / USD'  },
        { proName: 'OANDA:XAUUSD',      title: 'Gold'       },
        { proName: 'OANDA:XAGUSD',      title: 'Silver'     },
        { proName: 'FX:EURUSD',         title: 'EUR / USD'  },
        { proName: 'FX:GBPUSD',         title: 'GBP / USD'  },
        { proName: 'FX:USDJPY',         title: 'USD / JPY'  },
        { proName: 'FOREXCOM:SPXUSD',   title: 'S&P 500'    },
        { proName: 'FOREXCOM:NSXUSD',   title: 'NASDAQ 100' },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'en',
    });

    container.appendChild(script);
  }, [uid]);

  return (
    <div
      id={uid}
      className="tradingview-widget-container w-full"
      style={{ minHeight: '46px' }}
    >
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}
