import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { useExpensesContext } from "../hooks/expensesContext.tsx";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

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
          label: "Total anual",
          data: groups.map((group) => groupTotals[group.id]),
          backgroundColor: colors,
        },
      ],
    });
  }, [expenses, categories, groups, colors]);

  return (
    <div
      style={{
        display: "flex",
        paddingTop: "20px",
        width: "1000px",
        height: "100%",
      }}
    >
      <div style={{ width: "30%" }}>
        <h2 style={{ textAlign: "center" }}>Categorías</h2>
        <Pie
          data={categoryData}
          options={{
            interaction: { mode: "index", intersect: false },

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
        />
      </div>
      <div style={{ width: "65%" }}>
        <h2 style={{ textAlign: "center" }}>Grupos</h2>
        <Bar
          data={groupData}
          options={{
            interaction: { mode: "index", intersect: false },
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
