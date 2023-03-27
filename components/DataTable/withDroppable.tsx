// withDroppable.tsx
import React, { forwardRef } from "react";
import { useDrop } from "react-dnd";

const withDroppable = (WrappedComponent) => {
  return forwardRef((props, ref) => {
    const [, drop] = useDrop({
      accept: "EXPENSE",
      drop: (item) => props.handleDrop(item.id, props.categoryId, props.groupId),
    });

    return (
      <WrappedComponent ref={drop} {...props} />
    );
  });
};

export default withDroppable;
