import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { IFixedExpense } from "./FixedExpenseForm";
import { log } from "console";

type IExpenseType = "CREDIT_CARD" | "FIXED_EXPENSE";

interface IExpense {
  id: string;
  amount: string;
  date: Date;
  name: string;
  description: string;
  fixedExpense?: IFixedExpense;
}

const parseErrorResponse = (
  errorResponse: string
): { field: string; message: string }[] => {
  const valuePairRegex = /'([^']+)':\s+(.+)/;
  const valuePairs: { field: string; message: string }[] = [];
  errorResponse.split("\n").forEach((line) => {
    const valuePairMatch = valuePairRegex.exec(line);
    if (valuePairMatch) {
      valuePairs.push({
        field: valuePairMatch[1],
        message: valuePairMatch[2],
      });
    }
  });
  return valuePairs;
};

const ExpenseForm = ({ fixedExpenses }) => {
  const buttonStyles =
    "bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer";

  const formStyles = "flex flex-col space-y-4 border p-5 rounded";
  const inputContainerStyles = "flex flex-col space-y-2";
  const labelStyles = "text-sm font-medium";
  const inputStyles = "form-input rounded-md shadow-sm";
  const selectStyles = "form-select rounded-md shadow-sm";
  const textareaStyles = "form-textarea rounded-md shadow-sm";
  const containerStyles = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 b-1-gray";
  const headerStyles = "bg-white shadow-xs py-4 px-4 sm:px-6";
  const footerStyles = "bg-gray-100 py-4 px-4 sm:px-6";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch,
  } = useForm<IExpense>({
    defaultValues: {
      amount: "1000",
      date: new Date(),
      //paymentsRemaining: "0",
      name: "",
      description: "",
      //fixedExpenseId: {},
    },
  });
  const router = useRouter();

  const onSubmit = async (data: IExpense) => {
    //createExpense(data);
    const response = await fetch("./api/createExpense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        ...(data.fixedExpense
          ? { fixedExpense: { connect: { id: Number(data.fixedExpense) } } }
          : {}),
      }),
    });
    const result = await response.json();
    router.replace(router.asPath);
    console.log("sos tarado eh", result);

    // send the data to the API or save it to the database
  };
  return (
    <form className={formStyles} onSubmit={handleSubmit(onSubmit)}>
      <div className={inputContainerStyles}>
        <label htmlFor="amount" className={labelStyles}>
          Amount
        </label>
        <input
          id="amount"
          className={inputStyles}
          {...register("amount", { required: true })}
        />
      </div>
      {/* <div className={inputContainerStyles}>
        <label htmlFor="type" className={labelStyles}>
          Type
        </label>
        <select
          id="type"
          className={selectStyles}
          {...register("type", { required: true })}
        >
          <option value="CREDIT_CARD">Credit card</option>
          <option value="FIXED_EXPENSE">Fixed expense</option>
        </select>
      </div> */}

      <div className={inputContainerStyles}>
        <label htmlFor="type" className={labelStyles}>
          Fixed Category
        </label>
        <select
          id="fixedExpense"
          className={selectStyles}
          {...register("fixedExpense", { required: true })}
        >
          {fixedExpenses?.map((fixedExpense) => {
            return (
              <option key={fixedExpense.id} value={fixedExpense.id}>
                {fixedExpense.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className={inputContainerStyles}>
        <label htmlFor="date" className={labelStyles}>
          Date
        </label>
        <input
          id="date"
          type="date"
          className={inputStyles}
          {...register("date", { required: true })}
        />
      </div>
      {/* <div className={inputContainerStyles}>
        <label htmlFor="paymentsRemaining" className={labelStyles}>
          Payments remaining
        </label>
        <input
          id="paymentsRemaining"
          type="number"
          className={inputStyles}
          {...register("paymentsRemaining", { required: true })}
        />
      </div> */}
      {/* <div className={inputContainerStyles}>
        <label htmlFor="dueDate" className={labelStyles}>
          Due date
        </label>
        <input
          id="dueDate"
          type="date"
          className={inputStyles}
          {...register("dueDate", { required: true })}
        />
      </div> */}
      <div className={inputContainerStyles}>
        <label htmlFor="name" className={labelStyles}>
          Name
        </label>
        <input
          id="name"
          type="text"
          className={inputStyles}
          {...register("name", { required: true })}
        />
        <label htmlFor="description">Description</label>
        <input
          type="text"
          className={inputStyles}
          {...register("description", { required: true })}
        />
        {errors.description && "Description is required"}
      </div>
      <input type="submit" className={buttonStyles} value="Submit" />
    </form>
  );
};

export default ExpenseForm;
