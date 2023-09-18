import React, { useEffect, useLayoutEffect, useState } from "react";
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

interface ISortableItem {
  [key: string]: any;
}

interface ISortableListProps {
  ItemComponent: React.FunctionComponent<any>;
  keyName?: string;
  items: ISortableItem[];
  onSort?: (sortableData: any) => void;
  [key: string]: any;
}

const SortableList = ({
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
    const Ids = items.map((item: any) => item[keyName]);
    const oldIndex = Ids.indexOf(active.id);
    const newIndex = Ids.indexOf(over.id);
    let updatedValues: any = arrayMove(items, oldIndex, newIndex);

    // If the items have an 'order' property, update it
    if (updatedValues.length > 0 && "order" in updatedValues[0]) {
      updatedValues = updatedValues.map((item: any, index: number) => ({
        ...item,
        order: index,
      }));
    }
    if (active.id !== over.id) {
      setItems(updatedValues);
      onSort(updatedValues);
    }
  };

  useLayoutEffect(() => {
    if (defaultItems?.length > 0) {
      setItems(defaultItems);
      return;
    }
  }, [defaultItems]);

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
