import { useRef, useImperativeHandle, forwardRef } from "react";

type Selectprops = {
  id: string;
  options: { key: string; value: string }[];
  onChange?: (value: string) => void;
};

export type SelectHandle = {
  getCurrentSelectedValue: () => string | null;
};

const SelectComponent = forwardRef<SelectHandle, Selectprops>(
  ({ options, id, onChange }, ref) => {
    const selectRef = useRef<HTMLSelectElement>(null);

    useImperativeHandle(ref, () => ({
      getCurrentSelectedValue: () => {
        if (!selectRef.current) return null;
        return selectRef.current.value;
      },
    }));

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div>
        <select id={id} ref={selectRef} onChange={handleChange}>
          {options.map((option) => (
            <option key={option.key} value={option.value}>
              {option.value}
            </option>
          ))}
        </select>
      </div>
    );
  },
);

export default SelectComponent;
