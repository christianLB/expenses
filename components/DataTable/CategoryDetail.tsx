// GroupRow.tsx
import React, { useCallback, useContext, useEffect, useState } from "react";
import { TableContext, TableContextProps } from "./DataTable";

import ExpandablePanel from "../ExpandablePanel";
import useSelect from "../../hooks/useSelect";
import { useExpensesContext } from "../../hooks/expensesContext";
import nextStyles from "../../styles/Expenses.module.css";
import ColorPicker from "react-best-gradient-color-picker";
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
  const {
    updateExpenseHandler,
    fetchExpenses,
    groups,
    updateCategoryHandler,
    fetchCategories,
  } = useExpensesContext();
  const [userColor, setUserColor] = useState(category?.color);
  const [showPicker, togglePicker] = useState<boolean>(false);

  const isCollapsed = !collapsedKeys.has(category.id);
  const month = new Date(0, selectedMonth).toLocaleDateString("default", {
    month: "long",
  });

  const { selected: selectedCategory, SelectComponent: CategoriesSelect } =
    useSelect({ options: categories });
  const { selected: selectedGroup, SelectComponent: GroupsSelect } = useSelect({
    options: groups,
  });

  const isAnySelected = (groupExpensesIds) => {
    return groupExpensesIds.some((id) => selectedExpenses.includes(id));
  };

  // Añade un estado para manejar qué grupos están expandidos
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Función para manejar el click en el header del grupo
  const toggleGroupExpansion = (groupId: string) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (newExpandedGroups.has(groupId)) {
      newExpandedGroups.delete(groupId);
    } else {
      newExpandedGroups.add(groupId);
    }
    setExpandedGroups(newExpandedGroups);
  };

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

  const updateColorHandler = async () => {
    await updateCategoryHandler({
      id: category.id, // Asume que cada ítem tiene un id
      body: {
        color: userColor,
      },
    });
    //await fetchCategories();
  };

  useEffect(() => {
    if (!showPicker) {
      if (userColor !== category.color) updateColorHandler();
    }
  }, [showPicker, category.color]);

  return (
    <ExpandablePanel
      show={!isCollapsed}
      dependencies={[
        selectedMonth,
        category?.expenses?.length,
        category?.groups?.length,
      ]}
      defaultConfig={{
        backgroundColor: userColor,
        filter: "brightness(110%)",
      }}
    >
      <div className="w-full h-full">
        {/* Top Panel */}
        <div
          className="flex justify-between w-full p-4"
          style={{
            background: `linear-gradient(to right, ${userColor}, ${userColor}, white)`,
            borderBottom: `1px solid rgba(255,255,255,0.3)`,
          }}
        >
          <div>
            <h1
              className="text-white text-3xl font-bold cursor-pointer"
              onClick={() => togglePicker(!showPicker)}
            >
              {category.name}
            </h1>
            <ExpandablePanel show={showPicker}>
              <ColorPicker
                value={userColor}
                onChange={setUserColor}
                hideInputs
                hideOpacity
                //hideHue
                hidePresets
                hideEyeDrop
                hideAdvancedSliders
                hideColorGuide
                hideGradientControls
                hideColorTypeBtns
                hideControls
                hideInputType
                hideGradientType
                hideGradientAngle
                hideGradientStop
                width={100}
                height={100}
              />
            </ExpandablePanel>
          </div>
          <h2 className="text-white text-2xl">{month}</h2>

          <div>
            <h1 className="text-2xl font-bold text-right">
              {category?.totals &&
                category?.totals[selectedMonth] &&
                category?.totals[selectedMonth].toFixed(2)}
            </h1>
            {/* Future Chart Here */}
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="w-full p-4 text-white">
          {category?.groups?.map((group: GroupData) => {
            // Filtrar los gastos según el mes seleccionado
            const filteredExpenses = group.expenses.filter((expense) => {
              return new Date(expense.date).getMonth() === selectedMonth;
            });

            const sortedExpenses = filteredExpenses.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );

            const groupExpensesIds = group.expenses.map((e) => e.id);

            const headerStyles =
              "flex items-center mt-2 mb-1 bg-white opacity-30 text-black";

            return (
              filteredExpenses.length > 0 && (
                <div
                  key={group.id}
                  className={`${nextStyles.expensesblock} font-semibold`}
                >
                  {/*group header*/}
                  <div
                    className={`${nextStyles.gridRow} cusror-pointer`}
                    onClick={() => toggleGroupExpansion(group.id)} // Añade el evento aquí
                  >
                    <span className={`${headerStyles} text-xl pl-5`}>
                      <input
                        checked={isAllSelected(groupExpensesIds)}
                        className="mr-2"
                        type="checkbox"
                        onChange={() => handleSelectAll(groupExpensesIds)}
                      />
                      {group.name}
                    </span>
                    <span className={`${headerStyles} gap-5`}>
                      {isAnySelected(groupExpensesIds) && (
                        <>
                          <span>{CategoriesSelect}</span>
                          <span>{GroupsSelect}</span>
                          <span>
                            <button
                              className={`text-sm w-full border px-2`}
                              onClick={handleApply}
                            >
                              Apply
                            </button>
                          </span>
                        </>
                      )}
                    </span>
                    <span
                      className={`${headerStyles} justify-end text-right pr-2 text-lg`}
                    >
                      {group.totals[selectedMonth].toFixed(2)}
                    </span>
                  </div>
                  {/* <ExpandablePanel
                        show={expandedGroups.has(group.id)}
                        dependencies={[selectedMonth]}
                      > */}
                  {sortedExpenses.map((expense, index) => (
                    <div key={expense.id} className={nextStyles.gridRow}>
                      <span className={"pl-5"}>
                        <input
                          className={"mr-2"}
                          type="checkbox"
                          checked={selectedExpenses.includes(expense.id)}
                          onChange={() => handleSelectExpense(expense.id)}
                        />
                        <span>
                          {new Date(expense.date).toLocaleDateString(
                            "default",
                            { day: "2-digit", month: "short" }
                          )}
                        </span>
                      </span>
                      <span>{expense.name}</span>
                      <span className="text-right">{expense.amount}</span>
                    </div>
                  ))}
                  {/* </ExpandablePanel> */}
                </div>
              )
            );
          })}
        </div>
      </div>
    </ExpandablePanel>
  );
};

export default CategoryDetail;
