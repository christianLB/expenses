import React, { useLayoutEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
interface ISortableItemProps {
  ItemComponent: React.FunctionComponent<any>;
  id: string | number;
  index: number;
  [key: string]: any;
}
export interface OnSortReturn {
  sortedList: any[];
  affectedIndexes: { start: number; end: number };
  affectedItems: any[];
}
interface ISortableItem {
  [key: string]: any;
}

interface ISortableListProps {
  autoSort?: string;
  ItemComponent: React.FunctionComponent<any>;
  keyName?: string;
  items: ISortableItem[];
  onSort?: (
    sortableData: any,
    affectedIndexes?: { start: number; end: number }
  ) => void;
  onItemSort?: (item: any) => void;
  [key: string]: any;
}

const SortableItem = ({
  _id,
  index,
  ItemComponent,
  ...itemProps
}: ISortableItemProps) => {
  // It should render the ItemComponent and pass the item object as a prop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: _id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const sortableProps = {
    attributes,
    ref: setNodeRef,
    style,
  };

  return (
    <ItemComponent
      index={index}
      setNodeRef={setNodeRef}
      dragListeners={listeners}
      sortableProps={sortableProps}
      isDragging={isDragging}
      {...itemProps}
    />
  );
};

const SortableList = ({
  autoSort = "order",
  items: defaultItems = [],
  ItemComponent,
  keyName = "id",
  onSort = () => {},
  ...props
}: ISortableListProps) => {
  const [items, setItems] = useState<any>(defaultItems);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    const oldIndex = items.findIndex(
      (item: any) => item[keyName] === active.id
    );
    const newIndex = items.findIndex((item: any) => item[keyName] === over.id);

    let updatedValues: any = arrayMove(items, oldIndex, newIndex);

    const lowerIndex = Math.min(oldIndex, newIndex);
    const upperIndex = Math.max(oldIndex, newIndex);

    if (autoSort) {
      for (let i = lowerIndex; i <= upperIndex; i++) {
        updatedValues[i][autoSort] = i;
      }
    }

    if (active.id !== over.id) {
      setItems(updatedValues);

      const affectedIndexes: { start: number; end: number } = {
        start: lowerIndex,
        end: upperIndex,
      };
      const affectedItems = updatedValues.slice(lowerIndex, upperIndex + 1);
      const onSortReturn: OnSortReturn = {
        sortedList: updatedValues,
        affectedIndexes,
        affectedItems,
      };
      onSort(onSortReturn);
    }
  };

  useLayoutEffect(() => {
    if (defaultItems?.length > 0) {
      const sortedItems = [...defaultItems];
      if (autoSort) {
        sortedItems.sort((a, b) => (a[autoSort] < b[autoSort] ? -1 : 1));
      }
      setItems(sortedItems);
    }
  }, [defaultItems, autoSort]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item: any) => item[keyName])}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item: any, index: number) => (
          <SortableItem
            key={item[keyName]}
            _id={item[keyName]}
            index={index}
            ItemComponent={ItemComponent}
            {...item}
            {...props}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default SortableList;
