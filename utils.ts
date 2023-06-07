//@ts-nocheck

import _ from "lodash";
import { IExpense } from "./hooks/useExpense";
import { IIncome } from "./hooks/useIncome";

export function parseTransactionInfo(text: string): any | null {
  const fields = text.split("||").map((line) => line.trim());

  const matchType = fields[0].match(/^Tipo de movimiento\s+(.+)/);
  const type = matchType ? matchType[1] : "";

  const matchDescription =
    (fields[1] && fields[1].match(/^Descripción\s+(.+)/)) || "";
  const description = matchDescription ? matchDescription[1] : "";

  const matchAmount =
    (fields[2] &&
      fields[2].match(/^Importe\s+(-?\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?)/)) ||
    "";
  const amount = matchAmount
    ? parseFloat(matchAmount[1].replace(".", "").replace(",", "."))
    : NaN;

  const matchCurrency = (fields[3] && fields[3].match(/^Divisa\s+(.+)/)) || "";
  const currency = matchCurrency ? matchCurrency[1] : "";

  const matchDate =
    (fields[4] &&
      fields[4].match(/^Fecha del movimiento\s+(\d{2}\/\d{2}\/\d{4})/)) ||
    "";
  const date = matchDate ? formatDate(matchDate[1]) : null;

  const matchValueDate =
    (fields[5] && fields[5].match(/^Fecha valor\s+(\d{2}\/\d{2}\/\d{4})/)) ||
    "";
  const valueDate = matchValueDate ? formatDate(matchValueDate[1]) : null;

  const matchAccount =
    (fields[6] && fields[6].match(/^Cuenta cargo\/abono\s+(.+)/)) || "";
  const account = matchAccount ? matchAccount[1] : "";

  const matchAccountHolder =
    (fields[7] && fields[7].match(/^Titular de la cuenta\s+(.+)/)) || "";
  const accountHolder = matchAccountHolder ? matchAccountHolder[1] : "";

  const matchNotes =
    (fields[8] && fields[8].match(/^Observaciones\s+(.+)/)) || "";
  const notes = matchNotes ? matchNotes[1] : "";

  if (
    !type ||
    !description ||
    isNaN(amount) ||
    !currency ||
    !date ||
    !valueDate ||
    !account ||
    !accountHolder ||
    !notes
  ) {
    return null;
  }

  return {
    type: type,
    Name: description,
    amount: Math.abs(amount),
    currency: currency,
    Date: valueDate,
    //valueDate: valueDate,
    account: account,
    Account_holder: accountHolder,
    notes: notes,
  };
}

export const parseTransactionList = (text: string) => {
  const list = text.split("||");
  const parsedlist: any[] = [];

  list.forEach((transaction) => {
    if (transaction) {
      const fields = transaction.trim().split(" ");
      const parsed = {
        currency: fields.pop(),
        balance: fields.pop(),
        amount: fields.pop(),
        date: fields.shift(),
        valueDate: fields.shift(),
        name: fields.join(" "),
      };

      parsedlist.push(parsed);
    }
  });
  return parsedlist;
};

export const formatDate = (date: string) => {
  //const dateString = '20/02/2023';
  const [day, month, year] = date.split("/");
  const dateObject = new Date(`${year}-${month}-${day}`);
  return dateObject;
};

interface Transaction {
  transactionDate: Date;
  valueDate: Date;
  description: string;
  amount: number;
  balance: number;
}

export function extractTransactions(feed: string): Transaction[] {
  const transactionRegExp =
    /(\d{2}\/\d{2}) (\d{2}\/\d{2}) (.+?) (-?\d+(?:,\d+)?) (-?\d+(?:\.\d{3},\d{2})?) EUR/g;
  const transactions: Transaction[] = [];
  let match;
  while ((match = transactionRegExp.exec(feed))) {
    const [_, transactionDate, valueDate, description, amount, balance] = match;
    transactions.push({
      transactionDate,
      valueDate,
      description,
      amount: parseFloat(amount.replace(",", ".")),
      balance: parseFloat(balance.replace(".", "").replace(",", ".")),
    });
  }
  return transactions;
}

