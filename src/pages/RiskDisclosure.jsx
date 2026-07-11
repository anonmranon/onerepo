export default function RiskDisclosure() {
  return (
    <div className="bg-dark min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-8">Risk Disclosure</h1>
        
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8">
          <p className="text-white font-bold mb-2">High Risk Investment Warning</p>
          <p className="text-body-dark text-sm">Trading foreign exchange (Forex) and Contracts for Differences (CFDs) on margin carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you.</p>
        </div>
        
        <div className="prose prose-invert max-w-none text-body-dark">
          <h2 className="text-white text-xl font-bold mt-8 mb-4">Leverage Risk</h2>
          <p className="mb-4">Leverage allows you to control a large position with a relatively small amount of capital. While this can magnify profits, it can also magnify losses. You could sustain a total loss of your initial margin funds and be required to deposit additional funds to maintain your position. If you fail to meet margin requirements, your position may be liquidated, and you will be responsible for any resulting deficit.</p>
          
          <h2 className="text-white text-xl font-bold mt-8 mb-4">Market Volatility</h2>
          <p className="mb-4">Financial markets can be highly volatile. Prices may move rapidly against your position, and market conditions such as "gapping" (where prices jump from one level to another without trading at intermediate prices) can make it impossible to execute stop-loss orders at your specified price.</p>
          
          <h2 className="text-white text-xl font-bold mt-8 mb-4">No Guarantees of Profit</h2>
          <p className="mb-4">There are no guarantees of profit or freedom from loss in Forex or CFD trading. You should not fund your trading account with money you cannot afford to lose, such as retirement savings, student loans, or mortgages.</p>

          <h2 className="text-white text-xl font-bold mt-8 mb-4">Technical Risks</h2>
          <p className="mb-4">Trading on an electronic trading system exposes you to risks associated with the system including the failure of hardware and software. The result of any system failure may be that your order is either not executed according to your instructions or is not executed at all.</p>
        </div>
      </div>
    </div>
  );
}
