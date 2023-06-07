import React from "react";
import { IconButton } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

const CategoryRow = ({
  category,
  color,
  isIncome = false,
  isBalance = false,
  totals,
  collapsed,
  onToggleCollapse = () => {},
}) => {
  const hasGroups = !!category.groups;

  return (
    <tr style={{ fontWeight: "bold", height: "40px" }}>
      <td style={{ backgroundColor: isIncome ? "lightblue" : color }}>
        {hasGroups && (
          <IconButton
            onClick={onToggleCollapse}
            icon={collapsed ? <TriangleUpIcon /> : <TriangleDownIcon />}
            size="sm"
            variant="ghost"
            aria-label={""}
          />
        )}
      </td>
      <td
        style={{
          backgroundColor: isIncome ? "lightblue" : color,
          borderBottom: "1px solid gray",
        }}
      >
        {category}
      </td>
      {totals?.map((total, index) => (
        <td
          key={`total-${index}`}
          style={{
            borderLeft: "1px solid #d2d2d2",
            backgroundColor: isIncome
              ? "lightblue"
              : isBalance
              ? color
              : "gray",
            color: "white",
            padding: "0px 0.5%",
            ...(!total
              ? {
                  textAlign: "center",
                }
              : {}),
            ...(!collapsed && hasGroups
              ? {
                  borderBottom: `1px solid ${color}`,
                }
              : {}),
          }}
        >
          {total.toFixed(2)}
        </td>
      ))}
    </tr>
  );
};

export default CategoryRow;
