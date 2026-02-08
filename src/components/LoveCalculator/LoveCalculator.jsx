import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const loadingMessages = [
  'Calculating compatibility... 💕',
  'Analyzing chemistry... 🧪',
  'Measuring cuteness levels... 🥰',
  'Checking heart signals... 💓',
  'Processing love data... 📊',
  'Almost there... ✨'
]

export default function LoveCalculator({ score }) {
  const [loading, setLoading] = useState(true)
  const [msgIndex, setMsgIndex] = useState(0)
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 800)

    setTimeout(() => {
      clearInterval(msgInterval)
      setLoading(false)
      
      let count = 0
      const interval = setInterval(() => {
        count += 2
        setPercentage(count)
        if (count >= 100) clearInterval(interval)
      }, 20)
    }, 4500)

    return () => clearInterval(msgInterval)
  }, [])

  return (
    <div className="page">
      <div className="glow" aria-hidden="true" />
      <motion.main
        className="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="hero" style={{ textAlign: 'center' }}>
          <div className="hero-text" style={{ gridColumn: '1 / -1' }}>
            {loading ? (
              <>
                <motion.div
                  className="heart"
                  style={{ margin: '0 auto 32px', width: '120px', height: '120px' }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.h2
                  key={msgIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}
                >
                  {loadingMessages[msgIndex]}
                </motion.h2>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <motion.p className="tag">Love Calculator Result</motion.p>
                <motion.div
                  style={{
                    fontSize: 'clamp(4rem, 10vw, 8rem)',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-strong))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: '24px 0'
                  }}
                >
                  {percentage}%
                </motion.div>
                <motion.h2
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: '16px' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Perfect Match! 💖
                </motion.h2>
                <motion.p
                  className="subtitle"
                  style={{ maxWidth: '600px', margin: '0 auto' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Bakhtawar, tumhara aur mera connection toh ekdum perfect hai! 
                  Science bhi yahi keh rahi hai! Ya phir maine Science ko majboor kar diya ye kehne pe! 😏🥰✨
                </motion.p>
                <motion.div
                  style={{ marginTop: '32px', fontSize: '3rem' }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                >
                  💕💖💕
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.main>
    </div>
  )
}
