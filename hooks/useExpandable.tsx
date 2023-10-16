import { useRef, useState } from "react";

function useExpandable() {
  const contentRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const expandableProps = {
    style: {
      maxHeight: isExpanded ? `${contentRef.current.scrollHeight}px` : "0",
      overflow: "hidden",
      transition: "maxHeight 0.3s ease-in-out",
    },
    ref: contentRef,
  };

  return {
    expandableProps,
    isExpanded,
    toggleExpand,
  };
}

export default useExpandable;
