// DragDropContext.tsx
import { createContext, useContext } from "react";

interface DragDropContextData {
  children?: any;
  handleDrop: (itemId: string, categoryId?: string, groupId?: string) => void;
}

const DragDropContext = createContext<DragDropContextData>({
  handleDrop: () => {},
});

export const useDragDropContext = () => useContext(DragDropContext);

export const DragDropContextProvider: React.FC<DragDropContextData> = ({
  children,
  handleDrop,
}) => {
  return (
    <DragDropContext.Provider value={{ handleDrop }}>
      {children}
    </DragDropContext.Provider>
  );
};

export default DragDropContext;
