import { useState } from "react";

type CollapsedKey = string | number;

interface SavedState {
  [key: string]: boolean;
}

const useCollapsedState = (
  savedState: SavedState = {}
): [Set<CollapsedKey>, (key: CollapsedKey) => void] => {
  const [expandedKeys, setExpandedKeys] = useState<Set<CollapsedKey>>(() => {
    const initialExpandedKeys = new Set<CollapsedKey>();
    Object.keys(savedState).forEach((key) => {
      if (savedState[key]) {
        initialExpandedKeys.add(key);
      }
    });
    return initialExpandedKeys;
  });

  const toggle = (key: CollapsedKey) => {
    setExpandedKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  return [expandedKeys, toggle];
};

export default useCollapsedState;
