import React, { SVGProps } from "react";

const TrashIcon = ({ className, onClick }: SVGProps<SVGSVGElement>) => (
  <svg className={className} onClick={onClick}>
    <path d="M7 19.556c0 1.069.9 1.944 2 1.944h8c1.1 0 2-.875 2-1.944V7.889H7v11.667zM20 4.972h-3.5L15.5 4h-5l-1 .972H6v1.945h14V4.972z" />
  </svg>
);

export default TrashIcon;
