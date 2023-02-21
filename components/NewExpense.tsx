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

function parseTransactionInfo(text: string): TransactionInfo | null {
  const fields = text.split("\n").map((line) => line.trim());

  const matchType = fields[0].match(/^Tipo de movimiento\s+(.+)/);
  const type = matchType ? matchType[1] : "";

  const matchDescription = fields[1].match(/^Descripción\s+(.+)/);
  const description = matchDescription ? matchDescription[1] : "";

  const matchAmount = fields[2].match(
    /^Importe\s+(-?\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?)/
  );
  const amount = matchAmount
    ? parseFloat(matchAmount[1].replace(".", "").replace(",", "."))
    : NaN;

  const matchCurrency = fields[3].match(/^Divisa\s+(.+)/);
  const currency = matchCurrency ? matchCurrency[1] : "";

  const matchDate = fields[4].match(
    /^Fecha del movimiento\s+(\d{2}\/\d{2}\/\d{4})/
  );
  const date = matchDate ? new Date(matchDate[1]) : null;

  const matchValueDate = fields[5].match(
    /^Fecha valor\s+(\d{2}\/\d{2}\/\d{4})/
  );
  const valueDate = matchValueDate ? new Date(matchValueDate[1]) : null;

  const matchAccount = fields[6].match(/^Cuenta cargo\/abono\s+(.+)/);
  const account = matchAccount ? matchAccount[1] : "";

  const matchAccountHolder = fields[7].match(/^Titular de la cuenta\s+(.+)/);
  const accountHolder = matchAccountHolder ? matchAccountHolder[1] : "";

  const matchNotes = fields[8].match(/^Observaciones\s+(.+)/);
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
    description: description,
    amount: amount,
    currency: currency,
    date: date,
    valueDate: valueDate,
    account: account,
    accountHolder: accountHolder,
    notes: notes,
  };
}

const NewExpense = () => {
  const [text, setText] = useState("");
  const handleChange = (e: any) => {
    setText(e.target.value);
  };

  useEffect(() => {
    const bka = `Tipo de movimiento Cuenta
    Descripción LEROY MERLIN MASSANASSA MASSANASSA ES
    Importe -143,56
    Divisa EUR
    Fecha del movimiento 20/02/2023
    Fecha valor 18/02/2023
    Cuenta cargo/abono ES36 0182 **** **** **** 8475
    Titular de la cuenta Christian Alejandro Agüero Chao
    Observaciones 4940197135669736 LEROY MERLIN MASSANASSA MASSANASSA ES`;

    console.log("transaction", parseTransactionInfo(text));
  }, [text]);

  return (
    <div>
      la reputa que te parió.
      <textarea
        value={text}
        onChange={handleChange}
        style={{ border: "1px solid gray" }}
      ></textarea>
    </div>
  );
};

export default NewExpense;
