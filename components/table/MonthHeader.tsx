import React from "react";

const MonthHeader = ({ month }) => {
  return (
    <th style={{ borderLeft: "1px solid white" }} key={month}>
      {month}
    </th>
  );
};

export default MonthHeader;
