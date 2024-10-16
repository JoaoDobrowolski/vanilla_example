"use client";

import { useState, useEffect, ChangeEvent } from "react";

const INITIAL_MESSAGE =
  "Did you know that by reading words like this, we can actually process them faster? If in our first encounter you've already learned something new, imagine what the team would miss out on by not hiring me!";

export default function Home() {
  const [inputText, setInputText] = useState<string>(INITIAL_MESSAGE);
  const [words, setWords] = useState<string[]>(inputText.split(" "));
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);
  const [displayedWord, setDisplayedWord] = useState<string>("");
  const [speed, setSpeed] = useState<number>(1);

  useEffect(() => {
    setWords(inputText.split(" "));
  }, [inputText]);

  useEffect(() => {
    const getDelaysBySpeed = () => {
      switch (speed) {
        case 1:
          return { perLetter: 60, min: 120, max: 200 };
        case 2:
          return { perLetter: 50, min: 110, max: 170 };
        case 3:
          return { perLetter: 40, min: 90, max: 150 };
        case 4:
          return { perLetter: 30, min: 80, max: 130 };
        case 5:
          return { perLetter: 20, min: 50, max: 100 };
        default:
          return { perLetter: 60, min: 120, max: 200 };
      }
    };
    const { perLetter, min, max } = getDelaysBySpeed();

    if (started && currentWordIndex < words.length) {
      const currentWord = words[currentWordIndex];
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
      }, max);

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
          <h2 className="p-strip">
            This project was created to show my interest in joining Canonical.
          </h2>
          <h2>
            I built it using the Vanilla Framework to enthusiastically
            demonstrate that I&apos;m ready and excited for the role.
          </h2>
          <div className="p-strip">
            <div>
              <textarea
                value={inputText}
                onChange={handleTextChange}
                style={{
                  height: "120px",
                }}
              />
            </div>
          </div>
          <div>
            <h3>Reading Speed:</h3>
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

          <h4>{displayedWord}</h4>
        </div>
      </div>
    </main>
  );
}
