"use client";

import { useState } from "react";
import styles from "./styles.module.scss";

const STEPS = [
  {
    message:
      "This is a simple project to demonstrate my skills with the Vanilla Framework, created for the Canonical interview.",
    buttonText: "Wait, did you really make a project just for the interview?",
  },
  {
    message:
      "It's not desperation... It's enthusiasm! I just want to demonstrate my ability to work using simplicity, creativity, and clarity.",
    buttonText: "So, what do you think about working with Vanilla?",
  },
  {
    message:
      "Vanilla is great for creating clean, responsive layouts with minimal effort. It’s lightweight and perfect for standardized projects.",
    buttonText: "And how long did it take to build this?",
  },
  {
    message:
      "It took just a few hours! With the right tools and focus, efficiency is key.",
    buttonText: "Okay, I think I'm ready for Canonical now!",
  },
];

export default function Home() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep((prevStep) => (prevStep + 1) % STEPS.length);
    }, 2000);
  };

  return (
    <main className="p-strip--light">
      <div className="row">
        <div className="col-8@small col-6@medium col-4@large">
          <h1>Hi, I&apos;m João!</h1>
          <p>
            Frontend developer with experience in React, Next.js, and
            TypeScript.
          </p>
          <p>{STEPS[step].message}</p>
          <button
            className={`p-button--positive ${loading ? styles["is-loading"] : ""}`}
            onClick={handleClick}
            disabled={loading}
          >
            {loading ? "Loading..." : STEPS[step].buttonText}
          </button>
        </div>
      </div>
    </main>
  );
}
