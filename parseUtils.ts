function getMonth(dateString) {
  const date = new Date(dateString);
  return date.getMonth(); // Returns the month index (0-based)
}

function initializeCategory(categoryData) {
  return {
    name: categoryData.name,
    groups: [],
    totals: Array(13).fill(0), // Initialize an array of 13 zeros (12 months + sum of all months)
  };
}

function initializeGroup(groupData) {
  return {
    groupName: groupData.name,
    totals: Array(13).fill(0),
    expenses: [],
  };
}

function findOrCreateCategory(categories, categoryData) {
  let category = categories.find((cat) => cat.name === categoryData.name);

  if (!category) {
    category = initializeCategory(categoryData);
    categories.push(category);
  }

  return category;
}

function findOrCreateGroup(category, groupData) {
  let group = category.groups.find((grp) => grp.groupName === groupData.name);

  if (!group) {
    group = initializeGroup(groupData);
    category.groups.push(group);
  }

  return group;
}

function processExpenses(expenses) {
  const data = {
    categories: [],
    summary: Array(13).fill(0),
    balance: Array(13).fill(0), // Initialize the Balance category directly within the data structure
  };

  expenses.forEach((expense) => {
    const monthIndex = getMonth(expense.date);
    const category = findOrCreateCategory(data.categories, expense.category);

    let group;

    if (expense.group) {
      group = findOrCreateGroup(category, expense.group);
    } else {
      // Create a special "No Group" group for expenses without a group
      group = findOrCreateGroup(category, { name: "No Group" });
    }

    group.totals[monthIndex] += expense.amount;
    group.totals[12] += expense.amount;
    group.expenses.push(expense); // Add the expense to the group's expenses array

    category.totals[monthIndex] += expense.amount;
    category.totals[12] += expense.amount;
    data.summary[monthIndex] += expense.amount;
    data.summary[12] += expense.amount;

    // Update the Balance category accordingly
    data.balance[monthIndex] -= expense.amount;
    data.balance[12] -= expense.amount;
  });

  return data;
}

function processIncomes(incomes, data) {
  const incomeCategory = {
    name: "Income",
    groups: [],
    totals: Array(13).fill(0),
  };

  incomes.forEach((income) => {
    const monthIndex = getMonth(income.date);
    incomeCategory.totals[monthIndex] += income.amount;
    incomeCategory.totals[12] += income.amount;

    // Update the Balance category accordingly
    data.balance[monthIndex] += income.amount;
    data.balance[12] += income.amount;
  });

  data.categories.unshift(incomeCategory); // Add the income category to the beginning of the categories array
}

export function generateSummaryData(expenses, incomes) {
  const data = processExpenses(expenses);
  processIncomes(incomes, data);
  return data;
}