export const getTotalsByCategoryAndGroup = (
  expenses: IExpense[],
  totalIncomePerMonth
) => {
  const result = {};
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Initialize the sum of all categories
  let allCategoriesSum = Array(13).fill(0);

  if (totalIncomePerMonth.length) {
    const _tocalIncomePerMonth = [
      ...totalIncomePerMonth,
      totalIncomePerMonth.reduce((total, item) => total + item),
    ];
    result["Income"] = { totals: _tocalIncomePerMonth };
  } else {
    result["Income"] = { totals: 0 };
  }
  _.forEach(expenses, (expense) => {
    //console.log(expense);
    const month = monthNames.indexOf(
      new Date(expense.date).toLocaleString("en-us", { month: "short" })
    );
    const category = expense.category ? expense.category.name : "Uncategorized";
    const group = expense.group ? expense.group.name : "no group";

    if (!result[category]) {
      result[category] = {};
      result[category]["totals"] = Array(13).fill(0);
    }

    if (!result[category][group]) {
      result[category][group] = Array(13).fill(0);
    }

    result[category][group][month] += expense.amount;
    result[category][group][12] += expense.amount;
    result[category]["totals"][month] += expense.amount;
    result[category]["totals"][12] += expense.amount;

    allCategoriesSum[month] += expense.amount;
    allCategoriesSum[12] += expense.amount;
  });

  // Add the total sum of all categories to the result
  result["All Categories"] = {};
  result["All Categories"]["totals"] = allCategoriesSum;

  const balance = monthNames.map((month, i) => {
    const totalIncome = result["Income"]["totals"][i] ?? 0;
    const totalExpense = result["All Categories"]["totals"][i] ?? 0;
    return totalIncome - totalExpense;
  });
  result["Balance"] = {};
  result["Balance"].totals = balance;
  //aggregate total balance
  result["Balance"]["totals"] = [
    ...result["Balance"]["totals"],
    result["Balance"]["totals"].reduce((total, item) => total + item),
  ];

  return result;
};

export const calculateTotalIncomePerMonth = (incomes: IIncome[]): number[] => {
  const totals = Array(12).fill(0); // Initialize an array of 12 zeroes

  if (!incomes.length) return [];
  for (const income of incomes) {
    const date = new Date(income.date);
    const month = date.getMonth();

    totals[month] += income.amount;
  }

  return totals;
};

export const processJSON = (data, incomes) => {
  if (!data || data.length === 0) {
    return {};
  }
  const result = {
    summary: Array(13).fill(0),
    categories: {},
  };

  data.forEach((doc) => {
    const month = new Date(doc.date).getMonth();
    const categoryId = doc.category.id;
    const categoryName = doc.category.name;
    const groupId = doc.group ? doc.group.id : null;
    const groupName = doc.group ? doc.group.name : null;

    if (!result.categories[categoryId]) {
      result.categories[categoryId] = {
        name: categoryName,
        groups: {},
        totals: Array(13).fill(0),
      };
    }

    if (groupId && !result.categories[categoryId].groups[groupId]) {
      result.categories[categoryId].groups[groupId] = {
        name: groupName,
        totals: Array(13).fill(0),
      };
    }

    result.summary[month] += doc.amount;
    result.summary[12] += doc.amount;
    result.categories[categoryId].totals[month] += doc.amount;
    result.categories[categoryId].totals[12] += doc.amount;

    if (groupId) {
      result.categories[categoryId].groups[groupId].totals[month] += doc.amount;
      result.categories[categoryId].groups[groupId].totals[12] += doc.amount;
    }
  });

  let incomeAmounts;
  if (incomes && incomes.length > 0) {
    incomeAmounts = calculateTotalIncomePerMonth(incomes);
    if (result["Income"]) {
      result["Income"].totals = incomeAmounts;
    } else {
      result["Income"] = { totals: incomeAmounts };
    }
  }

  // Add balance row to the result
  if (incomeAmounts) {
    const balanceAmounts = Object.entries(result).reduce(
      (acc, [_, groupData]: any) => {
        if (groupData.totals) {
          groupData.totals.forEach((total, index) => {
            if (total) {
              acc[index] -= total;
            }
          });
        }
        return acc;
      },
      [...incomeAmounts]
    );

    result["Balance"] = { totals: balanceAmounts };
  }

  return result;
};

