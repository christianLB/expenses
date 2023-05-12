import { useRef } from "react";
import Head from "next/head";
import Footer from "../components/Footer.tsx";
import NewExpense from "../components/NewExpense.tsx";
import ExpensesDashboard from "../components/ExpensesDashboard.tsx";
import Table from "../components/DataTable/DataTable.tsx";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Text,
  VStack,
  Grid,
  GridItem,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { useExpensesContext } from "../hooks/expensesContext.tsx";
import { useTextBuffer } from "nextjs-openai";
import useApi from "../hooks/useApi.ts";
import styles from "../styles/Expenses.module.css";

export default function Expenses() {
  const tableRef = useRef();
  const { currentYear, setCurrentYear, groupedExpensesByCategory, categories } =
    useExpensesContext();
  //const data = `Qué me puedes decir de esta información?\n${tableRef.innerText}`;
  const {
    request: gpt4,
    loading,
    response,
  } = useApi("./api/gpt4", { method: "POST" });

  // const { buffer, refresh, cancel, done } = useTextBuffer({
  //   url: "./api/openai",
  //   throttle: 100,
  //   data,
  // });

  // const handleChatGptClick = () => {
  //   const maxTokens = 100;
  //   const prompt = `Qué me puedes decir de esta información?\n${tableRef.innerText}`;
  // };
  const callApi = async () => {
    const out = {
      ["año"]: currentYear,
      ["mes actual"]: new Date().getMonth(),
    };

    groupedExpensesByCategory.forEach((category) => {
      out[category.name] = category.totals.toString();
    });
    const stringTable = JSON.stringify(out);
    const resp = await gpt4({ body: stringTable });
  };

  function HtmlStringRenderer({ htmlString }) {
    return (
      <div className={"gpt"} dangerouslySetInnerHTML={{ __html: htmlString }} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Expenses</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        className={"h-full w-1/5 absolute start-0 bg-white"}
        display="flex"
        justifyContent={"center"}
        flexWrap="wrap"
        p={4}
        borderWidth={1}
        borderRadius="lg"
      >
        {loading && <Spinner />}
        {!loading && !response?.answer && (
          <Button onClick={callApi}>Consultar a GPT</Button>
        )}
        {response?.answer && (
          <HtmlStringRenderer htmlString={response?.answer} />
        )}
      </Box>
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <VStack spacing={6} w="100%">
            <Box>
              <Grid
                templateColumns="repeat(auto-fit, minmax(320px, 1fr))"
                gap={4}
              >
                <GridItem>
                  <Box
                    display="flex"
                    alignItems="center"
                    flexWrap="wrap"
                    p={4}
                    borderWidth={1}
                    borderRadius="lg"
                  >
                    <Text marginRight="0.5rem">Year:</Text>
                    <NumberInput
                      defaultValue={currentYear}
                      onChange={(valueString) =>
                        setCurrentYear(parseInt(valueString))
                      }
                      className="mb-2 md:mb-0"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box
                    p={4}
                    borderWidth={1}
                    borderRadius="lg"
                    overflow="hidden"
                  >
                    <Accordion allowToggle>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>Add new expense</AccordionButton>
                        </h2>
                        <AccordionPanel>
                          <NewExpense />
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  </Box>
                </GridItem>
              </Grid>
            </Box>

            <Box
              ref={tableRef}
              borderWidth={1}
              borderRadius="lg"
              overflow="hidden"
            >
              <Table />
            </Box>
            {/* <button onClick={refresh}>¿Qué es esto?</button> */}
            {/* <StreamingText buffer={buffer} fade={600} /> */}
            <Box borderWidth={1} borderRadius="lg" overflow="hidden">
              <ExpensesDashboard />
            </Box>
          </VStack>
        </div>
      </main>
      <Footer />
    </div>
  );
}
