import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

type IExpenseCategory = "SERVICES" | "CREDIT";

export interface IFixedExpense {
  id: number;
  name: string;
  category: IExpenseCategory;
  description: string;
}

const ExpenseForm = () => {
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
    formState: { errors, isValid },
  } = useForm<IFixedExpense>({
    defaultValues: {
      name: "name",
      category: "SERVICES",
      description: "description",
    },
  });
  const router = useRouter();

  const onSubmit = async (data: IFixedExpense) => {
    //createExpense(data);
    const response = await fetch("./api/fixedExpense/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
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
        <label htmlFor="name" className={labelStyles}>
          Nombre
        </label>
        <input
          id="name"
          className={inputStyles}
          {...register("name", { required: true })}
        />
      </div>
      <div className={inputContainerStyles}>
        <label htmlFor="category" className={labelStyles}>
          Categoría
        </label>
        <select
          id="type"
          className={selectStyles}
          {...register("category", { required: true })}
        >
          <option value="SERVICES">Servicios</option>
          <option value="CREDIT">Crédito</option>
        </select>
      </div>

      <div className={inputContainerStyles}>
        <label htmlFor="description">Description</label>
        <textarea
          className={inputStyles}
          {...register("description", { required: true })}
        ></textarea>
        {errors.description && "Description is required"}
      </div>
      <input type="submit" className={buttonStyles} value="Submit" />
    </form>
  );
};

export default ExpenseForm;
