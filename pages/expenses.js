import Table from "../components/DataTable/DataTable.tsx";
import { useExpensesContext } from "../hooks/expensesContext.tsx";
import LoginBtn from "../components/loginbtn.tsx";

import FileUploader from "../components/FileUploader";
import { getSession } from "next-auth/react";
import { getTableData } from "./api/tableData"; // Ajusta la ruta de importación según sea necesario
import { AppShell, Paper, Stack, Group } from "@mantine/core";

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const { query } = context;
  const { year = new Date().getFullYear() } = query;

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    // Aquí invocas directamente la función que obtiene los datos
    const tableData = await getTableData(context.req, year);

    return { props: { session, tableData: tableData } };
  } catch (error) {
    // Manejar el error aquí...
    return { props: { session, tableData: null, error: error.message } };
  }
}

export default function Expenses({ tableData }) {
  const {
    currentYear,
    setCurrentYear,
    //gmailApi: { loading: gmailLoading },
    //gmailResponse,
  } = useExpensesContext();

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Group>
          <LoginBtn />
        </Group>
      </AppShell.Header>
      <title>Expenses</title>
      <meta name="description" content="Expenses tracking." />
      <link rel="icon" href="/favicon.ico" />


      <AppShell.Main>
        <Paper mih={550} m="xl" p="xl" withBorder shadow="lg">
          <Stack gap={'lg'} align="center">
            {/* <FileUploader /> */}
            <Table data={tableData} />
          </Stack>
        </Paper>
      </AppShell.Main>
    </AppShell>
    //   <div className="min-h-screen flex flex-col">

    // <div
    //   className={
    //     "fixed flex flex-row bg-gray-200 p-2 w-full justify-between z-50"
    //   }
    // >
    //   <div className="flex items-center gap-5">
    //     <Box
    //       display="flex"
    //       alignItems="center"
    //       p={2}
    //       borderWidth={1}
    //       borderRadius="lg"
    //       borderColor={"blackAlpha.300"}
    //     >
    //       <Text marginRight="0.5rem">Year:</Text>
    //       <NumberInput
    //         defaultValue={currentYear}
    //         onChange={(valueString) => setCurrentYear(parseInt(valueString))}
    //         className="mb-2 md:mb-0 text-black"
    //       >
    //         <NumberInputField />
    //         <NumberInputStepper>
    //           <NumberIncrementStepper />
    //           <NumberDecrementStepper />
    //         </NumberInputStepper>
    //       </NumberInput>
    //     </Box>
    //   </div>
    // </div>
    // <main className="flex flex-1 flex-col p-4 md:p-8 pt-5 items-center mt-20">
    // </main>
    //</div >
  );
}
