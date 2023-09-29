import React, { FC, useState } from "react";
import { useFieldArray, Control } from "react-hook-form";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import ShortUniqueId from "short-unique-id";
interface Props {
  cb?: () => void;
  control: Control<
    {
      variants: {
        price: number;
        variant_selecteds: {
          vgrp_id: string;
          optn_id: string;
        }[];
        vrnt_id: string ;
        stock:number ;
      }[];
      groups: {
        options: {
          name: string;
          optn_id: string;
        }[];
        name: string;
        vgrp_id: string;
      }[];
    },
    any
  >;
  // control: Control<
  //   {
  //     groups: {
  //       options: {
  //         name: string;
  //       }[];
  //       group_name: string;
  //     }[];
  //   },
  //   any
  // >;
  index: number;
}
const InputEnter: FC<Props> = ({ cb, control, index }) => {
  const genId = (prefix: string) => {
    const uid = new ShortUniqueId();
    return `${prefix}_${uid.stamp(15)}`;
  };
  const [value, setValue] = useState<string | undefined>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: `groups.${index}.options`,
  });
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // 👇 Get input value
      // setUpdated(message);
      if (value && !fields.find((item) => item.name === value)) {
        append({ optn_id: genId("optn"), name: value });
        cb ? cb() : null;
        console.log(value);
        setValue("");
      }
    }
  };
  return (
    <>
      {fields.map((item, index) => (
        <Badge key={item.id} className="flex items-center justify-center">
          <p>{item.name}</p>
          <button className="ml-2">
            <X className="h-4 w-4" onClick={() => remove(index)} />
          </button>
        </Badge>
      ))}
      <input
        className="outline-none placeholder:text-muted-foreground bg-transparent text-sm"
        placeholder="ชื่อตัวเลือก (ต้องกรอก)"
        onKeyDown={handleKeyDown}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        // {...field}
      />
    </>
  );
};

export default InputEnter;
