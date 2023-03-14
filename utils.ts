export function parseTransactionInfo(text: string): any | null {
  const fields = text.split("||").map((line) => line.trim());

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

export const parseTransactionList = (text: string) => {
  const list = text.split("||");

  return list.map((transaction) => {
    const fields = transaction.trim().split(" ");
    const currency = fields.pop();
    const balance = fields.pop();
    const amount = fields.pop();
    const date = fields.shift();
    const valueDate = fields.shift();
    const name = fields.join(" ");

    return {
      //type: type,
      name,
      amount, //: Math.abs(Number(amount)),
      currency,
      date: date,
      valueDate,
      balance,
      //account: account,
      //Account_holder: accountHolder,
      //notes: notes,
    };
  });
};

export const formatDate = (date: string) => {
  //const dateString = '20/02/2023';
  const [day, month, year] = date.split("/");
  const dateObject = new Date(`${year}-${month}-${day}`);
  return dateObject;
};

interface Transaction {
  transactionDate: Date;
  valueDate: Date;
  description: string;
  amount: number;
  balance: number;
}

export function extractTransactions(feed: string): Transaction[] {
  const transactionRegExp =
    /(\d{2}\/\d{2}) (\d{2}\/\d{2}) (.+?) (-?\d+(?:,\d+)?) (-?\d+(?:\.\d{3},\d{2})?) EUR/g;
  const transactions: Transaction[] = [];
  let match;
  while ((match = transactionRegExp.exec(feed))) {
    const [_, transactionDate, valueDate, description, amount, balance] = match;
    transactions.push({
      transactionDate,
      valueDate,
      description,
      amount: parseFloat(amount.replace(",", ".")),
      balance: parseFloat(balance.replace(".", "").replace(",", ".")),
    });
  }
  return transactions;
}
