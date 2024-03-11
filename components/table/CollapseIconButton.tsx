import React from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";

const CollapseIconButton = ({
  collapsed,
  onToggleCollapse,
  ariaLabel = "",
}) => {
  return (
    <ActionIcon
      onClick={onToggleCollapse}
      variant="ghost"
      aria-label={ariaLabel}
    >
      {collapsed ? <IconChevronUp /> : <IconChevronDown />}
    </ActionIcon>
  );
};

export default CollapseIconButton;
