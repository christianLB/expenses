import { NativeSelect } from "@mantine/core";
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
    <NativeSelect
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
    </NativeSelect>
  );

  return {
    selected,
    SelectComponent,
  };
};

export default useSelect;
