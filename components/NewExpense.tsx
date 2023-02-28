import React, { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import useExpenseCategory from "../hooks/useExpenseCategory.ts";
import useExpenseGroup from "../hooks/useExpenseGroup.ts";
import { parseTransactionInfo, extractTransactions } from "../utils.ts";
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
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedGroup, setSelectedGroup] = useState();

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
              <span>
                <Select
                  placeholder="Select option"
                  size="xs"
                  onChange={(e: any) => setSelectedCategory(e.target.value)}
                >
                  {expenseCategories.map((category) => {
                    return (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    );
                  })}
                </Select>
              </span>
            </div>

            <div style={fieldStyles}>
              <span>Group:</span>
              <span>
                <Select
                  placeholder="Select option"
                  size="xs"
                  onChange={(e: any) => setSelectedGroup(e.target.value)}
                >
                  {expenseGroups.map((group) => {
                    return (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    );
                  })}
                </Select>
              </span>
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

      {extract?.map((transaction: any, i) => {
        return <div key={i}>{transaction.transactionDate}</div>;
      })}
    </div>
  );
};

export default NewExpense;
