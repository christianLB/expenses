import { Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface TransactionInfo {
  date?: Date;
  type?: string;
  description?: string;
  amount?: number;
  currency?: string;
  movementDate?: string;
  valueDate?: Date;
  accountNumber?: string;
  accountHolder?: string;
  observations?: string;
  transactionDate?: Date;
  account?: string;
  observation?: string;
  extraInfo?: string;
  location?: string;
  notes?: string;
}

const formatDate = (date: string) => {
  //const dateString = '20/02/2023';
  const [day, month, year] = date.split("/");
  const dateObject = new Date(`${year}-${month}-${day}`);
  return dateObject;
};

function parseTransactionInfo(text: string): any | null {
  const fields = text.split("\n").map((line) => line.trim());

  const matchType = fields[0].match(/^Tipo de movimiento\s+(.+)/);
  const type = matchType ? matchType[1] : "";

  const matchDescription =
    (fields[1] && fields[1].match(/^Descripción\s+(.+)/)) || "";
  const description = matchDescription ? matchDescription[1] : "";

  const matchAmount =
    (fields[2] &&
      fields[2].match(/^Importe\s+(-?\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?)/)) ||
    "";
  const amount = matchAmount
    ? parseFloat(matchAmount[1].replace(".", "").replace(",", "."))
    : NaN;

  const matchCurrency = (fields[3] && fields[3].match(/^Divisa\s+(.+)/)) || "";
  const currency = matchCurrency ? matchCurrency[1] : "";

  const matchDate =
    (fields[4] &&
      fields[4].match(/^Fecha del movimiento\s+(\d{2}\/\d{2}\/\d{4})/)) ||
    "";
  const date = matchDate ? formatDate(matchDate[1]) : null;

  const matchValueDate =
    (fields[5] && fields[5].match(/^Fecha valor\s+(\d{2}\/\d{2}\/\d{4})/)) ||
    "";
  const valueDate = matchValueDate ? formatDate(matchValueDate[1]) : null;

  const matchAccount =
    (fields[6] && fields[6].match(/^Cuenta cargo\/abono\s+(.+)/)) || "";
  const account = matchAccount ? matchAccount[1] : "";

  const matchAccountHolder =
    (fields[7] && fields[7].match(/^Titular de la cuenta\s+(.+)/)) || "";
  const accountHolder = matchAccountHolder ? matchAccountHolder[1] : "";

  const matchNotes =
    (fields[8] && fields[8].match(/^Observaciones\s+(.+)/)) || "";
  const notes = matchNotes ? matchNotes[1] : "";

  if (
    !type ||
    !description ||
    isNaN(amount) ||
    !currency ||
    !date ||
    !valueDate ||
    !account ||
    !accountHolder ||
    !notes
  ) {
    return null;
  }

  return {
    type: type,
    Name: description,
    amount: Math.abs(amount),
    currency: currency,
    Date: valueDate,
    //valueDate: valueDate,
    account: account,
    Account_holder: accountHolder,
    notes: notes,
  };
}

const NewExpense = ({ loading, onCreate = (params) => {} }) => {
  const [text, setText] = useState("");
  const [transaction, setTransaction] = useState<TransactionInfo>({});

  const handleChange = (e: any) => {
    setText(e.target.value);
  };

  useEffect(() => {
    const transaction = parseTransactionInfo(text);
    if (transaction) setTransaction(transaction);
  }, [text]);

  const fields = Object.keys(transaction);

  const containerStyles = {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: "20px",
    fontSize: "0.8rem",
  };
  const textAreaStyles = {
    border: "1px solid gray",
    height: "250px",
    width: "50%",
    fontSize: "0.8rem",
    paddingLeft: "20px",
  };

  const resultPaneStyle = {
    paddingLeft: "20px",
    display: "flex",
    flexDirection: "column",
  };

  const fieldStyles = {
    borderBottom: "1px solid gray",
    marginBottom: "5px",
    display: "flex",
    justifyContent: "space-between",
  };

  const buttonStyles =
    "bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer";

  const formStyles = "flex flex-col space-y-4 border p-5 rounded";
  const inputContainerStyles = "flex flex-col space-y-2";
  const labelStyles = "text-sm font-medium";
  const inputStyles = "form-input rounded-md shadow-sm";
  const selectStyles = "form-select rounded-md shadow-sm";
  const textareaStyles = "form-textarea rounded-md shadow-sm";
  //const containerStyles = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 b-1-gray";
  const headerStyles = "bg-white shadow-xs py-4 px-4 sm:px-6";
  const footerStyles = "bg-gray-100 py-4 px-4 sm:px-6";

  return (
    <div style={containerStyles}>
      <textarea
        style={textAreaStyles}
        value={text}
        onChange={handleChange}
      ></textarea>

      <div style={resultPaneStyle}>
        {!!fields.length && (
          <>
            {fields.map((field) => {
              return (
                <div style={fieldStyles} key={field}>
                  <span>{field}:</span>
                  <span>{transaction[field].toString()}</span>{" "}
                </div>
              );
            })}
            <button
              className={buttonStyles}
              onClick={() => onCreate({ body: transaction })}
            >
              Confirmar {loading && <Spinner />}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NewExpense;
