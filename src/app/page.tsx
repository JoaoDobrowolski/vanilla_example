"use client";

import { useState, useEffect, ChangeEvent } from "react";
import classnames from "classnames";
import styles from "./styles.module.scss";

const INITIAL_MESSAGE =
  "Did you know that by reading words like this, we can actually process them faster? If in our first encounter you've already learned something new, imagine what we could achieve together if I were part of the team!";

export default function Home() {
  const [inputText, setInputText] = useState<string>(INITIAL_MESSAGE);
  const [words, setWords] = useState<string[]>(inputText.split(" "));
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);
  const [displayedWord, setDisplayedWord] = useState<string>("");
  const [speed, setSpeed] = useState<number>(1);
  const [manualTime, setManualTime] = useState<number>(0);
  const [autoTime, setAutoTime] = useState<number>(0);
  const [manualTimerActive, setManualTimerActive] = useState<boolean>(false);
  const [manualTimer, setManualTimer] = useState<number | null>(null);
  const [autoTimer, setAutoTimer] = useState<number | null>(null);

  useEffect(() => {
    setWords(inputText.split(" "));
  }, [inputText]);

  // Manual reading timer logic: increments time every second when active
  useEffect(() => {
    if (manualTimerActive && manualTimer === null) {
      const timer = window.setInterval(() => {
        setManualTime((prevTime) => prevTime + 1);
      }, 1000);
      setManualTimer(timer);
    } else if (!manualTimerActive && manualTimer !== null) {
      clearInterval(manualTimer);
      setManualTimer(null);
    }
  }, [manualTimerActive, manualTimer]);

  // Auto reading timer logic: increments time every second when fast reading is active
  useEffect(() => {
    if (started && autoTimer === null) {
      const timer = window.setInterval(() => {
        setAutoTime((prevTime) => prevTime + 1);
      }, 1000);
      setAutoTimer(timer);
    } else if (!started && autoTimer !== null) {
      clearInterval(autoTimer);
      setAutoTimer(null);
    }
  }, [started, autoTimer]);

  // Controls the speed of word display based on the selected reading speed
  useEffect(() => {
    const getDelaysBySpeed = () => {
      switch (speed) {
        case 1:
          return { perLetter: 60, min: 120, max: 200 };
        case 2:
          return { perLetter: 50, min: 110, max: 170 };
        case 3:
          return { perLetter: 40, min: 100, max: 150 };
        case 4:
          return { perLetter: 30, min: 90, max: 130 };
        case 5:
          return { perLetter: 24, min: 80, max: 110 };
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

  // Handles start/stop button for fast reading timer and resets time
  const handleStartStop = () => {
    if (started) {
      setStarted(false);
      setCurrentWordIndex(0);
      setDisplayedWord("");
      setAutoTime(0);
      return;
    }
    setStarted(true);
    setCurrentWordIndex(0);
    setAutoTime(0);
    return;
  };

  // Handles manual reading timer toggle and resets time when activated
  const handleManualTimerToggle = () => {
    setManualTimerActive(!manualTimerActive);
    if (!manualTimerActive) setManualTime(0);
  };

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  return (
    <main className="u-align--center">
      <div className={classnames("row", styles.container)}>
        <h1 className={styles.title}>Hi, I&apos;m João!</h1>
        <h2 className={styles.subtitle}>
          This project was created to show my interest in joining Canonical.
        </h2>
        <h2 className={styles.subtitle}>
          I built it using the Vanilla Framework to enthusiastically demonstrate
          that I&apos;m ready and excited for the role.
        </h2>
        <div className={styles["textarea-container"]}>
          <textarea
            value={inputText}
            onChange={handleTextChange}
            className={styles.textarea}
          />
          <div className={styles["reading-container"]}>
            <button
              className={`p-button--neutral ${manualTimerActive ? "p-button--negative" : ""}`}
              onClick={handleManualTimerToggle}
            >
              {manualTimerActive
                ? "Stop Normal Reading Timer"
                : "Start Normal Reading Timer"}
            </button>
            <p>Normal Reading Time: {manualTime}s</p>
          </div>
        </div>
        <div>
          <h4>Reading Speed:</h4>
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

        <div className={styles["reading-container"]}>
          <button
            className={`p-button--positive ${started ? "p-button--negative" : ""}`}
            onClick={handleStartStop}
          >
            {started ? "Stop" : "Start"}
          </button>
          <p>Fast Reading Timer: {autoTime}s</p>
        </div>
        <h2>{displayedWord}</h2>
      </div>
    </main>
  );
}
