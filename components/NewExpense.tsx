import React, { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";
import useExpenseCategory from "../hooks/useExpenseCategory.tsx";
import useExpenseGroup from "../hooks/useExpenseGroup.tsx";
import {
  parseTransactionInfo,
  parseTransactionList,
  formatDate,
} from "../utils.ts";
import useSelect from "../hooks/useSelect.tsx";
import TransactionCard from "../components/TransactionCard.tsx";
import { useExpensesContext } from "../hooks/expensesContext.tsx";
import styles from "../styles/TransactionCard.module.css";
import { parseSingleTransaction } from "../parseUtils.ts";

interface TransactionInfo {
  date?: Date;
  type?: string;
  description?: string;
  amount?: number;
  currency?: string;
  movementDate?: string;
  valueDate?: Date;
  accountNumber?: string;
  accountHolder?: string;
  observations?: string;
  transactionDate?: Date;
  account?: string;
  observation?: string;
  extraInfo?: string;
  location?: string;
  notes?: string;
}

const containerStyles = {
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
  flexDirection: "column",
  marginBottom: "20px",
  fontSize: "0.8rem",
};
const textAreaStyles = {
  border: "1px solid gray",
  height: "130px",
  width: "100%",
  fontSize: "0.8rem",
  paddingLeft: "20px",
};

const resultPaneStyle = {
  paddingLeft: "20px",
  paddingRight: "20px",
  marginTop: "20px",
  display: "flex",
  flexDirection: "column",
};

const fieldStyles = {
  borderBottom: "1px solid gray",
  marginBottom: "5px",
  display: "flex",
  justifyContent: "space-between",
};

const buttonStyles =
  "bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer";

const formStyles = "flex flex-col space-y-4 border p-5 rounded";
const inputContainerStyles = "flex flex-col space-y-2";
const labelStyles = "text-sm font-medium";
const inputStyles = "form-input rounded-md shadow-sm";
const selectStyles = "form-select rounded-md shadow-sm";
const textareaStyles = "form-textarea rounded-md shadow-sm";
//const containerStyles = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 b-1-gray";
const headerStyles = "bg-white shadow-xs py-4 px-4 sm:px-6";
const footerStyles = "bg-gray-100 py-4 px-4 sm:px-6";

const NewExpense = ({ loading, onCreate = (params) => {} }) => {
  const {
    currentYear,
    createExpenseHandler,
    creatingExpense,
    createIncomeHandler,
    fetchExpenses,
    fetchIncomes,
  } = useExpensesContext();

  const [text, setText] = useState("");
  const [transaction, setTransaction] = useState<TransactionInfo>({});
  const [extract, setExtract] = useState([]);
  const { expenseCategories } = useExpenseCategory();
  const { expenseGroups } = useExpenseGroup();
  const { selected: selectedCategory, SelectComponent: CategoriesSelect } =
    useSelect({ options: expenseCategories });
  const { selected: selectedGroup, SelectComponent: GroupsSelect } = useSelect({
    options: expenseGroups,
  });

  const handleChange = (e: any) => {
    setText(e.target.value);
  };

  useEffect(() => {
    const transaction = parseSingleTransaction(text);
    if (transaction) setTransaction(transaction);
    const extract = parseTransactionList(text);
    if (extract) setExtract(extract);
  }, [text]);

  useEffect(() => {
    if (selectedCategory)
      setTransaction((transaction) => {
        return { ...transaction, category: selectedCategory };
      });
    if (selectedGroup)
      setTransaction((transaction) => {
        return { ...transaction, group: selectedGroup };
      });
  }, [selectedCategory, selectedGroup]);

  const fields = Object.keys(transaction);

  const getIncomes = () =>
    extract.filter((transaction) => parseFloat(transaction.amount) > 0);
  const getExpenses = () =>
    extract.filter((transaction) => parseFloat(transaction.amount) < 0);
  const incomes = getIncomes();
  const expenses = getExpenses();

  const addExpenses = async () => {
    const payload = getExpenses().map((transaction) => {
      return {
        body: {
          ...transaction,
          date: formatDate(`${transaction.date}/${currentYear}`),
          valueDate: formatDate(`${transaction.valueDate}/${currentYear}`),
          amount: Math.abs(
            parseFloat(transaction.amount.replace(".", "").replace(",", "."))
          ),
          balance: parseFloat(
            transaction.balance.replace(".", "").replace(",", ".")
          ),
          category: selectedCategory,
          group: selectedGroup,
        },
      };
    });
    const r = await createExpenseHandler(payload);
    fetchExpenses();
  };

  const addIncomes = async () => {
    const payload = getIncomes().map((transaction) => {
      return {
        body: {
          ...transaction,
          date: formatDate(`${transaction.date}/${currentYear}`),
          valueDate: formatDate(`${transaction.valueDate}/${currentYear}`),
          amount: Math.abs(
            parseFloat(transaction.amount.replace(".", "").replace(",", "."))
          ),
          balance: parseFloat(
            transaction.balance.replace(".", "").replace(",", ".")
          ),
        },
      };
    });
    const { doc: newIncome } = await createIncomeHandler(payload);
    fetchIncomes();
  };

  const getTransactionBody = (transaction) => {
    console.log(transaction);
    return {
      body: {
        ...transaction,
        date: formatDate(`${transaction.date}/${currentYear}`),
        valueDate: formatDate(`${transaction.valueDate}/${currentYear}`),
        amount: Math.abs(parseFloat(transaction.amount)),
        // balance: parseFloat(
        //   transaction.balance.replace(".", "").replace(",", ".")
        // ),
      },
    };
  };

  return (
    <div style={containerStyles}>
      <textarea
        style={textAreaStyles}
        value={text}
        onChange={handleChange}
      ></textarea>
      <div style={resultPaneStyle}>
        {!!fields.length && (
          <>
            {/* <div style={fieldStyles}>
              <span>Category:</span>
              <span>{CategoriesSelect}</span>
            </div>

            <div style={fieldStyles}>
              <span>Group:</span>
              <span>{GroupsSelect}</span>
            </div> */}

            {fields.map((field) => {
              return (
                <div style={fieldStyles} key={field}>
                  <span>{field}:</span>
                  <span>{transaction[field].toString()}</span>{" "}
                </div>
              );
            })}
            <button
              className={buttonStyles}
              onClick={async () => {
                await createExpenseHandler({
                  ...getTransactionBody(transaction),
                });
                fetchExpenses();
              }}
            >
              Confirmar {loading && <Spinner />}
            </button>
          </>
        )}
      </div>
      <div className={"w-full flex flex-col items-center justify-around p-2"}>
        {!!incomes.length && (
          <span>
            <button
              //disabled={creatingExpense || deletingExpense}
              className={`${styles.addButton} mb-2 w-full`}
              onClick={addIncomes}
            >
              Add {incomes.length} Ingresos
            </button>
          </span>
        )}
        {/* <div
          className={"grid mt-5"}
          style={{
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: "5px",
            gridAutoRows: "400px",
          }}
        >
          {incomes?.map((transaction: any, i) => {
            return (
              <TransactionCard
                key={i}
                parsedTransaction={transaction}
                index={i}
                year={currentYear}
              />
            );
          })}
        </div> */}
        {!!expenses.length && (
          <span>
            <button
              //disabled={creatingExpense || deletingExpense}
              className={`${styles.addButton} mt-2 w-full`}
              onClick={addExpenses}
            >
              Add {expenses.length} Gastos
            </button>
          </span>
        )}
      </div>

      {/* <div
        className={"grid mt-5"}
        style={{
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "5px",
          gridAutoRows: "330px",
        }}
      >
        {expenses?.map((transaction: any, i) => {
          return (
            <TransactionCard
              key={i}
              parsedTransaction={transaction}
              index={i}
              year={currentYear}
            />
          );
        })}
      </div> */}
    </div>
  );
};

export default NewExpense;
