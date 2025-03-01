import { useState } from 'react';
import "../styles/globals.css";
import "@mantine/core/styles.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ExpensesProvider } from "../hooks/expensesContext.tsx";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <ExpensesProvider>
            <Component {...pageProps} />
          </ExpensesProvider>
        </MantineProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
