import { Select } from "@chakra-ui/react";
import { useState } from "react";

const useSelect = ({ 
  options = []
}) => {
  const [selected, setSelected] = useState();
  
  const SelectComponent = (
    <Select
      placeholder="Select option"
      size="xs"
      onChange={(e: any) => setSelected(e.target.value)}
    >
      {options?.map(option => {
        return (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        );
      })}
    </Select>
  );
  
  return {
    selected,
    SelectComponent,
  };
};

export default useSelect;
