import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import SignatureCanvas from 'react-signature-canvas'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

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
  const signaturePadRef = useRef(null)
  const [signatureError, setSignatureError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const handlePermissionSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')

    const pad = signaturePadRef.current
    if (!pad || pad.isEmpty()) {
      setSignatureError('Please add your signature first.')
      return
    }

    const signatureDataUrl = pad.toDataURL('image/png')
    setSignatureError('')

    const payload = {
      person: 'Bakhtwar',
      accepted: true,
      giftChoice: selectedGift,
      customGift: selectedGift.includes('Other') ? otherGift.trim() : '',
      signature: signatureDataUrl,
      submittedAt: new Date().toISOString(),
    }

    try {
      setIsSubmitting(true)

      const response = await fetch(`${API_BASE_URL}/api/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        const message = result?.message || 'Submission failed. Please try again.'
        throw new Error(message)
      }

      setSubmission(payload)
      setStage('success')
    } catch (error) {
      setSubmitError(error.message || 'Unable to connect to server.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClearSignature = () => {
    signaturePadRef.current?.clear()
    setSignatureError('')
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
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <Motion.div 
              className="kiss-card"
              initial={{ rotateY: -10 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Motion.img 
                src="/kiss-gif.gif" 
                alt="Celebration kiss" 
                className="kiss-gif"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              />
              <Motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                I knew it! 💖
              </Motion.h2>
              <Motion.p
                className="celebration-highlight"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Congratulations Bakhtawar, You are now officially Umair&apos;s Valentine
                forever, always, and beyond. 💖
              </Motion.p>
              <Motion.p
                className="form-text"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
              >
                Chalo ab neechy walay button par click karo.
              </Motion.p>
              <Motion.button 
                className="btn btn-yes" 
                onClick={() => setStage('gift')}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                Gift for You
              </Motion.button>
            </Motion.div>
          </Motion.section>
        )}

        {stage === 'gift' && (
          <Motion.section
            key="gift"
            className="stage-card overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <Motion.form 
              className="form-card gift-form-card" 
              onSubmit={handleGiftSubmit}
              initial={{ rotateY: -10 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Choose Your Gift 🎁
              </Motion.h2>
              <Motion.p 
                className="form-text"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Jo tum select karo gi wohi final.
              </Motion.p>

              <Motion.div 
                className="gift-options"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {giftOptions.map((gift, index) => (
                  <Motion.label 
                    key={gift} 
                    className="gift-option"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <input
                      type="radio"
                      name="gift"
                      value={gift}
                      checked={selectedGift === gift}
                      onChange={(event) => setSelectedGift(event.target.value)}
                    />
                    <span>{gift}</span>
                  </Motion.label>
                ))}
              </Motion.div>

              {selectedGift.includes('Other') && (
                <Motion.div 
                  className="field-wrap"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <label htmlFor="otherGift">Bakhtawar tm mjhe likh kr btao tmhein kya gift chiye.</label>
                  <textarea
                    id="otherGift"
                    rows="4"
                    value={otherGift}
                    onChange={(event) => setOtherGift(event.target.value)}
                    placeholder="Apna gift idea yahan likho..."
                    required
                  />
                </Motion.div>
              )}

              <Motion.button 
                type="submit" 
                className="btn btn-yes"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                Submit Gift Choice
              </Motion.button>
            </Motion.form>
          </Motion.section>
        )}

        {stage === 'permission' && (
          <Motion.section
            key="permission"
            className="stage-card"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <Motion.form 
              className="form-card" 
              onSubmit={handlePermissionSubmit}
              initial={{ rotateY: -10 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Ek Choti Si Request ✍️
              </Motion.h2>
              <Motion.p 
                className="form-text"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Main gift bhejny ko ready hon but mjhe tmhari mama sy permission chiye,
                mjhe unsy dar lgta tw naraz ni krna chahta hun.
              </Motion.p>
              <Motion.div 
                className="field-wrap"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <label>Aunty k Signature</label>
                <div className="signature-wrap">
                  <SignatureCanvas
                    ref={signaturePadRef}
                    penColor="#8b1f4f"
                    canvasProps={{
                      className: 'signature-canvas',
                    }}
                  />
                </div>
                {signatureError && <p className="error-text">{signatureError}</p>}
                {submitError && <p className="error-text">{submitError}</p>}
                <Motion.button
                  type="button"
                  className="btn btn-no inline signature-clear"
                  onClick={handleClearSignature}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear Signature
                </Motion.button>
              </Motion.div>
              <Motion.button 
                type="submit" 
                className="btn btn-yes"
                disabled={isSubmitting}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? 'Submitting...' : 'Final Submit'}
              </Motion.button>
            </Motion.form>
          </Motion.section>
        )}

        {stage === 'success' && submission && (
          <Motion.section
            key="success"
            className="stage-card"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <Motion.div 
              className="success-card"
              initial={{ rotateY: -10 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Thanks Bakhtawar for your time 🌹
              </Motion.h2>
              <Motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Your gift is on the way. Bas tum hasti muskurati raho aur mujhe aise hi
                bohat saara pyaar karti raho. Love you.
              </Motion.p>
              {/* <Motion.div 
                className="summary-box"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <p>
                  <strong>Gift:</strong>{' '}
                  {submission.customGift || submission.giftChoice}
                </p>
                <p>Love approved by: {submission.person}</p>
              </Motion.div> */}
            </Motion.div>
          </Motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