export const calculateExpensesTotals = (expenses: any[] = []) => {
  if (expenses.length === 0) return {};
  const categoryGroups = _.groupBy(expenses, (expense) =>
    expense.group
      ? expense.category.id
      : expense.category.id + "-" + expense.group.id
  );
  const categoryTotals = _.mapValues(categoryGroups, (groupedExpenses) => {
    const monthlyTotals = _.chain(groupedExpenses)
      .groupBy((expense) => {
        const date = new Date(expense.date);
        return date.getMonth();
      })
      .mapValues((groupedExpenses) => {
        const categoryGroups = _.groupBy(groupedExpenses, (expense) =>
          expense.group ? expense.group.id : expense.category.id
        );
        const totalsByGroup = _.mapValues(
          categoryGroups,
          (expensesInCategory) => {
            return _.sumBy(expensesInCategory, "amount");
          }
        );
        const total = _.sum(_.values(totalsByGroup));
        return { totals: _.values(totalsByGroup), total };
      })
      .value();

    const summary = _.mergeWith(
      {},
      ..._.values(monthlyTotals),
      (objValue, srcValue) =>
        _.isArray(objValue)
          ? objValue.map((value, index) => value + srcValue[index])
          : undefined
    );
    summary.month = "summary";
    const yearlyTotal = _.sum(
      _.mapValues(summary, (value, key) => (key !== "month" ? value : 0))
    );

    const totalsWithYearly = _.mapValues(monthlyTotals, (totals) => {
      return {
        ...totals,
        totals: [...totals.totals, totals.total, yearlyTotal],
      };
    });
    totalsWithYearly.summary = {
      ...summary,
      totals: [...summary.totals, yearlyTotal],
    };

    return {
      name: groupedExpenses[0].category.name,
      groups: Object.keys(totalsWithYearly)
        .filter((key) => key !== "summary")
        .map((group) => {
          return {
            groupName:
              totalsWithYearly[group].totals.length > 13
                ? groupedExpenses.find((expense) => expense.group.id === group)
                    .group.name
                : null,
            totals: totalsWithYearly[group].totals,
          };
        }),
      totals: totalsWithYearly.summary.totals,
    };
  });

  const result = {
    categories: _.sortBy(Object.values(categoryTotals), "name"),
    summary: _.fill(Array(13), 0),
  };
  result.categories.forEach((category) => {
    category.totals.forEach((monthTotals, index) => {
      result.summary[index] += monthTotals[monthTotals.length - 1];
    });
  });

  return result;
};

export const getMonthNames = (format = "short", includeYearlyTotals = true) => {
  const shortNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const longNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const names = format === "short" ? shortNames : longNames;

  if (includeYearlyTotals) {
    return [...names, "Yearly Total"];
  } else {
    return names;
  }
};

export const colors = [
  "#F1F1F1",
  "#E6F1E6",
  "#F1E6E6",
  "#E6E6F1",
  "#FFFFCC",
  "#D9EDF7",
  "#CCE5FF",
  "#F1CCD9",
  "#B6A1CF",
  "#F1D9CC",
  "#CCF1E6",
  "#D9CCF1",
  "#CCD9F1",
  "#F1CCE6",
  "#E6CCF1",
  "#CCE6F1",
  "#CCF1D9",
  "#F1CCF1",
  "#E6E6E6",
  "#E6F1F1",
];
