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
  const { expenses, categories, groups, colors } = useExpensesContext();
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
          backgroundColor: colors,
        },
      ],
    });

    setGroupData({
      labels: groups.map((group) => group.name),
      datasets: [
        {
          label: "Expense Amount",
          data: groups.map((group) => groupTotals[group.id]),
          backgroundColor: colors,
        },
      ],
    });
  }, [expenses, categories, groups, colors]);

  const handlePieSliceHover = (event, element) => {
    if (element[0]) {
      const index = element[0].index;
      const category = categories[index];
      const filteredExpenses = expenses.filter(
        (expense) => expense.category.id === category.id
      );
      const groupTotals = groups.reduce((acc, group) => {
        acc[group.id] = 0;
        return acc;
      }, {});

      filteredExpenses.forEach((expense) => {
        if (expense.group) {
          groupTotals[expense.group.id] += expense.amount;
        }
      });

      setGroupData({
        labels: groups.map((group) => group.name),
        datasets: [
          {
            label: "Expense Amount",
            data: groups.map((group) => groupTotals[group.id]),
            backgroundColor: colors,
          },
        ],
      });
    }
  };

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
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const index = context.dataIndex;
                    const category = categories[index];
                    const total = categoryData.datasets[0].data[index];
                    return `${category.name}: ${total.toFixed(2)}`;
                  },
                },
              },
            },
          }}
          getelementatEvent={handlePieSliceHover}
        />
      </div>
      <div style={{ width: "65%" }}>
        <h2 style={{ textAlign: "center" }}>Expense Groups</h2>
        <Bar
          data={groupData}
          options={{
            interaction: { mode: "nearest", intersect: false, axis: "x" },
            aspectRatio: 1.5,
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const index = context.dataIndex;
                    const group = groups[index];
                    const total = groupData.datasets[0].data[index];
                    return `${group.name}: ${total.toFixed(2)}`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ExpenseDashboard;
