import React, { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import useExpenseCategory from "../hooks/useExpenseCategory.tsx";
import useExpenseGroup from "../hooks/useExpenseGroup.tsx";
import { parseTransactionInfo, extractTransactions } from "../utils.ts";
import useSelect from "../hooks/useSelect.tsx";
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

const NewExpense = ({ loading, onCreate = (params) => {} }) => {
  const [text, setText] = useState("");
  const [transaction, setTransaction] = useState<TransactionInfo>({});
  const [extract, setExtract] = useState([]);
  const { expenseCategories, loading: loadingCategories } =
    useExpenseCategory();
  const { expenseGroups, loading: loadingGroups } = useExpenseGroup();
  const { selected: selectedCategory, SelectComponent: CategoriesSelect } =
    useSelect({ options: expenseCategories });
  const { selected: selectedGroup, SelectComponent: GroupsSelect } = useSelect({
    options: expenseCategories,
  });

  const handleChange = (e: any) => {
    setText(e.target.value);
  };

  useEffect(() => {
    const transaction = parseTransactionInfo(text);
    if (transaction) setTransaction(transaction);
    const extract = extractTransactions(text);
    if (extract) setExtract(extract);
  }, [text]);

  useEffect(() => {
    if (selectedCategory)
      setTransaction((transaction) => {
        return { ...transaction, expense_category: { id: selectedCategory } };
      });
    if (selectedGroup)
      setTransaction((transaction) => {
        return { ...transaction, expense_group: { id: selectedGroup } };
      });
  }, [selectedCategory, selectedGroup]);

  const fields = Object.keys(transaction);

  const containerStyles = {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: "20px",
    fontSize: "0.8rem",
  };
  const textAreaStyles = {
    border: "1px solid gray",
    height: "250px",
    width: "50%",
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
      <div className={"flex flex-col"}>
        {extract?.map((transaction: any, i) => {
          return (
            <TransactionCard
              key={i}
              transaction={transaction}
              expenseCategories={expenseCategories}
              expenseGroups={expenseGroups}
            />
          );
        })}
      </div>
    </div>
  );
};

const TransactionCard = ({ transaction, expenseCategories, expenseGroups }) => {
  const { selected: selectedCategory, SelectComponent: CategorySelect } =
    useSelect({ options: expenseCategories });
  const { selected: selectedGroup, SelectComponent: GroupsSelect } = useSelect({
    options: expenseGroups,
  });
  console.log(transaction, "transaction");
  return (
    <Card style={{ marginTop: "10px" }}>
      <CardBody>
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr 1fr 1fr" }}>
          <span>{transaction.description}</span>
          <span>{transaction.amount}</span>
          <span>{CategorySelect}</span>
          <span>{GroupsSelect}</span>
        </div>
      </CardBody>
    </Card>
  );
};

export default NewExpense;
