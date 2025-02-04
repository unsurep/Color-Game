'use client';

import { useState, useEffect } from "react";
import { IoColorPaletteSharp } from "react-icons/io5";
import { RiResetLeftLine } from "react-icons/ri";


const App = () => {
  const [colors, setColors] = useState([]);
  const [targetColor, setTargetColor] = useState('');
  const [guessOption, setGuessOption] = useState([]);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [tries, setTries] = useState(0);
  const [gameOver, setGameOver] = useState(false);



  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const generateGame = () => {
    const randomColors = Array.from({ length: 1 }, () => generateRandomColor());
    setColors(randomColors);

    const target = randomColors[Math.floor(Math.random() * 1)];
    setTargetColor(target);

    const options = [target, ...Array.from({ length: 5 }, () => generateRandomColor())].sort(
      () => Math.random() - 0.5
    );
    setGuessOption(options);
    setMessage('');
  };

  // reset game
  const resetGame = ()=>{
    setScore(0);
    setTries(0);
    setGameOver(false);
    generateGame();
  }

  useEffect(() => {
    generateGame();
  }, []);

  const handleGuess = (color) => {
    const isCorrect = color === targetColor;

    if (isCorrect) {
      setMessage('✅ Correct!');
      setScore((prev) => prev + 1);
    } else {
      setMessage('❌ Wrong! Try Again.');
    }

    setTries((prevTries) => {
      const newTries = prevTries + 1;
      if (newTries >= 10) {
        setGameOver(true);
        const finalScore = isCorrect ? score + 1 : score;
        if (finalScore === 10) {
          setMessage('🎉 Congratulations, YOU WON!');
        } else {
          setMessage(`Game Over! Total score: ${finalScore}`);
        }
      } else {
        setTimeout(generateGame, 1000);
      }
      return newTries;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center pt-2 md:pt-6 px-[3rem] space-y-2 md:space-y-5">
      <div className="flex items-center gap-3">
        <p className="text-4xl text-red-400/80"><IoColorPaletteSharp /></p>
        <p className="font-bold text-base md:text-2xl lg:text-4xl bg-gradient-to-r from-rose-400 via-violet-600 to-blue-600 tracking-[5px] md:tracking-[10px] lg:tracking-[20px] bg-clip-text text-transparent">
          COLOR GAME
        </p>
      </div>

      <h1 data-testid="gameInstructions" className="text-sm md:text-lg">Guess the correct color from the displayed random colors below.</h1>

      {/* scores, tries & new game */}
      <div className="flex flex-col gap-1 md:ml-auto text-sm md:text-base  md:px-[5rem]">
        <h3 data-testid="score">Score: {score}</h3>
        <h3>Tries: {tries}/10</h3>
        <button data-testid="newGameButton" className="submit w-full md:mt-2 flex items-center gap-2 justify-center" onClick={resetGame}>New Game <h1 className="text-xl"><RiResetLeftLine /></h1></button>
      </div>

      {/* target color */}
      <div className="">
        <div data-testid="colorBox" className=" p-3 md:p-6 bg-gray-800 rounded-lg shadow-lg">
          <p className="pb-1 md:text-xl ">Target color</p>
          {colors.map((color, index) => (
            <div
              key={index}
              style={{ backgroundColor: color }}
              className="w-20 h-16 md:h-28 md:w-28 rounded-lg"
            ></div>
          ))}
        </div>
      </div>
        
      {/* select a color */}
      <div className="">
        <div data-testid="colorOption" className="grid mt-2 grid-cols-3 md:flex gap-3 items-center">
          {guessOption.map((color, index) => (
            <button
              key={index}
              style={{ backgroundColor: color }}
              onClick={() => handleGuess(color)}
              className="md:w-16 md:h-10 w-10 h-10 rounded-lg hvr-grow"
              disabled={gameOver}
            ></button>
          ))}
        </div>
        <p className="text-center mt-3 md:text-lg">Select a color above </p>
      </div>

      {message && <p data-testid="gameStatus" className="md:text-lg font-bold blink-1 text-sm">{message}</p>}
    </div>
  );
};

export default App;