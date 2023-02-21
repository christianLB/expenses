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
const [day, month, year] = date.split('/');
  const dateObject = new Date(`${year}-${month}-${day}`);
  return dateObject
}

function parseTransactionInfo(text: string): TransactionInfo | null {
  const fields = text.split("\n").map((line) => line.trim());

  const matchType = fields[0].match(/^Tipo de movimiento\s+(.+)/);
  const type = matchType ? matchType[1] : "";

  const matchDescription = fields[1] && fields[1].match(/^Descripción\s+(.+)/) || '';
  const description = matchDescription ? matchDescription[1] : "";

  const matchAmount = fields[2] && fields[2].match(
    /^Importe\s+(-?\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?)/
  ) || '';
  const amount = matchAmount
    ? parseFloat(matchAmount[1].replace(".", "").replace(",", "."))
    : NaN;

  const matchCurrency = fields[3] && fields[3].match(/^Divisa\s+(.+)/) || '';
  const currency = matchCurrency ? matchCurrency[1] : "";

  const matchDate = fields[4] && fields[4].match(
    /^Fecha del movimiento\s+(\d{2}\/\d{2}\/\d{4})/
  ) || '';
  const date = matchDate ? formatDate(matchDate[1]) : null;

  const matchValueDate = fields[5] && fields[5].match(
    /^Fecha valor\s+(\d{2}\/\d{2}\/\d{4})/
  ) || '';
  const valueDate = matchValueDate ? formatDate(matchValueDate[1]) : null;

  const matchAccount = fields[6] && fields[6].match(/^Cuenta cargo\/abono\s+(.+)/) || '';
  const account = matchAccount ? matchAccount[1] : "";

  const matchAccountHolder = fields[7] && fields[7].match(/^Titular de la cuenta\s+(.+)/) || '';
  const accountHolder = matchAccountHolder ? matchAccountHolder[1] : "";

  const matchNotes = fields[8] && fields[8].match(/^Observaciones\s+(.+)/) || '';
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

const NewExpense = ({ onCreate = (params) => { } }) => {
  const [text, setText] = useState("");
  const [transaction, setTransaction] = useState<TransactionInfo>({})
  
  const handleChange = (e: any) => {
    setText(e.target.value);
  };

  useEffect(() => {
    const transaction = parseTransactionInfo(text)
    if (transaction) setTransaction(transaction)
  }, [text]);
  
  const formatTransaction = (transaction: TransactionInfo = {}) => {
    return {
        desc: transaction.description,
        amount: transaction.amount
    }
  }

  const fields = Object.keys(transaction)
  
  const containerStyles = {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: '20px',
    fontSize: '0.8rem'
  }
  const textAreaStyles = {
    border: "1px solid gray",
    height: "300px",
    width: "50%",
    fontSize: '0.8rem'
  }
  
  const resultPaneStyle = {
    paddingLeft: '20px'
  }

  return (
    <div style={containerStyles}>
      
        <textarea
          style={textAreaStyles}
          value={text}
          onChange={handleChange}
        ></textarea>
      
      <div style={resultPaneStyle}>
        {!!fields.length && <>{
          fields.map(field => {
          return <div key={field}>{field}: {transaction[field].toString()}</div>
          })
          
        }
          <button onClick={() => onCreate({body: formatTransaction(transaction)})}>Guardar</button>
        </>}
      </div>
    </div>
  );
};

export default NewExpense;
