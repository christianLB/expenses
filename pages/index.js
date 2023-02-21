import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import ExpenseForm from "../components/ExpenseForm.tsx";
import FixedExpenseForm from "../components/FixedExpenseForm.tsx";
import FixedExpenseList from "../components/FixedExpenseList.tsx";
//import ExpenseTable from "../components/ExpenseTable.tsx";
//import ExpenseTable from "../components/ExpenseTable-chackra.tsx";
import ExpenseTimeline from "../components/ExpenseTimeline.tsx";
import { useRouter } from "next/router";
import useExpense from "../hooks/useExpense.ts";
import useExpenseCategory from "../hooks/useExpenseCategory.ts";
import ExpenseTable from "../components/ExpensesTotalsTable.tsx";
import { Spinner } from "@chakra-ui/react";
import NewExpense from "../components/NewExpense.tsx";

// export const getServerSideProps = async ({ req }) => {
//   const prisma = new PrismaClient();
//   const expenses = await prisma.expense.findMany({
//     include: {
//       fixedExpense: true,
//     },
//   });
//   const fixedExpenses = await prisma.fixedExpense.findMany();

//   return {
//     props: {
//       initialExpenses: JSON.parse(JSON.stringify(expenses)),
//       fixedExpenses: JSON.parse(JSON.stringify(fixedExpenses)),
//     },
//   };
// };

export default function Home() {
  const { expenses, categoryGroupExpenses, loading, createExpenseHandler } = useExpense();
  //const [selectedExpense, setSelected] = useState(null);
  const categoryNames = Object.keys(categoryGroupExpenses);

  if (loading)
    return (
      <>
        <Spinner /> Cargando... Espere!
      </>
    );

  return (
    <div className={styles.container}>
      <Head>
        <title>Expenses</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <NewExpense onCreate={createExpenseHandler} />
        <ExpenseTable expensesResult={categoryGroupExpenses} />
        {/* {categoryNames.map((category, i) => (
          <ExpenseTable
            key={category}
            expenses={categoryExpenses[category]}
            name={category}
            displayMonths={i === 0}
          />
        ))} */}

        <section className={"flex flex-row"}>
          {/* <ExpenseForm fixedExpenses={fixedExpenses} />
          <FixedExpenseForm />
          <FixedExpenseList fixedExpenses={fixedExpenses} /> */}
        </section>
        {/* <ExpenseTimeline expenses={initialExpenses} /> */}
        {/* <ExpenseTable
          expenses={expenses}
          onDelete={handleDeleteExpense}
          onSelect={(expense) => setSelected(expense)}
          selectedExpense={selectedExpense}
        /> */}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.logo}>K2600X - garantía de algo...</span>
        </a>
      </footer>
    </div>
  );
}
