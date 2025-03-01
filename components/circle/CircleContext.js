// components/circle/CircleContext.jsx
import React, { createContext, useContext, useState } from "react";

const CircleContext = createContext();

export const CircleProvider = ({ children }) => {
  const [selectedKey, setSelectedKey] = useState("C Major");

  return (
    <CircleContext.Provider value={{ selectedKey, setSelectedKey }}>
      {children}
    </CircleContext.Provider>
  );
};

export const useCircleContext = () => useContext(CircleContext);