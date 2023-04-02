function getMonth(dateString) {
  const date = new Date(dateString);
  return date.getMonth(); // Returns the month index (0-based)
}

function initializeCategory(categoryData) {
  return {
    id: categoryData ? categoryData.id : "uncategorized",
    name: categoryData ? categoryData.name : "Uncategorized",
    groups: [],
    totals: Array(13).fill(0), // Initialize an array of 13 zeros (12 months + sum of all months)
  };
}

function initializeGroup(groupData) {
  return {
    id: groupData.id,
    groupName: groupData.name,
    totals: Array(13).fill(0),
    expenses: [],
  };
}

export const filterByMonth = (transactions: any, month: number): any[] => {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === month;
  });
};

export const generateYearlyQuery = (year) => {
  const startDate = `${year}-01-01T00:00:00.000Z`;
  const endDate = `${year + 1}-01-01T00:00:00.000Z`;

  return {
    date: {
      greater_than_equal: startDate,
    },
    and: [
      {
        date: {
          less_than_equal: endDate,
        },
      },
    ],
  };
};

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
    let category;
    let group;

    if (expense.category) {
      category = findOrCreateCategory(data.categories, expense.category);
    } else {
      category = findOrCreateCategory(data.categories, {
        id: "uncategorized",
        name: "Uncategorized",
      });
    }

    if (expense.group) {
      group = findOrCreateGroup(category, expense.group);
    } else {
      // Create a special "No Group" group for expenses without a group
      group = findOrCreateGroup(category, { id: "no-group", name: "No Group" });
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

export const parseSingleTransaction = (feed) => {
  const lines = feed.split("\n");
  const result: any = {};

  lines.forEach((line) => {
    if (line.startsWith("Descripción")) {
      result.name = line.substring("Descripción".length).trim();
    } else if (line.startsWith("Observaciones")) {
      result.name += " " + line.substring("Observaciones".length).trim();
    } else if (line.startsWith("Fecha del movimiento")) {
      result.date = line.substring("Fecha del movimiento".length).trim();
    } else if (line.startsWith("Fecha valor")) {
      result.valueDate = line.substring("Fecha valor".length).trim();
    } else if (line.startsWith("Importe")) {
      result.amount = parseFloat(
        line.substring("Importe".length).trim().replace(",", ".")
      );
    } else if (line.startsWith("Divisa")) {
      result.currency = line.substring("Divisa".length).trim();
    }
  });

  return result;
};

export function generateSummaryData(expenses, incomes) {
  const data = processExpenses(expenses);
  processIncomes(incomes, data);
  return data;
}
