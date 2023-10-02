import React, { FC } from "react";
import useOptionsInputHook from "./use-optoins-input-hook";
import { Control } from "react-hook-form";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
interface Props {
  cb?: () => void;
  control: Control<
    {
      name: string;
      options: {
        name: string;
        optn_id: string;
      }[];
      vgrp_id: string;
    },
    any
  >;
  isEdit?: boolean;
}
const OptionsInput: FC<Props> = ({ control, isEdit }) => {
  const { fields, handleKeyDown, remove, setValueHandler, value } =
    useOptionsInputHook(control);
  return (
    <>
      {fields.map((item, index) => (
        <Badge key={item.id} className="flex items-center justify-center">
          <p>{item.name}</p>
          <button
            className="ml-2"
            onClick={() => remove(index)}
            disabled={isEdit !== undefined && !isEdit}
          >
            <X className="h-4 w-4" />
          </button>
        </Badge>
      ))}
      <input
        className="outline-none placeholder:text-muted-foreground bg-transparent text-sm"
        placeholder="ชื่อตัวเลือก (ต้องกรอก)"
        disabled={isEdit !== undefined && !isEdit}
        onKeyDown={handleKeyDown}
        onChange={(e) => setValueHandler(e.target.value)}
        value={value}
      />
    </>
  );
};

export default OptionsInput;
