import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const teaseMessages = [
  { text: 'Aisa nahi karo, main mar jaunga.', emoji: '🥺' },
  { text: 'Mat kro, Tumhein tumhari sweet c mummy ki qasam.', emoji: '🌸' },
  { text: 'Please accept kar lo.', emoji: '🙏' },
  { text: 'Mat kro, dil toot jaayega.', emoji: '💔' },
  { text: 'Mana kiya tw Allah kry tum or moti ho jao.', emoji: '😅' },
  { text: 'Tumhare bina Valentine ka kya maza?', emoji: '🎈' },
  { text: 'No button kaam nahi karega, yes hi karna hai!', emoji: '😏' },
  { text: 'Itna pyara offer reject kar rahi ho? Soch lo!', emoji: '🌟' },
]

const buttonSize = { width: 140, height: 56 }

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max))
}

function getShiftedPosition(viewport, current, maxShift) {
  const padding = 24
  const maxX = viewport.width - buttonSize.width - padding
  const maxY = viewport.height - buttonSize.height - padding

  const shift = () =>
    Math.floor(Math.random() * (maxShift.max - maxShift.min + 1) + maxShift.min) *
    (Math.random() < 0.5 ? -1 : 1)

  const nextX = clamp(current.x + shift(), padding, maxX)
  const nextY = clamp(current.y + shift(), padding, maxY)

  return { x: nextX, y: nextY }
}

export default function Home({ onAccept }) {
  const [viewport, setViewport] = useState({ width: 1200, height: 800 })
  const [noPos, setNoPos] = useState({ x: 0, y: 0 })
  const [messageIndex, setMessageIndex] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(null)
  const [escaped, setEscaped] = useState(false)
  const [yesHovered, setYesHovered] = useState(false)

  useEffect(() => {
    const update = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const padding = 24
    const maxX = viewport.width - buttonSize.width - padding
    const maxY = viewport.height - buttonSize.height - padding
    setNoPos({
      x: clamp(Math.floor(viewport.width / 2 + 120), padding, maxX),
      y: clamp(Math.floor(viewport.height / 2 + 120), padding, maxY),
    })
  }, [viewport])

  const nextMessage = useMemo(
    () => teaseMessages[messageIndex % teaseMessages.length],
    [messageIndex]
  )

  const handleNoHover = () => {
    const shifted = getShiftedPosition(viewport, noPos, { min: 200, max: 380 })
    setNoPos(shifted)
    setMessageIndex((prev) => prev + 1)
    setCurrentMessage(nextMessage)
    setEscaped(true)
  }

  return (
    <div className="page">
      <div className="glow" aria-hidden="true" />
      <motion.main
        className="home"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="message-slot" aria-live="polite" style={{ minHeight: '70px' }}>
          <AnimatePresence mode="wait">
            {yesHovered && (
              <motion.div
                className="message-chip"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className="emoji"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  💕
                </motion.span>
                <span>Han han, yes karo! Perfect choice! 🥰</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hero">
          <motion.div
            className="hero-art"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
          >
            <div className="heart" />
            <div className="sparkle s1" />
            <div className="sparkle s2" />
            <div className="sparkle s3" />
          </motion.div>
          <div className="hero-text">
            <motion.p
              className="tag"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              Happy Valentine
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
            >
              Bakhtawar
            </motion.h1>
            <motion.p
              className="subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Will you be my Valentine? 
            </motion.p>

            <div className="cta-row">
              <motion.button
                className="btn btn-yes"
                onMouseEnter={() => setYesHovered(true)}
                onMouseLeave={() => setYesHovered(false)}
                onClick={onAccept}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Yes
              </motion.button>
              {!escaped && (
                <motion.button
                  className="btn btn-no inline"
                  onMouseEnter={handleNoHover}
                  onFocus={handleNoHover}
                  whileHover={{ scale: 1.02 }}
                >
                  No
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {escaped && (
          <motion.button
            className="btn btn-no floating"
            onMouseEnter={handleNoHover}
            onFocus={handleNoHover}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              left: noPos.x, 
              top: noPos.y 
            }}
            transition={{ 
              left: { type: 'spring', stiffness: 300, damping: 25 },
              top: { type: 'spring', stiffness: 300, damping: 25 },
              opacity: { duration: 0.2 }
            }}
          >
            No
          </motion.button>
        )}

        <div className="message-slot" aria-live="polite">
          <AnimatePresence mode="wait">
            {currentMessage && (
              <motion.div
                className="message-chip"
                key={`${currentMessage.text}-${messageIndex}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35 }}
              >
                <span className="emoji" aria-hidden="true">
                  {currentMessage.emoji}
                </span>
                <span>{currentMessage.text}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  )
}
