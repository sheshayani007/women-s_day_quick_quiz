import { useEffect, useState } from 'react';
import Lottie from "lottie-react";
import winkEmoji from "../public/wink_emoji.json"; // Import the local JSON
import meltingEmoji from "../public/melting_emoji.json"; // Import the local JSON

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

  const handleOptionClick = (option) => {
    if (selectedAnswers[currentQuestionIndex]) return; // Prevent reselection
  
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: option,
    }));
  
    // Increment only the number of times played
    setGameStats((prev) => ({
      gamesPlayed: prev.gamesPlayed + 1,
    }));
  
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

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowResult(false);
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
                        ? '#3d8c40'
                        : '#b7091d'
                      : '#ccc',
                  }}
                >
                  <span
                    style={{
                      ...styles.bullet,
                      borderColor: isSelected ? (isCorrect ? '#3d8c40' : '##b7091d') : '#bbb',
                      backgroundColor: isSelected ? (isCorrect ? '#3d8c40' : '#b7091d') : 'transparent',
                    }}
                  >
                    {isSelected ? (isCorrect ? '🎉' : <Lottie animationData = {meltingEmoji} loop={true} style={{ width: "25px", height: "25px" }} />) : String.fromCharCode(65 + index)}

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
                    <>
                      
                      <span style={styles.specialMessage}> – Real change doesn't always need complexity😉</span> 
                    </>
                  )}
                </p>

                <div style={styles.storyCard}>
                  <img
                    src={currentQuestion.inventor_image_url}
                    alt="Inventor"
                    style={styles.image}
                  />
                 <p style={styles.storyTitle}>{currentQuestion.short_story.split('\n\n')[0]}</p>
                  <p style={styles.storyText}> {currentQuestion.short_story.split('\n\n')[1]}</p>
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
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0} // Disable button on first question
              style={{
                color: currentQuestionIndex === 0 ? "#d3d3d3" : "#808080",
                padding: "10px 15px",
                borderRadius: "5px",
                background: "none",
                backgroundColor: "transparent",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                transition: "color 0.3s ease-in-out",  
                alignSelf: 'flex-start', // Ensures right alignment
                display: 'block', // Makes it behave as a block element
                marginLeft: 'auto', // Pushes it to the right    
                }}
            >
             ←
            </button>
          </>
        ) : (
          <>
            <h2>Thank You for Playing🎉</h2>
            <p style={styles.funFact}>{currentQuestion.fun_fact_comment}</p>
            <button
              onClick={(e) => {
                e.target.style.backgroundColor = "#51074a"; // Change color on click
                setTimeout(() => window.location.reload(), 200); // Reload page after slight delay
              }}
              style={{
                position: "absolute",
                bottom: "10px",
                right: "50px",
                padding: "10px 15px",
                backgroundColor: "#d69cbc",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Learn more
            </button>
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
    backgroundColor: '#FAFAF5',
    animation: 'fadeIn 0.5s forwards',
    fontFamily: "'Merriweather', serif",
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
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
    fontFamily: "'Cormorant Garamond', serif",
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
    border: '1.3px solid gray',
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
    transition: "all 0.3s ease",
    
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
    fontFamily: "'Cormorant Garamond', serif",
    marginLeft: '10px',
    marginRight: '10px',
    marginBottom: '10px',
    marginTop: '10px',
  },
  specialMessage: {
    fontSize: '14px',
    color: '#545454',
    fontWeight: 'normal',
    marginLeft: '5px',
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 'italic',
    fontWeight: 'extra-light',
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
    height: 'auto',
    maxWidth: '300px',
    objectfit: 'cover',
    objectFit: 'contain', // Ensures full image is visible without cropping
    borderRadius: '8px',
    marginLeft: '10px',
    marginRight: '10px',
    marginBottom: '10px',
    marginTop: '11px',
    animation: 'fadeIn 1.1s forwards',
    borderRadius: "5px",    // Rounded corners for aesthetics
    display: "block",
    margin: "0 auto 10px",
  },
  storyText: {
    fontSize: '16px',
    color: 'gray',
    textAlign: 'left',
    marginBottom: '10px',
    marginTop: '10px',
    marginLeft: '10px',
    marginRight: '10px',
    animation: 'fadeIn 1.6s forwards'
  },
  storyTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    textAlign: 'center', // ✅ Centers the first line
    marginBottom: '8px',
    marginLeft: '10px',
    marginRight: '10px',
    color: '#3f3f3f',
    animation: 'fadeIn 1.2s forwards',
    fontFamily: "'Cormorant Garamond', serif",
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
    fontSize: '16px',
    color: '#6a6a6a',
  },

};

import confetti from 'canvas-confetti';

const fireConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    initialVelocityY: -25,
    origin: { y: 0.6 }, // Adjust origin for better effect
    colors: ['#ffb6c1', '#8f83d8', '#d69cbc', '#51074a', '#191970'],
  });
};

// Call `fireConfetti()` when the user selects the correct answer


