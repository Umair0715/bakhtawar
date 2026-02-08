import { useState } from 'react'
import './App.css'
import Home from './components/Home/Home'
import Quiz from './components/Quiz/Quiz'
import LoveCalculator from './components/LoveCalculator/LoveCalculator'

function App() {
  const [stage, setStage] = useState('proposal') // proposal, quiz, calculator
  const [quizScore, setQuizScore] = useState(0)

  const handleAccept = () => setStage('quiz')
  
  const handleQuizComplete = (score) => {
    setQuizScore(score)
    setStage('calculator')
  }

  return (
    <>
      {stage === 'proposal' && <Home onAccept={handleAccept} />}
      {stage === 'quiz' && <Quiz onComplete={handleQuizComplete} />}
      {stage === 'calculator' && <LoveCalculator score={quizScore} />}
    </>
  )
}

export default App
