import React from "react";

const AmountCell = ({ amount, color, additionalStyles = {} }) => {
  return (
    <td
      style={{
        padding: "0 0.5%",
        backgroundColor: color,
        ...(!amount
          ? {
              textAlign: "center",
              color: "#000",
              paddingLeft: "0",
            }
          : {}),
        ...additionalStyles,
      }}
    >
      {(amount && amount.toFixed(2)) || "-"}
    </td>
  );
};

export default AmountCell;
