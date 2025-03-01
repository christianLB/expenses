// pages/circle.jsx
import React from "react";
import { CircleProvider, useCircleContext } from "../components/circle/CircleContext";
import CircleOfFifths from "../components/circle/CircleOfFifths";
import KeyDetails from "../components/circle/KeyDetails";
import ExerciseGame from "../components/circle/ExerciseGame";

const HomeContent = () => {
  const { selectedKey, setSelectedKey } = useCircleContext();

  return (
    <>
      <h1>{`Tonalidad seleccionada: ${selectedKey}`}</h1>
      <CircleOfFifths onKeySelect={setSelectedKey} />
      <KeyDetails keyName={selectedKey} />
      <ExerciseGame keys={[{ name: "C Major", sharps: 0 }, { name: "G Major", sharps: 1 }]} />
    </>
  );
};

const Home = () => (
  <CircleProvider>
    <HomeContent />
  </CircleProvider>
);

export default Home;