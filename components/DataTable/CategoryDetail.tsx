// GroupRow.tsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { TableContext, TableContextProps } from "./DataTable";

import useSelect from "../../hooks/useSelect";
import { useExpensesContext } from "../../hooks/expensesContext";
import nextStyles from "../../styles/Expenses.module.css";
import {
  Editable,
  EditableInput,
  EditablePreview,
  Input,
  useEditableControls,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";

import ColorPicker from "react-best-gradient-color-picker";
import useExpandables from "../../hooks/useExpandables";
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
    expensesCollection: {
      fetchAll: fetchExpenses,
      update: updateExpenseHandler,
    },
    groupsCollection: {
      fetchAll: fetchGroups,
      create: createGroupHandler,
      arrayData: groups,
      update: updateGroupHandler,
    },
    categoriesCollection: {
      create: createCategoryHandler,
      fetchAll: fetchCategories,
      update: updateCategoryHandler,
    },
  } = useExpensesContext();

  const contentRef = useRef(null);
  //const contentOberver: DOMRect = useResizeObserver(contentRef);
  const [userColor, setUserColor] = useState(category?.color);
  const isCollapsed = !collapsedKeys.has(category.id);
  const month = new Date(0, selectedMonth).toLocaleDateString("default", {
    month: "long",
  });

  const { selected: selectedCategory, SelectComponent: CategoriesSelect } =
    useSelect({ options: categories });
  const { selected: selectedGroup, SelectComponent: GroupsSelect } = useSelect({
    options: [{ id: 0, name: "Nuevo Grupo" }, ...groups],
  });

  const isAnySelected = (groupExpensesIds) => {
    return groupExpensesIds.some((id) => selectedExpenses.includes(id));
  };

  // Añade un estado para manejar qué grupos están expandidos
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const { getExpandableProps, toggleExpand } = useExpandables();

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
    const selectedGroupExpenses = category.groups.flatMap((group) =>
      group.expenses.filter((expense) => selectedExpenses.includes(expense.id))
    );

    let groupId = selectedGroup;
    let categoryId = selectedCategory;

    if (selectedGroup === "0") {
      const { doc: newGroup } = await createGroupHandler({
        body: {
          name: `${category.name}/Group ${groups.length + 1}`,
        },
      });
      groupId = newGroup.id;
    }

    if (selectedCategory === "0") {
      const { doc: newCategory } = await createCategoryHandler({
        body: {
          name: `Category ${categories.length + 1}`,
        },
      });
      categoryId = newCategory.id;
    }

    const updatePromises = selectedGroupExpenses.map((expense) => {
      return updateExpenseHandler({
        id: expense.id,
        body: {
          ...(categoryId ? { category: categoryId } : {}),
          group: groupId,
        },
      }).then(() => handleSelectExpense(expense.id));
    });

    await Promise.all(updatePromises);
    await fetchGroups();
    await fetchCategories();
    fetchExpenses();
  };

  const updateCategoryNameHandler = async (name) => {
    await updateCategoryHandler({
      id: category.id, // Asume que cada ítem tiene un id
      body: {
        name,
        color: userColor,
      },
    });
    await fetchExpenses();
    await fetchCategories();
  };

  const updateGroupNameHandler = async (group, name) => {
    await updateGroupHandler({
      id: group.id, // Asume que cada ítem tiene un id
      body: {
        name,
      },
    });
    await fetchExpenses();
    await fetchGroups();
  };

  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <div
        className={
          "transition-all duration-100 mt-5 overflow-hidden flex items-center gap-5"
        }
        style={{
          height: isEditing ? 150 : 0,
        }}
      >
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
          width={160}
          height={100}
        />
        <div className={"flex gap-2"}>
          <CheckIcon w={4} h={4} {...getSubmitButtonProps()} />
          <CloseIcon w={4} h={4} {...getCancelButtonProps()} />
        </div>
      </div>
    ) : (
      <>
        {category.id !== "0" && (
          <EditIcon w={6} h={6} className={"ml-2"} {...getEditButtonProps()} />
        )}
      </>
    );
  }

  const expandableProps = getExpandableProps(category.id, !isCollapsed);

  return (
    <div
      style={{
        filter: "brightness(110%)",
        backgroundColor: userColor,
        ...expandableProps.style,
      }}
    >
      <div className="w-full" ref={contentRef}>
        {/* Top Panel */}
        <div
          className="flex justify-between w-full p-4"
          style={{
            background: `linear-gradient(to right, ${userColor}, ${userColor}, white)`,
            borderBottom: `1px solid rgba(255,255,255,0.3)`,
          }}
        >
          <div>
            <h1 className="text-white text-3xl font-bold cursor-pointer flex gap-2 items-center">
              <Editable
                defaultValue={category.name}
                submitOnBlur={false}
                onSubmit={updateCategoryNameHandler}
                isPreviewFocusable={false}
              >
                <EditablePreview />
                <Input as={EditableInput} />
                <EditableControls />
              </Editable>
            </h1>
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
              "flex flex-row items-center mt-2 mb-1 bg-white opacity-30 text-black";

            return (
              filteredExpenses.length > 0 && (
                <div key={group.id} className={`font-semibold pb-2`}>
                  {/*group header*/}
                  <div className={`${headerStyles}`}>
                    <input
                      checked={isAllSelected(groupExpensesIds)}
                      className="ml-2 cursor-pointer"
                      type="checkbox"
                      onChange={(e) => handleSelectAll(groupExpensesIds)}
                    />
                    <div
                      className={"flex flex-1 items-center"}
                      onClick={() => toggleGroupExpansion(group.id)}
                    >
                      <span className={`flex w-1/4 text-xl pl-5`}>
                        <Editable
                          defaultValue={group.name}
                          submitOnBlur={true}
                          onSubmit={(name) =>
                            updateGroupNameHandler(group, name)
                          }
                        >
                          <EditablePreview />
                          <EditableInput />
                        </Editable>
                      </span>
                      <span className={`flex flex-1 gap-5 h-full`}>
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
                        className={`flex w-1/3 justify-end text-right pr-2 text-lg`}
                      >
                        {group.totals[selectedMonth].toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div
                    {...getExpandableProps(
                      group.id,
                      expandedGroups.has(group.id)
                    )}
                  >
                    {sortedExpenses.map((expense, index) => (
                      <div key={expense.id} className={nextStyles.gridRow}>
                        <span className={"pl-5"}>
                          <input
                            className={"mr-2 cursor-pointer"}
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
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
