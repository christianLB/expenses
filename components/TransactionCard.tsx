import { Card, Spinner, CardBody } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { formatDate } from "../utils.ts";
import { useExpensesContext } from '../hooks/expensesContext.tsx'
import useSelect from '../hooks/useSelect.tsx'

const buttonStyles =
  "bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer";

const TransactionCard = ({
  parsedTransaction,
  index,
  year
}) => {
  const {
    createExpenseHandler,
    createIncomeHandler,
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

  const addIncome = async () => {
    const { doc: newIncome } = await createIncomeHandler({
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

    if (newIncome) {
      setTransaction(newIncome);
      fetchExpenses();
    }
  }

  const deleteExpense = async () => {
    const deletedTransaction = await deleteExpenseHandler({
      id: transactionId,
    });
    if (deletedTransaction?.id === transactionId) {
      setTransaction(parsedTransaction); //back to original
      fetchExpenses();
    }
  };

  const isIncome = parseFloat(transaction.amount) > 0
  const buttonAction = transactionId ? deleteExpense : isIncome ? addIncome : addExpense;

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

export default TransactionCard;