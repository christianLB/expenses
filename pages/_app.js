import "../styles/globals.css";
import "@mantine/core/styles.css";
import { ExpensesProvider } from "../hooks/expensesContext.tsx";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <MantineProvider>
        <ExpensesProvider>
          <Component {...pageProps} />
        </ExpensesProvider>
      </MantineProvider>
    </SessionProvider>
  );
}

export default MyApp;
