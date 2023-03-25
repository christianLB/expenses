// components/ExpensesDashboard.tsx
import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { useExpensesContext } from "../hooks/expensesContext.tsx";

import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale);

const ExpenseDashboard = () => {
  const { expenses, categories, groups } = useExpensesContext();
  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  });
  const [groupData, setGroupData] = useState({
    labels: [],
    datasets: [{ label: "Expense Amount", data: [], backgroundColor: [] }],
  });

  useEffect(() => {
    if (!categories || !groups) return;

    const categoryTotals = categories.reduce((acc, category) => {
      acc[category.id] = 0;
      return acc;
    }, {});

    const groupTotals = groups.reduce((acc, group) => {
      acc[group.id] = 0;
      return acc;
    }, {});

    expenses.forEach((expense) => {
      if (expense.category) {
        categoryTotals[expense.category.id] += expense.amount;
      }
      if (expense.group) {
        groupTotals[expense.group.id] += expense.amount;
      }
    });

    setCategoryData({
      labels: categories.map((category) => category.name),
      datasets: [
        {
          data: categories.map((category) => categoryTotals[category.id]),
          backgroundColor: [
            "#ff6384",
            "#36a2eb",
            "#ffce56",
            "#4bc0c0",
            "#9966ff",
            "#ff9f40",
          ],
        },
      ],
    });

    setGroupData({
      labels: groups.map((group) => group.name),
      datasets: [
        {
          label: "Expense Amount",
          data: groups.map((group) => groupTotals[group.id]),
          backgroundColor: [
            "#ff6384",
            "#36a2eb",
            "#ffce56",
            "#4bc0c0",
            "#9966ff",
            "#ff9f40",
          ],
        },
      ],
    });
  }, [expenses, categories, groups]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        paddingTop: "20px",
      }}
    >
      <div style={{ width: "35%" }}>
        <h2 style={{ textAlign: "center" }}>Expense Categories</h2>
        <Pie
          data={categoryData}
          options={{
            interaction: { mode: "nearest", intersect: false, axis: "x" },
            aspectRatio: 1,
          }}
        />
      </div>
      <div style={{ width: "65%" }}>
        <h2 style={{ textAlign: "center" }}>Expense Groups</h2>
        <Bar
          data={groupData}
          options={{
            interaction: { mode: "nearest", intersect: false, axis: "x" },
            aspectRatio: 1.5,
          }}
        />
      </div>
    </div>
  );
};

export default ExpenseDashboard;
