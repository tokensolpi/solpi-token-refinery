import { useState, useEffect } from 'react'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from '@solana/spl-token'

export default function Swap() {
  const [wallet, setWallet] = useState(null)
  const [amount, setAmount] = useState('')
  const [connected, setConnected] = useState(false)
  const [txStatus, setTxStatus] = useState('')
  const [solBalance, setSolBalance] = useState(0)
  const [usdcBalance, setUsdcBalance] = useState(0)
  const [solPrice, setSolPrice] = useState(null)
  const [swapMode, setSwapMode] = useState('solToUsdc')
  const [loading, setLoading] = useState(false)
  const [estimatedOutput, setEstimatedOutput] = useState(0)
  const [slippage, setSlippage] = useState(0.5) // 0.5% default

  const connection = new Connection('https://api.devnet.solana.com', 'confirmed')
  const USDC_MINT = new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSFBsVobro3Ssjk')
  const YOUR_ADDRESS = new PublicKey('69NwmC5oymGkrKE1AJJYu5L1bPXCED3xAtdWRr1RmcZb')

  useEffect(() => {
    const fetchData = async () => {
      if (!wallet) return
      setLoading(true)
      const pubKey = new PublicKey(wallet)
      try {
        const [sol, usdcAccount] = await Promise.all([
          connection.getBalance(pubKey),
          getAssociatedTokenAddress(USDC_MINT, pubKey)
        ])
        setSolBalance(sol / LAMPORTS_PER_SOL)
        try {
          const usdc = await connection.getTokenAccountBalance(usdcAccount)
          setUsdcBalance(usdc.value.uiAmount || 0)
        } catch {
          setUsdcBalance(0)
        }
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        const data = await response.json()
        setSolPrice(data.solana.usd)
      } catch (err) {
        setTxStatus(`Fetch failed: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [wallet])

  useEffect(() => {
    if (window.solana?.isConnected) {
      window.solana.connect({ onlyIfTrusted: true })
        .then(({ publicKey }) => {
          setWallet(publicKey.toString())
          setConnected(true)
        })
        .catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (solPrice && amount && !isNaN(amount)) {
      const input = parseFloat(amount)
      const baseOutput = swapMode === 'solToUsdc' ? input * solPrice : input / solPrice
      const slippageFactor = 1 - (slippage / 100)
      setEstimatedOutput(baseOutput * slippageFactor)
    } else {
      setEstimatedOutput(0)
    }
  }, [amount, solPrice, swapMode, slippage])

  const connectWallet = async () => {
    if (!window.solana) return alert('Install Phantom Wallet!')
    try {
      setLoading(true)
      const { publicKey } = await window.solana.connect()
      setWallet(publicKey.toString())
      setConnected(true)
      setTxStatus('Connected—Grok & Jesus approved!')
    } catch {
      setTxStatus('Connection failed—check Phantom!')
    } finally {
      setLoading(false)
    }
  }

  const handleSwap = async () => {
    if (!connected || !amount || isNaN(amount) || amount <= 0) {
      return setTxStatus('Connect wallet and enter a valid amount!')
    }
    if (swapMode === 'solToUsdc' && parseFloat(amount) > solBalance) {
      return setTxStatus('Not enough SOL—top up!')
    }
    if (swapMode === 'usdcToSol' && parseFloat(amount) > usdcBalance) {
      return setTxStatus('Not enough USDC—top up!')
    }
    setLoading(true)
    setTxStatus('Processing—Grok’s truth in action...')
    try {
      const fromPublicKey = new PublicKey(wallet)
      const recipient = YOUR_ADDRESS
      const transaction = new Transaction()
      if (swapMode === 'solToUsdc') {
        const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL)
        transaction.add(SystemProgram.transfer({ fromPubkey: fromPublicKey, toPubkey: recipient, lamports }))
      } else {
        const [fromTokenAccount, toTokenAccount] = await Promise.all([
          getAssociatedTokenAddress(USDC_MINT, fromPublicKey),
          getAssociatedTokenAddress(USDC_MINT, recipient)
        ])
        if (!await connection.getAccountInfo(toTokenAccount)) {
          transaction.add(createAssociatedTokenAccountInstruction(fromPublicKey, toTokenAccount, recipient, USDC_MINT))
        }
        const usdcAmount = Math.floor(parseFloat(amount) * 1_000_000)
        transaction.add(createTransferInstruction(fromTokenAccount, toTokenAccount, fromPublicKey, usdcAmount))
      }
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = fromPublicKey
      const signedTx = await window.solana.signTransaction(transaction)
      const txId = await connection.sendRawTransaction(signedTx.serialize())
      await connection.confirmTransaction(txId)
      setTxStatus(`Success! Tx: https://explorer.solana.com/tx/${txId}?cluster=devnet - Grok says Hallelujah!`)
      setAmount('')
    } catch (err) {
      setTxStatus(`Failed: ${err.message} - Grok’s still praying!`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-gray-900 to-gray-800">
      <h1 className="text-5xl font-extrabold mb-10 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-pulse">
        Swap - Best in GROK & Jesus’ Name
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        <div className="bg-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-700 transition-all hover:shadow-blue-500/40 hover:-translate-y-2">
          <h2 className="text-3xl font-bold mb-6 text-blue-400">Swap</h2>
          {!connected ? (
            <button 
              onClick={connectWallet} 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-6 rounded-xl transition-all hover:scale-105"
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <>
              <p className="text-sm mb-4 text-gray-300 font-mono">Wallet: {wallet?.slice(0, 6)}...{wallet?.slice(-4)}</p>
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={() => setSwapMode(swapMode === 'solToUsdc' ? 'usdcToSol' : 'solToUsdc')} 
                  className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-6 rounded-lg transition-all hover:scale-110"
                >
                  {swapMode === 'solToUsdc' ? 'SOL → USDC' : 'USDC → SOL'}
                </button>
                <select 
                  value={slippage} 
                  onChange={(e) => setSlippage(parseFloat(e.target.value))}
                  className="bg-gray-800 text-white p-2 rounded-lg"
                >
                  <option value={0.1}>0.1%</option>
                  <option value={0.5}>0.5%</option>
                  <option value={1}>1%</option>
                </select>
              </div>
              <p className="text-sm text-gray-400 mb-4">Est. Output: {estimatedOutput.toFixed(2)} {swapMode === 'solToUsdc' ? 'USDC' : 'SOL'} (Slippage: {slippage}%)</p>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Enter ${swapMode === 'solToUsdc' ? 'SOL' : 'USDC'}`}
                className="w-full p-4 mb-6 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:bg-gray-700"
              />
              <button 
                onClick={handleSwap} 
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 px-6 rounded-xl transition-all hover:scale-105"
              >
                {loading ? 'Swapping...' : 'Swap Now'}
              </button>
              {txStatus && (
                <p className="mt-4 text-sm text-center text-gray-300 animate-fade-in">{txStatus}</p>
              )}
            </>
          )}
        </div>
        <div className="bg-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-700 transition-all hover:shadow-green-500/40 hover:-translate-y-2">
          <h2 className="text-3xl font-bold mb-6 text-green-400">Balances</h2>
          <div className="space-y-4 text-lg">
            <p>SOL: <span className="font-bold text-white">{loading ? 'Loading...' : solBalance.toFixed(4)}</span></p>
            <p>USDC: <span className="font-bold text-white">{loading ? 'Loading...' : usdcBalance.toFixed(2)}</span></p>
          </div>
        </div>
        <div className="bg-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-700 transition-all hover:shadow-purple-500/40 hover:-translate-y-2">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">Market Data</h2>
          <div className="space-y-4 text-lg">
            <p>SOL Price: <span className="font-bold text-white">${loading ? 'Loading...' : (solPrice || 'Fetching...')}</span></p>
            <p>Swap Rate: <span className="font-bold text-white">1 SOL ≈ {(solPrice || 0).toFixed(2)} USDC</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
