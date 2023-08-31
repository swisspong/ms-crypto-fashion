import { FC, useEffect } from "react";
import { Control, useFieldArray, useWatch } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SelectProps {
  control: Control<
    {
      groups: {
        options: {
          name: string;
          optn_id: string;
        }[];
        name: string;
        vgrp_id: string;
      }[];
      variants: {
        variant_selecteds: {
          vgrp_id: string;
          optn_id: string;
        }[];
        price: number;
        vrnt_id: string;
        stock: number;
      }[];
    },
    any
  >;
  variants: {
    variant_selecteds: {
      vgrp_id: string;
      optn_id: string;
    }[];
    price: number;
    quantity?: number | undefined;
  }[];
  groups: {
    options: {
      optn_id: string;
      name: string;
    }[];
    name: string;
    vgrp_id: string;
  }[];
  index: number;
}
const SelectListNew: FC<SelectProps> = ({
  control,
  index,
  variants,
  groups,
}) => {
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: `variants.${index}.variant_selecteds`,
  });
  //   const { fields: groupTest } = useFieldArray({
  //     control,
  //     name: "groups",
  //   });
  //   console.log(groups);
  //   console.log(groups
  //     .find((group) => group.vgrp_id === fieldItem.vrnt_id)
  //     ?.group_name)

  const groupTest = useWatch({
    control,
    name: "groups", // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
    //defaultValue: "default", // default value before the render
  });
  useEffect(() => {
    console.log("gggggggggggggggggg");
    console.log(groupTest);
  }, [groupTest]);
  return (
    <>
      {fields.map((fieldItem, index2) => (
        //   <Options
        //     group={groups.find((group) => group.vrnt_id === fieldItem.vrnt_id)}
        //     index={index}
        //     variants={variants}
        //     control={control}
        //     index2={index2}
        //     groups={groups}
        //   />
        // <p>tst</p>
        <FormField
          control={control}
          name={`variants.${index}.variant_selecteds.${index2}.optn_id`}
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                }}
                defaultValue={
                  field.value.trim().length > 0 ? field.value : undefined
                }
                value={
                  field.value.trim().length > 0 &&
                  groups
                    .find((group) => group.vgrp_id === fieldItem.vgrp_id)
                    ?.options.find((option) => option.optn_id === field.value)
                    ? field.value
                    : undefined
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={`Select a ${
                        // groups.find(
                        //   (group) => group.vgrp_id === fieldItem.vrnt_id
                        // )?.group_name
                        groupTest.find(
                          (group) => group.vgrp_id === fieldItem.vgrp_id
                        )?.name
                      }`}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {`${groups
                        .find((group) => group.vgrp_id === fieldItem.vgrp_id)
                        ?.name.slice(0, 1)
                        .toUpperCase()}${groups
                        .find((group) => group.vgrp_id === fieldItem.vgrp_id)
                        ?.name.slice(1)}`}
                    </SelectLabel>
                    {groups
                      .find((group) => group.vgrp_id === fieldItem.vgrp_id)
                      ?.options?.map((option) => (
                        <>
                          <SelectItem value={option.optn_id}>
                            {option.name}
                          </SelectItem>
                        </>
                      ))}
                    {/* {gr?.options.map((option) => (
                      <SelectItem value={option.optn_id}>{`${option.name
                        .slice(0, 1)
                        .toUpperCase()}${option.name.slice(1)}`}</SelectItem>
                    ))} */}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </>
  );
};

export default SelectListNew;
