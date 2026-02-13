import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'

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

const giftOptions = [
  'Jewelry set',
  'Skincare hamper',
  'Chocolate bouquet',
  'Perfume gift box',
  'Other (main apni marzi ka khud bataongi)',
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

function getInitialNoPos(viewport) {
  const padding = 24
  const maxX = viewport.width - buttonSize.width - padding
  const maxY = viewport.height - buttonSize.height - padding

  return {
    x: clamp(Math.floor(viewport.width / 2 + 120), padding, maxX),
    y: clamp(Math.floor(viewport.height / 2 + 120), padding, maxY),
  }
}

export default function Home() {
  const [stage, setStage] = useState('proposal')
  const [viewport, setViewport] = useState(() => ({ width: 1200, height: 800 }))
  const [noPos, setNoPos] = useState(() => getInitialNoPos({ width: 1200, height: 800 }))
  const [messageIndex, setMessageIndex] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(null)
  const [escaped, setEscaped] = useState(false)
  const [yesHovered, setYesHovered] = useState(false)

  const [selectedGift, setSelectedGift] = useState('')
  const [otherGift, setOtherGift] = useState('')
  const [signature, setSignature] = useState('')
  const [submission, setSubmission] = useState(null)

  useEffect(() => {
    const update = () => {
      const nextViewport = { width: window.innerWidth, height: window.innerHeight }
      setViewport(nextViewport)
      setNoPos(getInitialNoPos(nextViewport))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

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

  const handleGiftSubmit = (event) => {
    event.preventDefault()
    if (!selectedGift) return
    if (selectedGift.includes('Other') && !otherGift.trim()) return
    setStage('permission')
  }

  const handlePermissionSubmit = (event) => {
    event.preventDefault()
    if (!signature.trim()) return

    const payload = {
      person: 'Bakhtwar',
      accepted: true,
      giftChoice: selectedGift,
      customGift: selectedGift.includes('Other') ? otherGift.trim() : '',
      signature: signature.trim(),
      submittedAt: new Date().toISOString(),
    }

    const existing = JSON.parse(localStorage.getItem('valentineResponses') || '[]')
    existing.push(payload)
    localStorage.setItem('valentineResponses', JSON.stringify(existing))

    setSubmission(payload)
    setStage('success')
  }

  return (
    <div className={`page page-${stage}`}>
      <div className="glow" aria-hidden="true" />
      <AnimatePresence mode="wait">
        {stage === 'proposal' && (
          <Motion.main
            key="proposal"
            className="home"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="message-slot" aria-live="polite" style={{ minHeight: '70px' }}>
              <AnimatePresence mode="wait">
                {yesHovered && (
                  <Motion.div
                    className="message-chip"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Motion.span
                      className="emoji"
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      💕
                    </Motion.span>
                    <span>Han han, yes karo! Perfect choice! 🥰</span>
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hero">
              <Motion.div
                className="hero-art"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
              >
                <div className="heart" />
                <div className="sparkle s1" />
                <div className="sparkle s2" />
                <div className="sparkle s3" />
              </Motion.div>
              <div className="hero-text">
                <Motion.p
                  className="tag"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  For You
                </Motion.p>
                <Motion.h1
                  className="main-title"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.6 }}
                >
                  Hey Bakhtwar
                </Motion.h1>
                <Motion.p
                  className="subtitle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Will you be my Valentine?
                </Motion.p>

                <div className="cta-row">
                  <Motion.button
                    className="btn btn-yes"
                    onMouseEnter={() => setYesHovered(true)}
                    onMouseLeave={() => setYesHovered(false)}
                    onClick={() => setStage('celebration')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Yes
                  </Motion.button>
                  {!escaped && (
                    <Motion.button
                      className="btn btn-no inline"
                      onMouseEnter={handleNoHover}
                      onFocus={handleNoHover}
                      whileHover={{ scale: 1.02 }}
                    >
                      No
                    </Motion.button>
                  )}
                </div>
              </div>
            </div>

            {escaped && (
              <Motion.button
                className="btn btn-no floating"
                onMouseEnter={handleNoHover}
                onFocus={handleNoHover}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  left: noPos.x,
                  top: noPos.y,
                }}
                transition={{
                  left: { type: 'spring', stiffness: 300, damping: 25 },
                  top: { type: 'spring', stiffness: 300, damping: 25 },
                  opacity: { duration: 0.2 },
                }}
              >
                No
              </Motion.button>
            )}

            <div className="message-slot" aria-live="polite">
              <AnimatePresence mode="wait">
                {currentMessage && (
                  <Motion.div
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
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>
          </Motion.main>
        )}

        {stage === 'celebration' && (
          <Motion.section
            key="celebration"
            className="stage-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="kiss-card">
              <img src="/kiss-gif.gif" alt="Celebration kiss" className="kiss-gif" />
              <h2>I knew it! You made my day. 💖</h2>
              <p>
                Bakhtwar, tumhari smile meri favorite feeling hai. Is Valentine pe bas ek
                hi wish hai: hum dono ka har din itna hi pyara rahe.
              </p>
              <button className="btn btn-yes" onClick={() => setStage('gift')}>
                Gift for You
              </button>
            </div>
          </Motion.section>
        )}

        {stage === 'gift' && (
          <Motion.section
            key="gift"
            className="stage-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <form className="form-card" onSubmit={handleGiftSubmit}>
              <h2>Choose Your Gift 🎁</h2>
              <p className="form-text">Jo tum select karo gi wohi final.</p>

              <div className="gift-options">
                {giftOptions.map((gift) => (
                  <label key={gift} className="gift-option">
                    <input
                      type="radio"
                      name="gift"
                      value={gift}
                      checked={selectedGift === gift}
                      onChange={(event) => setSelectedGift(event.target.value)}
                    />
                    <span>{gift}</span>
                  </label>
                ))}
              </div>

              {selectedGift.includes('Other') && (
                <div className="field-wrap">
                  <label htmlFor="otherGift">Bakhtawar tm mjhe likh kr btao tmhein kya gift chiye.</label>
                  <textarea
                    id="otherGift"
                    rows="4"
                    value={otherGift}
                    onChange={(event) => setOtherGift(event.target.value)}
                    placeholder="Apna gift idea yahan likho..."
                    required
                  />
                </div>
              )}

              <button type="submit" className="btn btn-yes">
                Submit Gift Choice
              </button>
            </form>
          </Motion.section>
        )}

        {stage === 'permission' && (
          <Motion.section
            key="permission"
            className="stage-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <form className="form-card" onSubmit={handlePermissionSubmit}>
              <h2>Ek Choti Si Request ✍️</h2>
              <p className="form-text">
                Main gift bhejny ko ready hon but mjhe tmhari mama sy permission chiye,
                mjhe unsy dar lgta tw naraz ni krna chahta hun.
              </p>
              <div className="field-wrap">
                <label htmlFor="signature">Your Signature / Name</label>
                <input
                  id="signature"
                  type="text"
                  value={signature}
                  onChange={(event) => setSignature(event.target.value)}
                  placeholder="Type your signature"
                  required
                />
              </div>
              <button type="submit" className="btn btn-yes">
                Final Submit
              </button>
            </form>
          </Motion.section>
        )}

        {stage === 'success' && submission && (
          <Motion.section
            key="success"
            className="stage-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="success-card">
              <h2>All Done, My Valentine 🌹</h2>
              <p>Sab details save ho gai hain. Tumhari choice locked hai.</p>
              <div className="summary-box">
                <p>
                  <strong>Gift:</strong>{' '}
                  {submission.customGift || submission.giftChoice}
                </p>
                <p>
                  <strong>Signature:</strong> {submission.signature}
                </p>
                <p>
                  <strong>Saved In:</strong> localStorage key{' '}
                  <code>valentineResponses</code>
                </p>
              </div>
            </div>
          </Motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
