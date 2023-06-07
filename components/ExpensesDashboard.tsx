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
import { useExpensesContext } from "../hooks/expensesContext";

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
  const [filteredCategory, setFilteredCategory] = useState(null);

  const handleCategoryFilter = (category) => {
    setFilteredCategory(filteredCategory === category ? null : category);
    //console.log("Filtered Category:", filteredCategory);
  };

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
    //console.log("Group Data:", groupData);
  }, [expenses, categories, groups, colors]);

  const filteredGroupData = () => {
    const extractGroups = () => {
      if (!filteredCategory) return groups;

      const category = categories.find(
        (category) => category.name === filteredCategory
      );
      if (!category) return [];

      return groups.filter((group) => group.categoryId === category.id);
    };

    const filteredGroups = extractGroups();

    const filteredData = {
      labels: filteredGroups.map((group) => group.name),
      datasets: [
        {
          label: "Amount",
          data: filteredGroups.map((group) => group.total),
          backgroundColor: filteredGroups.map((group) => {
            const category = categories.find(
              (cat) => cat.id === group.categoryId
            );
            return category ? category.color : "rgba(0, 0, 0, 0.1)";
          }),
          borderColor: filteredGroups.map((group) => {
            const category = categories.find(
              (cat) => cat.id === group.categoryId
            );
            return category ? category.color : "rgba(0, 0, 0, 0.1)";
          }),
          borderWidth: 1,
        },
      ],
    };
    //console.log("Filtered Groups:", filteredGroups);
    //console.log("Filtered Data:", filteredData);

    return filteredData;
  };

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
            onClick: (event, elements) => {
              if (elements.length > 0) {
                const index = elements[0].index;
                const category = categoryData.labels[index];
                handleCategoryFilter(category);
              } else {
                handleCategoryFilter(null);
              }
            },
          }}
        />
      </div>
      <div style={{ width: "65%" }}>
        <h2 style={{ textAlign: "center" }}>Grupos</h2>
        <Bar
          data={filteredGroupData()}
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
