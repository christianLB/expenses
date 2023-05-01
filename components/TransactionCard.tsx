import { Card, Spinner, CardBody } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { formatDate } from "../utils.ts";
import { useExpensesContext } from "../hooks/expensesContext.tsx";
import useSelect from "../hooks/useSelect.tsx";
import styles from "../styles/TransactionCard.module.css";
const buttonStyles =
  "bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer";

const TransactionCard = ({ parsedTransaction, index, year }) => {
  const {
    createExpenseHandler,
    createIncomeHandler,
    creatingExpense,
    deleteExpenseHandler,
    deletingExpense,
    expenseCategories,
    expenseGroups,
    fetchExpenses,
    findExpensesByQueryHandler,
    clients,
  } = useExpensesContext();

  const { selected: selectedCategory, SelectComponent: CategorySelect } =
    useSelect({ options: expenseCategories, placeHolder: "category" });
  const { selected: selectedClient, SelectComponent: ClientSelect } = useSelect(
    { options: clients, placeHolder: "client" }
  );
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
    console.log("transactionCard addExpense");
    const date = formatDate(`${transaction.date}/${year}`);
    const valueDate = formatDate(`${transaction.valueDate}/${year}`);
    const amount = Math.abs(
      parseFloat(transaction.amount.replace(".", "").replace(",", "."))
    );
    const balance = parseFloat(
      transaction.balance.replace(".", "").replace(",", ".")
    );

    const duplicateExpense = await findExpensesByQueryHandler({
      date: {
        equals: date,
      },
      and: [
        {
          amount: {
            equals: amount,
          },
        },
        {
          name: {
            equals: transaction.name,
          },
        },
      ],
    });
    console.log(duplicateExpense);
    return;
    const { doc: newExpense } = await createExpenseHandler({
      body: {
        ...transaction,
        date,
        valueDate,
        amount,
        balance,
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
        client: selectedClient,
      },
    });

    if (newIncome) setTransaction(newIncome);

    fetchExpenses();
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

  const isIncome = parseFloat(transaction.amount) > 0;
  const buttonAction = transactionId
    ? deleteExpense
    : isIncome
    ? addIncome
    : addExpense;

  return (
    <Card className={styles.card}>
      <span className={styles.transactionId}>
        {(creatingExpense || deletingExpense) && <Spinner />}
        {transactionId ? transactionId : ++index}
      </span>
      <div className={styles.transactionInfo}>
        <div className={styles.transactionRow}>
          <span>{transaction.name}</span>
        </div>
        <div className={styles.transactionRow}>
          <span>{transaction.date}</span>
          <span>{transaction.valueDate}</span>
        </div>
        <div className={styles.transactionRow}>
          <span>{transaction.amount}</span>
          <span>{transaction.currency}</span>
        </div>
        <div className={styles.transactionRow}>
          <span>{transaction.balance}</span>
          <span>{transaction.currency}</span>
        </div>
      </div>
      {!isIncome && (
        <>
          <span className={styles.selectComponent}>{CategorySelect}</span>
          <span className={styles.selectComponent}>{GroupsSelect}</span>
        </>
      )}
      {isIncome && (
        <span className={styles.selectComponent}>{ClientSelect}</span>
      )}
      <button
        disabled={creatingExpense || deletingExpense}
        className={`${styles.addButton} ${
          transactionId ? styles.deleteButton : ""
        }`.trim()}
        onClick={buttonAction}
      >
        {transactionId ? "Delete" : "Add"}
      </button>
    </Card>
  );
};

export default TransactionCard;
