import React, { SVGProps } from "react";

interface ISVGProps extends SVGProps<SVGSVGElement> {
  ["data-testid"]?: string;
}

const Svg = (props: ISVGProps) => (
  <svg
    className={`fill-current ${props.className || ""}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 25 25"
    data-testid={props["data-testid"]}
    style={props.style}
  >
    {props.children}
  </svg>
);

export default Svg;
