import { useCallback } from "react";

function useExpandables() {
  const getExpandableProps = useCallback(
    (key, toggledState, maxHeight = "2000px") => ({
      style: {
        maxHeight: toggledState ? maxHeight : "0",
        overflow: "hidden",
        transition: `max-height 0.3s ${
          !toggledState ? "cubic-bezier(0, 1, 0, 1)" : "ease-in-out"
        }`,
      },
      onClick: () => toggleExpand(key),
    }),
    []
  );

  const toggleExpand = (key) => {
    // Your toggle logic here if needed
  };

  return { getExpandableProps, toggleExpand };
}

export default useExpandables;
