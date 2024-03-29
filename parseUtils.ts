function getMonth(dateString) {
  const date = new Date(dateString);
  return date.getMonth(); // Returns the month index (0-based)
}

function initializeCategory(categoryData) {
  return {
    id: categoryData ? categoryData.id : "uncategorized",
    name: categoryData ? categoryData.name : "Uncategorized",
    color: "#FF0000",
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
  const startDate = new Date(year, 0, 1); // 1 de enero del año indicado
  const endDate = new Date(year + 1, 0, 1); // 1 de enero del año siguiente

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

function findOrCreateGroup(groups, groupData) {
  let group = groups.find((grp) => grp.groupName === groupData.name);

  if (!group) {
    group = initializeGroup(groupData);
    groups.push(group);
  }

  return group;
}

function processExpenses(expenses, categories, groups) {
  //console.log({ categories, groups });
  const data = {
    categories: [],
    groups: [],
    summary: Array(13).fill(0),
    balance: Array(13).fill(0), // Initialize the Balance category directly within the data structure
  };
  // Initialize categories with zeros
  categories.forEach((category: any) => {
    findOrCreateCategory(data.categories, category);
  });
  groups.forEach((group: any) => {
    findOrCreateGroup(data.groups, group);
  });

  expenses.forEach((expense) => {
    const monthIndex = getMonth(expense.date);
    let category;
    let group;

    if (expense.category) {
      category = findOrCreateCategory(data.categories, expense.category);
    } else {
      category = findOrCreateCategory(data.categories, {
        id: 0,
        name: "Uncategorized",
        color: "#FF0000",
      });
    }

    if (expense.group) {
      group = findOrCreateGroup(data.groups, expense.group);
    } else {
      // Create a special "No Group" group for expenses without a group
      group = findOrCreateGroup(data.groups, {
        id: 0,
        name: "No Group",
      });
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
  //console.log({ feed, lines });
  let inObservations = false;

  lines.forEach((line) => {
    if (line.startsWith("Descripción")) {
      result.name = line.substring("Descripción".length).trim();
      inObservations = false;
    } else if (line.startsWith("Observaciones")) {
      inObservations = true;
      result.name +=
        " " +
        line
          .substring("Observaciones".length)
          .trim()
          .replace(/[\r\n]+/g, " ");
    } else if (inObservations && line.trim() !== "") {
      result.name += " " + line.trim().replace(/[\r\n]+/g, " ");
    } else if (line.startsWith("Fecha del movimiento")) {
      inObservations = false;
      result.date = line.substring("Fecha del movimiento".length).trim();
    } else if (line.startsWith("Fecha valor")) {
      inObservations = false;
      result.valueDate = line.substring("Fecha valor".length).trim();
    } else if (line.startsWith("Importe")) {
      inObservations = false;
      result.amount = parseFloat(
        line.substring("Importe".length).trim().replace(",", ".")
      );
    } else if (line.startsWith("Divisa")) {
      inObservations = false;
      result.currency = line.substring("Divisa".length).trim();
    }
  });

  return result;
};

export function generateSummaryData(expenses, categories, groups, incomes) {
  const data = processExpenses(expenses, categories, groups);
  processIncomes(incomes, data);
  return data;
}
