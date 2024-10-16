"use client";

import { useState, useEffect, ChangeEvent } from "react";

const INITIAL_MESSAGE =
  "This is a simple project to demonstrate my quick reading tool.";

export default function Home() {
  const [inputText, setInputText] = useState<string>(INITIAL_MESSAGE);
  const [words, setWords] = useState<string[]>(inputText.split(" "));
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);
  const [displayedWord, setDisplayedWord] = useState<string>("");
  const [speed, setSpeed] = useState<number>(3);

  useEffect(() => {
    setWords(inputText.split(" "));
  }, [inputText]);

  useEffect(() => {
    const getDelaysBySpeed = () => {
      switch (speed) {
        case 1:
          return { perLetter: 120, min: 300, max: 500 };
        case 2:
          return { perLetter: 100, min: 240, max: 400 };
        case 3:
          return { perLetter: 60, min: 120, max: 200 };
        case 4:
          return { perLetter: 40, min: 90, max: 150 };
        case 5:
          return { perLetter: 20, min: 50, max: 100 };
        default:
          return { perLetter: 60, min: 120, max: 200 };
      }
    };

    if (started && currentWordIndex < words.length) {
      const currentWord = words[currentWordIndex];
      const { perLetter, min, max } = getDelaysBySpeed();
      let delay = currentWord.length * perLetter;
      delay = Math.max(min, Math.min(max, delay));
      const timer = setTimeout(() => {
        setDisplayedWord(currentWord);
        setCurrentWordIndex(currentWordIndex + 1);
      }, delay);

      return () => clearTimeout(timer);
    }

    if (currentWordIndex === words.length) {
      const timer = setTimeout(() => {
        setStarted(false);
        setCurrentWordIndex(0);
        setDisplayedWord("");
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [started, currentWordIndex, words, speed]);

  const handleStartStop = () => {
    if (started) {
      setStarted(false);
      setCurrentWordIndex(0);
      setDisplayedWord("");
      return;
    }
    setStarted(true);
    setCurrentWordIndex(0);
    return;
  };

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  return (
    <main className="p-strip">
      <div className="row">
        <div className="u-align--center">
          <h1>Hi, I&apos;m João!</h1>
          <h2>This is my Quick Reading Project</h2>
          <div className="p-strip">
            <div>
              <textarea value={inputText} onChange={handleTextChange} />
            </div>
          </div>
          <div>
            <label>Reading Speed:</label>
            <div>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  className={`p-button--neutral ${speed === value ? "is-selected" : ""}`}
                  onClick={() => handleSpeedChange(value)}
                  style={{
                    backgroundColor: speed === value ? "#0070f3" : "",
                    color: speed === value ? "white" : "",
                  }}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <button
            className={`p-button--positive ${started ? "p-button--negative" : ""}`}
            onClick={handleStartStop}
          >
            {started ? "Stop" : "Start"}
          </button>

          <p className="u-text--large">{displayedWord}</p>
        </div>
      </div>
    </main>
  );
}
