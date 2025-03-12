import { useEffect, useState } from 'react';

export default function Quiz() {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      const response = await fetch('/api/quiz');
      const data = await response.json();
      setQuizData(data.questions || []);
    }
    fetchQuiz();
  }, []);

  if (quizData.length === 0) return <div>Loading quiz...</div>;

  const currentQuestion = quizData[currentQuestionIndex];

  const handleAnswerClick = (option) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    setTimeout(() => setShowResult(true), 300);
  };

  const handleNextClick = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizEnded(true);
    }
  };

  return (
    <div style={styles.container}>
      {!quizEnded && <h2 style={styles.quizTitle}>Women’s Day Quick Quiz</h2>} {/* Title only for questions */}

      <div style={styles.card}>
        {!quizEnded ? (
          <>
            <p style={styles.question}>{currentQuestion.question}</p>

            {currentQuestion.options.map((option, index) => {
              const isCorrect = option === currentQuestion.correct_answer;
              const isSelected = option === selectedAnswer;
              return (
                <div
                  key={index}
                  onClick={() => {
                    if (selectedAnswer) return; // Prevent multiple selections
                    setSelectedAnswer(option);
              
                    if (option === currentQuestion.correct_answer) {
                      fireConfetti(); // 🎉 Trigger confetti animation
                    }
              
                    setTimeout(() => setShowResult(true), 300);
                  }} 

                  style={{
                    ...styles.optionBox,
                    borderColor: isSelected
                      ? isCorrect
                        ? 'green'
                        : 'red'
                      : '#ccc',
                  }}
                >
                  <span
                    style={{
                      ...styles.bullet,
                      borderColor: isSelected ? (isCorrect ? 'green' : 'red') : '#bbb',
                      backgroundColor: isSelected ? (isCorrect ? 'green' : 'red') : 'transparent',
                      animation: selectedAnswer && option !== currentQuestion.correct_answer ? 'shake 5s ease-in-out' : 'none',
                    }}
                  >
                    {isSelected ? (isCorrect ? '🎉' : '😔') : String.fromCharCode(65 + index)}

                  </span>
                  {option}
                </div>
              );
            })}

            {showResult && (
              <div style={styles.answerSection}>
                <p style={styles.correctAnswer}>
                  {selectedAnswer === currentQuestion.correct_answer
                    ? 'Correct Answer'
                    : `Correct Answer: ${currentQuestion.correct_answer}`}
                  {currentQuestionIndex % 3 === 2 && (
                    <span style={styles.specialMessage}> – Real change doesn't always need complexity😉</span>
                  )}
                </p>

                <div style={styles.storyCard}>
                  <img
                    src={currentQuestion.inventor_image_url}
                    alt="Inventor"
                    style={styles.image}
                  />
                  <p style={styles.story}>{currentQuestion.short_story}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleNextClick}
              disabled={!selectedAnswer}
              style={{
                ...styles.nextButton,
                backgroundColor: showResult ? '#51074a' : '#d69cbc',
              }}
            >
              Next
            </button>
          </>
        ) : (
          <>
            <h2>Thank You for Playing! 🎉</h2>
            <p style={styles.funFact}>{currentQuestion.fun_fact_comment}</p>
          </>
        )}
      </div>
    </div>
  );
}



const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    backgroundColor: 'white',
    animation: 'fadeIn 0.5s forwards',
  },
  card: {
    backgroundColor: '#FCF5E5',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'left',
    maxWidth: '500px',
    width: '70%',
    overflow: 'auto',
    scrollbarWidth: 'none', 
    marginTop: '20px',
    marginBottom: '20px',
    transition: 'all 0.5s ease',
  
  },
  quizTitle: {
    color: '#51074a',
    fontSize: '30px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  question: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#2a2a2a',
  },
  optionBox: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px',
    margin: '5px 0',
    borderRadius: '30px',
    border: '1px solid gray',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '90%',
  },
  bullet: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '10px',
    border: '1px solid #bbb',
    fontSize: '14px',
    backgroundColor: 'transparent',
  },
  answerSection: {
    marginTop: '10px',
    animation: 'fadeIn 0.7s forwards',
    textAlign: 'left',
  },
  correctAnswer: {
    fontSize: '14px',
    color: '#2a2a2a',    
    fontWeight: 'bold',
  },
  specialMessage: {
    fontSize: '15px',
    color: '#545454',
    marginLeft: '5px',
    },
  storyCard: {
    backgroundColor: '#FFFAF0',
    padding: '10px',
    borderRadius: '10px',
    marginTop: '10px',
    marginBottom: '10px',
  },
  image: {
    width: '100%',
    maxWidth: '200px',
    borderRadius: '8px',
    marginBottom: '10px',
    marginTop: '10px',
    animation: 'fadeIn 0.9s forwards'
  },
  story: {
    fontSize: '16px',
    color: 'gray',
    textAlign: 'left',
    marginBottom: '10px',
    marginTop: '10px',
    animation: 'fadeIn 2s forwards'
  },
  nextButton: {
    marginTop: '10px',
    padding: '8px 15px',
    border: 'none',
    color: 'white',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    alignSelf: 'flex-end', // Ensures right alignment
    display: 'block', // Makes it behave as a block element
    marginLeft: 'auto', // Pushes it to the right
  },
  funFact: {
    fontSize: '14px',
    color: '#51074a',
  },
  keyframesShake: {
    '0%': { transform: 'translateX(0)' },
    '25%': { transform: 'translateX(-3px)' },
    '50%': { transform: 'translateX(3px)' },
    '75%': { transform: 'translateX(-3px)' },
    '100%': { transform: 'translateX(0)' },
  },
};

import confetti from 'canvas-confetti';

const fireConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }, // Adjust origin for better effect
    colors: ['#ffb6c1', '#8f83d8', '#d69cbc', '#51074a', '#191970'],
  });
};

// Call `fireConfetti()` when the user selects the correct answer

const triggerSadEffect = (x, y) => {
  confetti({
    particleCount: 30,
    spread: 70,
    origin: { y: 0.6 }, // Adjust origin for better effect,
    colors: ['#ff0000', '#ff6961'],
  });
}; // Call `triggerSadEffect()` when the user selects the wrong answer