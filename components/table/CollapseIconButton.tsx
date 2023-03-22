import React from "react";
import { IconButton } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

const CollapseIconButton = ({
  collapsed,
  onToggleCollapse,
  ariaLabel = "",
}) => {
  return (
    <IconButton
      onClick={onToggleCollapse}
      icon={collapsed ? <TriangleUpIcon /> : <TriangleDownIcon />}
      size="sm"
      variant="ghost"
      aria-label={ariaLabel}
    />
  );
};

export default CollapseIconButton;
