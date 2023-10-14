import { useRef } from "react";
import Head from "next/head";
import Table from "../components/DataTable/DataTable.tsx";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
  Text,
  //VStack,
  Spinner,
} from "@chakra-ui/react";
import { useExpensesContext } from "../hooks/expensesContext.tsx";
import LoginBtn from "../components/loginbtn.tsx";
import { useSession } from "next-auth/react";

export default function Expenses() {
  const tableRef = useRef();
  const { data: session } = useSession();

  const {
    currentYear,
    setCurrentYear,
    gmailApi: { loading: gmailLoading },
    gmailResponse,
  } = useExpensesContext();

  if (!session)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <LoginBtn />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Expenses</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={
          "fixed flex flex-row bg-gray-200 p-2 w-full justify-between z-50"
        }
      >
        <div className="flex items-center gap-5">
          <Box
            display="flex"
            alignItems="center"
            p={2}
            borderWidth={1}
            borderRadius="lg"
            borderColor={"blackAlpha.300"}
          >
            <Text marginRight="0.5rem">Year:</Text>
            <NumberInput
              defaultValue={currentYear}
              onChange={(valueString) => setCurrentYear(parseInt(valueString))}
              className="mb-2 md:mb-0 text-black"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Box>
          {gmailLoading && (
            <span className="flex items-center gap-5">
              <Spinner /> Comprobando nuevos movimientos.
            </span>
          )}
          {!gmailLoading && (
            <span className="flex items-center gap-5">
              {gmailResponse?.length > 0 && (
                <>Se registraron {gmailResponse?.length} nuevos movimientos.</>
              )}
              {!gmailResponse?.length && (
                <>No se registran nuevos movimientos.</>
              )}
            </span>
          )}
        </div>
        <LoginBtn />
      </div>
      <main className="flex flex-1 p-4 md:p-8 pt-5 items-center">
        <Table />
      </main>
    </div>
  );
}
