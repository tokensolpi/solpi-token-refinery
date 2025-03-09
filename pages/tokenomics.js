import Head from 'next/head'

export default function Tokenomics() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head>
        <title>Solpi Token Refinery | Tokenomics</title>
      </Head>
      <h1 className="text-5xl font-extrabold mb-10 bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">SOLPI Tokenomics</h1>
      <div className="max-w-4xl w-full">
        <p className="text-lg mb-6">SOLPI powers Solpi Token Refinery—forging fast Solana swaps, staking rewards, and governance, with future tech to trailblaze.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Distribution</h2>
            <ul className="space-y-2">
              <li>40% - Pre-Buy & Public Sale (40M SOLPI) - Funding live soon</li>
              <li>20% - Team (20M SOLPI) - Equal split among founder and devs at $1M TVL</li>
              <li>20% - Liquidity Pools (20M SOLPI) - SOLPI/SOL, SOLPI/USDC</li>
              <li>10% - Staking Rewards (10M SOLPI) - 5-10% APY</li>
              <li>10% - Treasury (10M SOLPI) - Growth and future tech</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Mechanics</h2>
            <ul className="space-y-2">
              <li>Total Supply: 100M SOLPI - Fixed and scarce</li>
              <li>Burn: 10% of swap fees burned quarterly - Deflationary</li>
              <li>Discount: 20% off fees with SOLPI - Utility boost</li>
              <li>Buyback: 15% profits buy SOLPI, half burned - Stability</li>
            </ul>
          </div>
        </div>
        <p className="mt-6 text-sm">Future: Mark/Anti-Mark tech, trackers, addiction treatment—SOLPI pre-buy fuels it. DM @solpi!</p>
        <p className="mt-2 text-center italic">“Equal stakes, refined value—Solpi Token Refinery forges the future.”</p>
      </div>
    </div>
  )
}
