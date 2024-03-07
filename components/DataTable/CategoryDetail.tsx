// GroupRow.tsx
import React, { useContext, useRef, useState } from "react";
import { TableContext, TableContextProps } from "./DataTable";
import useSelect from "../../hooks/useSelect";
import { useExpensesContext } from "../../hooks/expensesContext";
import nextStyles from "../../styles/Expenses.module.css";
import {
  Button,
  Collapse,
  Editable,
  EditableInput,
  EditablePreview,
  Input,
  NumberInput,
  useEditableControls,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";

import ColorPicker from "react-best-gradient-color-picker";
import useExpandables from "../../hooks/useExpandables";
import {
  Group,
  Stack,
  Paper,
  Table,
  Text,
  rem,
  Checkbox,
  Modal,
  TextInput,
} from "@mantine/core";
import { IconPencil, IconTrash, IconChevronDown } from "@tabler/icons-react";
import ExpenseModal from "./ExpenseModal";

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

  const updatExpenseDetailHandler = (e: any, expenseId: string) => {
    updateExpenseHandler({
      id: expenseId,
      body: {
        notes: e.target.value,
      },
    });
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
  const [editingExpense, setEditingExpense] = useState(null);

  return (
    <Table.Tr p="0">
      <Table.Td
        colSpan={14}
        ref={contentRef}
        p="0"
        style={{
          filter: "brightness(110%)",
          backgroundColor: userColor,
          ...expandableProps.style,
        }}
      >
        <Collapse in={!isCollapsed}>
          <Paper
            style={{
              background: userColor,
              borderBottom: `1px solid rgba(255,255,255,0.3)`,
            }}
            p="xs"
          >
            <Group justify={"center"} align="center" flex={1}>
              <Text size={rem(14)}>{month}</Text>
            </Group>
            <Group justify={"space-between"} mb="xs" flex={1}>
              <Text size={rem(32)}>{category.name}</Text>
              <Text size={rem(32)}>
                {category?.totals[selectedMonth].toFixed(2)}
              </Text>
            </Group>

            {category?.groups?.map((group: GroupData) => {
              const groupExpensesIds = group.expenses.map((e) => e.id);
              // Filtrar los gastos según el mes seleccionado
              const monthExpenses = group.expenses.filter((expense) => {
                return new Date(expense.date).getMonth() === selectedMonth;
              });

              if (!monthExpenses.length) return null;
              const groupIsExpanded = expandedGroups.has(group.id);

              return (
                <Group
                  key={group.id}
                  bg={"gray.8"}
                  mb="xs"
                  p="xs"
                  opacity={0.5}
                >
                  <Group
                    w={"100%"}
                    onClick={() => toggleGroupExpansion(group.id)}
                  >
                    {groupIsExpanded ? (
                      <Checkbox
                        w={20}
                        h={20}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        checked={isAllSelected(groupExpensesIds)}
                        onChange={(e) => handleSelectAll(groupExpensesIds)}
                      />
                    ) : (
                      <IconChevronDown width={20} height={20} />
                    )}

                    {group.name}
                  </Group>
                  <Collapse in={groupIsExpanded} style={{ width: "100%" }}>
                    <Stack
                      w={"100%"}
                      pt={"xs"}
                      justify="space-between"
                      gap={"xs"}
                      style={{ borderTop: `1px solid rgba(255,255,255,0.3)` }}
                    >
                      <ExpenseModal
                        isOpen={!!editingExpense}
                        expenseData={editingExpense}
                        onClose={() => setEditingExpense(null)}
                        onSave={() => {}}
                      />
                      {monthExpenses.map((expense) => {
                        return (
                          <Group
                            w={"100%"}
                            justify="space-between"
                            key={group.id}
                          >
                            <Group gap="md">
                              <Group gap="xs" mr="xl">
                                <Checkbox
                                  w={20}
                                  h={20}
                                  checked={selectedExpenses.includes(
                                    expense.id
                                  )}
                                  onClick={() => {
                                    handleSelectExpense(expense.id);
                                  }}
                                />

                                <IconPencil
                                  width={20}
                                  height={20}
                                  cursor={"pointer"}
                                  onClick={() => {
                                    setEditingExpense(expense);
                                  }}
                                />
                                <IconTrash
                                  width={20}
                                  height={20}
                                  cursor={"pointer"}
                                />
                              </Group>
                              <Text w={100}>
                                {new Date(expense.date).toLocaleDateString(
                                  "default",
                                  { day: "2-digit", month: "short" }
                                )}
                              </Text>
                              <Text>{expense.name}</Text>
                            </Group>
                            <Group>
                              <Text>{expense.amount}</Text>
                            </Group>
                          </Group>
                        );
                      })}
                    </Stack>
                  </Collapse>
                </Group>
              );
            })}
            {/* <Paper bg={"transparent"} p="xs">
              {category?.groups?.map((group: GroupData) => {
                // Filtrar los gastos según el mes seleccionado
                const filteredExpenses = group.expenses.filter((expense) => {
                  return new Date(expense.date).getMonth() === selectedMonth;
                });

                const sortedExpenses = filteredExpenses.sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                );

                const groupExpensesIds = group.expenses.map((e) => e.id);

                const headerStyles =
                  "flex flex-row items-center mt-2 mb-1 bg-white opacity-30 text-black";

                return (
                  filteredExpenses.length > 0 && (
                    <div key={group.id} className={`font-semibold pb-2`}>
                      <div className={`${headerStyles}`}>
                        <input
                          checked={isAllSelected(groupExpensesIds)}
                          className="ml-2 cursor-pointer"
                          type="checkbox"
                          onChange={(e) => handleSelectAll(groupExpensesIds)}
                        />
                        <div
                          className={"flex flex-1 items-center"}
                          onClick={(e) => toggleGroupExpansion(group.id)}
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
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleApply();
                                    }}
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
                        onClick={() => {}}
                      >
                        {sortedExpenses.map((expense, index) => (
                          <div
                            key={expense.id}
                            className={`flex flex-col justify-between hover:bg-[rgba(255,255,255,0.2)] transition-all cursor-pointer mb-1 pr-1 ${
                              selectedExpenses.includes(expense.id)
                                ? "bg-[rgba(255,255,255,0.2)]"
                                : ""
                            }`}
                            onClick={() => {
                              toggleGroupExpansion(expense.id);
                              handleSelectExpense(expense.id);
                            }}
                          >
                            <div className={"flex"}>
                              <span className={"flex gap-5"}>
                                <span className={"pl-5"}>
                                  <span>
                                    {new Date(expense.date).toLocaleDateString(
                                      "default",
                                      { day: "2-digit", month: "short" }
                                    )}
                                  </span>
                                </span>
                                <span>{expense.name}</span>
                              </span>
                              <span className="self-end text-right flex-1">
                                {expense.amount}
                              </span>
                            </div>
                            <div
                              className={"text-black ml-5"}
                              {...getExpandableProps(
                                expense.id,
                                expandedGroups.has(expense.id)
                              )}
                            >
                              <textarea
                                defaultValue={expense.notes}
                                className={"p2 w-1/2"}
                                style={{ minHeight: "100px" }}
                                onBlur={(e) =>
                                  updatExpenseDetailHandler(e, expense.id)
                                }
                              ></textarea>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                );
              })}
            </Paper> */}
          </Paper>
        </Collapse>
      </Table.Td>
    </Table.Tr>
  );
};

export default CategoryDetail;
