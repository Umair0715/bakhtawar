import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const questions = [
  {
    question: 'Agar main aik dessert hota, toh kaun sa hota?',
    options: ['Gulab Jamun 🍮', 'Ice Cream 🍦', 'Chocolate Cake 🍰', 'Jalebi 🧡'],
    correct: 0,
    wrongReactions: [
      'Nahi yaar! Main itna meetha hoon! 😄',
      'Galat! Try again! 🤭',
      'Oho! Soch kar batao! 😅'
    ]
  },
  {
    question: 'Tumhare saath perfect date kaunsi hogi?',
    options: ['Movie 📺', 'Fancy Restaurant 🍽️', 'Beach Walk 🌊', 'Anything with me 🙈'],
    correct: 4,
    wrongReactions: [
      'Nope! Aur soch lo! 🤔',
      'Galat jawab! Phir try karo! 😜',
      'Aise nahi chalega! 😂'
    ]
  },
  {
    question: 'Hum dono mein kaun ek dusre se zyada pyaar karta hai?',
    options: ['Umair 💖', 'Bakhtawar 💕'],
    correct: 0,
    isSpecial: true,
    wrongReactions: [
      'Main zyada karta hoon isliye ye option nahi choose kar sakti tum! 😏'
    ]
  },

]

export default function Quiz({ onComplete }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [reaction, setReaction] = useState(null)
  const [showWrongMsg, setShowWrongMsg] = useState(false)

  const handleWrongBtnClick = () => {
    setShowWrongMsg(true)
    setReaction({ type: 'wrong', text: questions[currentQ].wrongReactions[0] })
    setTimeout(() => setReaction(null), 2500)
  }

  const handleAnswer = (index) => {
    const isCorrect = index === questions[currentQ].correct
    
    if (isCorrect) {
      setScore(score + 1)
      setReaction({ type: 'correct', text: 'Sahi jawab! 🎉' })
      setTimeout(() => {
        if (currentQ < questions.length - 1) {
          setCurrentQ(currentQ + 1)
          setReaction(null)
        } else {
          onComplete(score + 1)
        }
      }, 1500)
    } else {
      const wrongMsg = questions[currentQ].wrongReactions[Math.floor(Math.random() * 3)]
      setReaction({ type: 'wrong', text: wrongMsg })
      setTimeout(() => setReaction(null), 2000)
    }
  }

  return (
    <div className="page">
      <div className="glow" aria-hidden="true" />
      <motion.main
        className="home"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="hero">
          <div className="hero-text" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <motion.p className="tag">Question {currentQ + 1} of {questions.length}</motion.p>
            <motion.h2
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', margin: '16px 0 24px' }}
              key={currentQ}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {questions[currentQ].question}
            </motion.h2>

            <div style={{ display: 'grid', gap: '12px', maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
              {questions[currentQ].isSpecial ? (
                <>
                  <motion.button
                    className="btn"
                    style={{
                      background: '#fff',
                      color: 'var(--accent-strong)',
                      border: '2px solid var(--accent-soft)',
                      width: '100%',
                      padding: '16px'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(0)}
                    disabled={reaction !== null}
                  >
                    {questions[currentQ].options[0]}
                  </motion.button>
                  <motion.button
                    className="btn"
                    style={{
                      background: '#fff',
                      color: 'var(--accent-strong)',
                      border: '2px solid var(--accent-soft)',
                      width: '100%',
                      padding: '16px',
                      cursor: 'not-allowed',
                      opacity: showWrongMsg ? 0.6 : 1
                    }}
                    onClick={handleWrongBtnClick}
                    whileHover={{ scale: showWrongMsg ? 1 : 1.02 }}
                    whileTap={{ scale: showWrongMsg ? 1 : 0.98 }}
                  >
                    {questions[currentQ].options[1]}
                  </motion.button>
                </>
              ) : (
                questions[currentQ].options.map((option, index) => (
                  <motion.button
                    key={index}
                    className="btn"
                    style={{
                      background: '#fff',
                      color: 'var(--accent-strong)',
                      border: '2px solid var(--accent-soft)',
                      width: '100%',
                      padding: '16px'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(index)}
                    disabled={reaction !== null}
                  >
                    {option}
                  </motion.button>
                ))
              )}
            </div>

            <AnimatePresence>
              {reaction && (
                <motion.div
                  className="message-chip"
                  style={{ marginTop: '24px', display: 'inline-flex' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <span className="emoji">{reaction.type === 'correct' ? '✅' : '❌'}</span>
                  <span>{reaction.text}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.main>
    </div>
  )
}
