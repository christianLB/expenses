// withDroppable.tsx
import React, { forwardRef } from "react";
import { useDrop } from "react-dnd";

const withDroppable = (WrappedComponent) => {
  return forwardRef((props: any, ref) => {
    const [, drop] = useDrop({
      accept: "EXPENSE",
      drop: (item: any) =>
        props.handleDrop(item.id, props.categoryId, props.groupId),
    });

    return <WrappedComponent ref={drop} {...props} />;
  });
};
withDroppable.displayName = "withDroppable";

export default withDroppable;
