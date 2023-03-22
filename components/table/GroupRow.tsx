import React from "react";

const GroupRow = ({ groupName, amounts, color, monthNames }) => {
  return (
    <tr style={{ backgroundColor: color }}>
      <td style={{ backgroundColor: color }}></td>
      <td style={{ backgroundColor: color, paddingLeft: "20px" }}>
        {groupName}
      </td>
      {Array.isArray(amounts) &&
        amounts.map((amount, index) => (
          <td
            key={`${monthNames[index]}-amounts`}
            style={{
              padding: "0 0.5%",
              ...(!amount
                ? {
                    textAlign: "center",
                    color: "#000",
                    paddingLeft: "0",
                  }
                : {}),
            }}
          >
            {(amount && amount.toFixed(2)) || "-"}
          </td>
        ))}
    </tr>
  );
};

export default GroupRow;
