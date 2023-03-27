// withDraggable.tsx
import React, { forwardRef } from "react";
import { useDrag, useDrop, DragPreviewImage } from "react-dnd";

const withDraggable = (WrappedComponent) => {
  return forwardRef((props, ref) => {
    const [{ isDragging }, drag, preview] = useDrag({
      type: "EXPENSE",
      item: { id: props.expense.id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: "EXPENSE",
      drop: (item) => props.handleDrop(item.id),
    });

    return (
  <WrappedComponent
    ref={instance => drag(drop(instance))}
    {...props}
    style={{
      ...props.style,
      opacity: isDragging ? 0.5 : 1,
    }}
  />
);

  });
};

export default withDraggable;
