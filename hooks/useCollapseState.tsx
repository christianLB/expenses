import { useState } from "react";

const useCollapseState = () => {
  const [collapseState, setCollapseState] = useState({});

  const toggleCollapse = (key: string) => {
    setCollapseState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return { collapseState, toggleCollapse };
};

export default useCollapseState;
