// GroupRow.tsx
import React, { useContext, useEffect, useRef } from "react";
import { TableContext, TableContextProps } from "./DataTable";
import { useSpring, animated } from "react-spring";
import tableStyles from "./tableStyles";
import ExpandablePanel from "../ExpandablePanel";
import useSelect from "../../hooks/useSelect";
import { useExpensesContext } from "../../hooks/expensesContext";

interface GroupData {
  id: string;
  name: string;
  totals: Array<number>;
  expenses: Array<any>; // Define a more specific interface for expenses if needed
}

interface GroupRowProps {
  group: GroupData;
  groupName: string;
  category: any;
}

const CategoryDetail = ({ category }) => {
  const {
    collapsedKeys,
    selectedMonth,
    selectedExpenses,
    handleSelectExpense,
    isAllSelected,
    handleSelectAll,
    categories,
  } = useContext<TableContextProps>(TableContext);
  const { updateExpenseHandler, fetchExpenses, groups } = useExpensesContext();

  const isCollapsed = !collapsedKeys.has(category.id);
  const month = new Date(0, selectedMonth).toLocaleDateString("default", {
    month: "long",
  });

  const { selected: selectedCategory, SelectComponent: CategoriesSelect } =
    useSelect({ options: categories });
  const { selected: selectedGroup, SelectComponent: GroupsSelect } = useSelect({
    options: groups,
  });

  const handleApply = async () => {
    // Tus gastos seleccionados
    const selectedGroupExpenses = category.groups.flatMap((group) =>
      group.expenses.filter((expense) => selectedExpenses.includes(expense.id))
    );

    // Actualizar cada gasto seleccionado
    for (const expense of selectedGroupExpenses) {
      await updateExpenseHandler({
        id: expense.id,
        body: {
          ...(selectedCategory ? { category: selectedCategory } : {}),
          ...(selectedGroup ? { group: selectedGroup } : {}),
        },
      });
      handleSelectExpense(expense.id);
    }
    fetchExpenses();
  };

  return (
    // <TableRow show={!isCollapsed} color={category.color}>
    <tr className={tableStyles.categoryRow}>
      <td colSpan={15} className={"p-0"}>
        <ExpandablePanel
          show={!isCollapsed}
          dependencies={[
            selectedMonth,
            category.expenses.length,
            category.groups.length,
          ]}
          defaultConfig={{
            backgroundColor: category.color,
            filter: "brightness(110%)",
          }}
        >
          <div className="w-full h-full">
            {/* Top Panel */}
            <div
              className="flex justify-between w-full p-4"
              style={{
                background: `linear-gradient(to right, ${category.color}, ${category.color}, white)`,
                borderBottom: `1px solid rgba(255,255,255,0.3)`,
              }}
            >
              <div>
                <h1 className="text-white text-3xl font-bold">
                  {category.name}
                </h1>
                <h2 className="text-white text-2xl"></h2>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Total de {month}</h1>
                <h1 className="text-2xl font-bold text-right">
                  {category.totals[selectedMonth].toFixed(2)}
                </h1>
                {/* Future Chart Here */}
              </div>
            </div>

            {/* Bottom Panel */}
            <div className="w-full p-4 text-white">
              {category.groups.map((group: GroupData) => {
                // Filtrar los gastos según el mes seleccionado
                const filteredExpenses = group.expenses.filter((expense) => {
                  return new Date(expense.date).getMonth() === selectedMonth;
                });

                const sortedExpenses = filteredExpenses.sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                );

                const groupExpensesIds = group.expenses.map((e) => e.id);

                return (
                  filteredExpenses.length > 0 && (
                    <div key={group.id} className="my-2">
                      {/*group header*/}
                      <div className="flex justify-between px-5 py-1 font-semibold bg-white opacity-30 text-black items-center">
                        <h3 className="flex text-xl flex-row items-center gap-2">
                          <input
                            checked={isAllSelected(groupExpensesIds)}
                            className="mr-2"
                            type="checkbox"
                            onChange={() => handleSelectAll(groupExpensesIds)}
                          />
                          {group.name}
                          <div className="flex flex-row gap-2">
                            <span>{CategoriesSelect}</span>
                            <span>{GroupsSelect}</span>
                            <span>
                              <button
                                //disabled={creatingExpense || deletingExpense}
                                className={`text-sm w-full border px-2`}
                                onClick={handleApply}
                              >
                                Apply
                              </button>
                            </span>
                          </div>
                        </h3>
                        <span>{group.totals[selectedMonth].toFixed(2)}</span>
                      </div>
                      <ul className="list-disc pl-5">
                        {sortedExpenses.map((expense, index) => (
                          <li
                            key={index}
                            className="p-1 flex justify-between font-semibold"
                          >
                            <input
                              className={"mr-2"}
                              type="checkbox"
                              checked={selectedExpenses.includes(expense.id)}
                              onChange={() => handleSelectExpense(expense.id)}
                            />
                            <span className="w-1/4">
                              {new Date(expense.date).toLocaleDateString(
                                "default",
                                { day: "2-digit", month: "short" }
                              )}
                            </span>
                            <span className="w-3/4 text-left">
                              {expense.name}
                            </span>
                            <span className="w-1/4 text-right">
                              {expense.amount}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        </ExpandablePanel>
      </td>
    </tr>
  );
};

export default CategoryDetail;
