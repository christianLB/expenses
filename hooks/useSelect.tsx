import { Select } from "@chakra-ui/react";
import { useState } from "react";

const useSelect = ({ options = [], placeHolder = "Select option", className }) => {
  const [selected, setSelected] = useState();
  const SelectComponent = (
    <Select
      placeholder={placeHolder}
      size="xs"
      onChange={(e: any) => setSelected(e.target.value)}
      className={className}
    >
      {options?.map((option) => {
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
