import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { ExpensesProvider } from "../hooks/expensesContext.tsx";

function MyApp({ Component, pageProps }) {
  return (
    <ExpensesProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ExpensesProvider>
  );
}

export default MyApp;
