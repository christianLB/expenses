import { Select } from "@chakra-ui/react";
import { useState } from "react";

const useSelect = ({
  options = [],
  placeHolder = "Select option",
  className = "",
  valueKey = "id",
  labelKey = "name",
  preventDefault = false,
  stopPropagation = false,
}) => {
  const [selected, setSelected] = useState();
  const SelectComponent = (
    <Select
      placeholder={placeHolder}
      size="xs"
      onChange={(e: any) => {
        setSelected(e.target.value);
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {options?.map((option) => {
        return (
          <option key={option.id} value={option[valueKey]}>
            {option[labelKey]}
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
