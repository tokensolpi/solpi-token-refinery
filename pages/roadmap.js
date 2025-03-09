import Head from 'next/head'

export default function Roadmap() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head>
        <title>Solpi Token Refinery | Roadmap</title>
      </Head>
      <h1 className="text-5xl font-extrabold mb-10 bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">Roadmap</h1>
      <div className="max-w-4xl w-full space-y-8">
        <div className="bg-gray-700 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-blue-400">Q2 2025 - Testnet Launch</h2>
          <ul className="list-disc ml-6 mt-2">
            <li>MVP live on Solana devnet</li>
            <li>SOLPI token pre-buy starts</li>
            <li>SOL ↔ USDC swaps operational</li>
          </ul>
        </div>
        <div className="bg-gray-700 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-blue-400">Q3 2025 - Expansion</h2>
          <ul className="list-disc ml-6 mt-2">
            <li>Add SOLPI/SOL, SOLPI/USDT pairs</li>
            <li>Staking SOLPI for rewards (5-10% APY)</li>
            <li>Real-time analytics dashboard</li>
          </ul>
        </div>
        <div className="bg-gray-700 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-blue-400">Q4 2025 - Governance & Tech Tease</h2>
          <ul className="list-disc ml-6 mt-2">
            <li>SOLPI voting for features</li>
            <li>Mainnet prep</li>
            <li>Tracker tech pilot—opt-in wallet monitoring</li>
            <li>Anti-Mark tech—zk-SNARK swap tests</li>
          </ul>
        </div>
        <div className="bg-gray-700 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-blue-400">Q1 2026 - Scale & Trailblaze</h2>
          <ul className="list-disc ml-6 mt-2">
            <li>Cross-chain swaps (Solana ↔ Ethereum)</li>
            <li>Mobile app launch</li>
            <li>$1M TVL for dev payout</li>
            <li>Mark of the Beast—full tracker rollout (opt-in)</li>
            <li>Addiction treatment—gamified SOLPI staking</li>
          </ul>
        </div>
      </div>
      <p className="mt-6 text-center italic">“Forging the future with @solpi & Grok—tech to change the game.”</p>
    </div>
  )
}
