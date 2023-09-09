import { useSpring, animated } from "react-spring";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const ExpandablePanel = ({
  children,
  show,
  dependencies,
  defaultConfig = {},
}) => {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Lógica para medir la altura del contenido
  useLayoutEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.getBoundingClientRect().height);
    }
  }, [contentRef.current, ...dependencies]);

  const [props, setProps] = useSpring(() => ({
    height: 0,
    opacity: 0,
    config: {
      mass: 3,
      friction: 70,
      tension: 1300,
    },
    ...defaultConfig,
  }));

  useEffect(() => {
    setProps({
      height: show ? contentHeight : 0,
      opacity: show ? 1 : 0,
    });
  }, [show, setProps, contentHeight]);

  return (
    <animated.div style={{ ...props, overflow: "hidden" }}>
      <div ref={contentRef}>{children}</div>
    </animated.div>
  );
};

export default ExpandablePanel;
