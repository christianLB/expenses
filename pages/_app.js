import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { ExpensesProvider } from "../hooks/expensesContext.tsx";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ExpensesProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </ExpensesProvider>
    </SessionProvider>
  );
}

export default MyApp;
