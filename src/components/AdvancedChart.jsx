import { useId, useEffect } from 'react';

/**
 * TradingView Advanced Chart — live real-time charting.
 * Accepts a `symbol` prop (default BTC/USD) and `height` in px.
 */
export default function AdvancedChart({ symbol = 'BITSTAMP:BTCUSD', height = 500 }) {
  const uid = 'tv-chart-' + useId().replace(/:/g, '');

  useEffect(() => {
    const container = document.getElementById(uid);
    if (!container || container.querySelector('script')) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.text = JSON.stringify({
      autosize: true,
      symbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: 'rgba(0,0,0,0)',
      gridColor: 'rgba(255,255,255,0.05)',
      allow_symbol_change: true,
      calendar: false,
      support_host: 'https://www.tradingview.com',
    });

    container.appendChild(script);
  }, [uid, symbol]);

  return (
    <div
      id={uid}
      className="tradingview-widget-container w-full rounded-xl overflow-hidden"
      style={{ height: `${height}px` }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: `${height - 32}px`, width: '100%' }}
      />
    </div>
  );
}
