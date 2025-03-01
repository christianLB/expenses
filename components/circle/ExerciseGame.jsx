// components/circle/ExerciseGame.jsx
import React, { useState } from "react";

const ExerciseGame = ({ keys }) => {
  const [question, setQuestion] = useState({});
  const [answer, setAnswer] = useState("");

  const generateQuestion = () => {
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setQuestion({
      name: randomKey.name,
      sharps: randomKey.sharps,
    });
  };

  const checkAnswer = () => {
    if (answer === question.name) {
      alert("¡Correcto!");
    } else {
      alert("Incorrecto, intenta de nuevo.");
    }
    generateQuestion();
  };

  return (
    <div className="exercise-game">
      <button onClick={generateQuestion}>Generar Pregunta</button>
      {question.name && (
        <>
          <p>¿Cuál es la tonalidad con {question.sharps} sostenidos?</p>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button onClick={checkAnswer}>Enviar Respuesta</button>
        </>
      )}
    </div>
  );
};

export default ExerciseGame;
