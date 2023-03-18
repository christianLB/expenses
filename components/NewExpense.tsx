import React, { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import useExpenseCategory from "../hooks/useExpenseCategory.tsx";
import useExpenseGroup from "../hooks/useExpenseGroup.tsx";
import {
  parseTransactionInfo,
  extractTransactions,
  parseTransactionList,
  formatDate,
} from "../utils.ts";
import useSelect from "../hooks/useSelect.tsx";
import useExpense from "../hooks/useExpense.ts";
import { useExpensesContext } from "../hooks/expensesContext.tsx";

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
  const [text, setText] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [transaction, setTransaction] = useState<TransactionInfo>({});
  const [extract, setExtract] = useState([]);
  const { expenseCategories, loading: loadingCategories } =
    useExpenseCategory();
  const { expenseGroups, loading: loadingGroups } = useExpenseGroup();
  const { selected: selectedCategory, SelectComponent: CategoriesSelect } =
    useSelect({ options: expenseCategories });
  const { selected: selectedGroup, SelectComponent: GroupsSelect } = useSelect({
    options: expenseGroups,
  });

  const handleChange = (e: any) => {
    setText(e.target.value);
  };

  useEffect(() => {
    const transaction = parseTransactionInfo(text);
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

  return (
    <div style={containerStyles}>
      <textarea
        style={textAreaStyles}
        value={text}
        onChange={handleChange}
      ></textarea>
      <input type='text' value={selectedYear} onChange={(e: any) => setSelectedYear(e.target.value) }/>
      <div style={resultPaneStyle}>
        {!!fields.length && (
          <>
            <div style={fieldStyles}>
              <span>Category:</span>
              <span>{CategoriesSelect}</span>
            </div>

            <div style={fieldStyles}>
              <span>Group:</span>
              <span>{GroupsSelect}</span>
            </div>

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
              onClick={() => onCreate({ body: transaction })}
            >
              Confirmar {loading && <Spinner />}
            </button>
          </>
        )}
      </div>
      <div
        className={"grid mt-5"}
        style={{
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "5px",
          gridAutoRows: "330px",
        }}
      >
        {extract?.map((transaction: any, i) => {
          return (
            <TransactionCard
              key={i}
              parsedTransaction={transaction}
              index={i}
              year={selectedYear}
            />
          );
        })}
      </div>
    </div>
  );
};

const TransactionCard = ({
  parsedTransaction,
  index,
  year
}) => {
  const {
    createExpenseHandler,
    creatingExpense,
    deleteExpenseHandler,
    deletingExpense,
    expenseCategories,
    expenseGroups,
    fetchExpenses,
  } = useExpensesContext();

  const { selected: selectedCategory, SelectComponent: CategorySelect } =
    useSelect({ options: expenseCategories, placeHolder: "category" });
  const { selected: selectedGroup, SelectComponent: GroupsSelect } = useSelect({
    options: expenseGroups,
    placeHolder: "group",
  });

  const [transaction, setTransaction] = useState({ id: "" });
  const transactionId = transaction.id;

  useEffect(() => {
    if (parsedTransaction) setTransaction(parsedTransaction);
  }, [parsedTransaction]);

  const addExpense = async () => {
    const { doc: newExpense } = await createExpenseHandler({
      body: {
        ...transaction,
        date: formatDate(`${transaction.date}/${year}`),
        valueDate: formatDate(`${transaction.valueDate}/${year}`),
        amount: Math.abs(
          parseFloat(transaction.amount.replace(".", "").replace(",", "."))
        ),
        balance: parseFloat(
          transaction.balance.replace(".", "").replace(",", ".")
        ),
        category: selectedCategory,
        group: selectedGroup,
      },
    });

    if (newExpense) {
      setTransaction(newExpense);
      fetchExpenses();
    }
  };

  const deleteExpense = async () => {
    const deletedTransaction = await deleteExpenseHandler({
      id: transactionId,
    });
    if (deletedTransaction?.id === transactionId) {
      setTransaction(parsedTransaction); //back to original
      fetchExpenses();
    }
  };

  const buttonAction = transactionId ? deleteExpense : addExpense;

  return (
    <Card style={{ marginTop: "5px" }}>
      <span className={"flex justify-between mr-2 text-gray-400"}>
        {
          <span className={"ml-2"}>
            {(creatingExpense || deletingExpense) && <Spinner />}
          </span>
        }
        {transactionId ? transactionId : ++index}
      </span>
      <CardBody>
        <div
          className={"text-xs"}
          style={{
            display: "grid",
            gridTemplateRows: "100px 20px 30px 30px 30px 33px",
          }}
        >
          <span>{transaction.name}</span>
          <div className={"flex flex-row justify-between border-b"}>
            <span>{transaction.date}</span>
            <span>{transaction.valueDate}</span>
          </div>
          <div className={"flex flex-row justify-between border-b"}>
            <span>{transaction.amount}</span>
            <span>{transaction.currency}</span>
          </div>
          <div className={"flex flex-row justify-between"}>
            <span>{transaction.balance}</span>
            <span>{transaction.currency}</span>
          </div>
          <span>{CategorySelect}</span>
          <span>{GroupsSelect}</span>
          <button
            disabled={creatingExpense || deletingExpense}
            className={`${buttonStyles} ${
              transactionId ? "bg-red-200" : ""
            }`.trim()}
            onClick={buttonAction}
          >
            {transactionId ? "Delete" : "Add"}
          </button>
        </div>
      </CardBody>
    </Card>
  );
};

export default NewExpense;
