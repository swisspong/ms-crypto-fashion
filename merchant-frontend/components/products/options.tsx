import React, { FC, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Control } from "react-hook-form";
interface IProps {
  group?: {
    vrnt_id: string;
    name: string;
    options: {
      optn_id: string;
      name: string;
    }[];
  };
  groups?: {
    vrnt_id: string;
    name: string;
    options: {
      optn_id: string;
      name: string;
    }[];
  }[];
  variants: {
    variant: {
      vrnt_id: string;
      optn_id: string;
    }[];
    price: number;
    quantity?: number | undefined;
  }[];
  index: number;
  index2: number;
  control: Control<
    {
      variants: {
        variant: {
          vrnt_id: string;
          optn_id: string;
        }[];
        price: number;
      }[];
      //   price: number;
    },
    any
  >;
}
const Options: FC<IProps> = ({
  group,
  variants,
  index,
  index2,
  control,
  groups,
}) => {
  const [gr, setGr] = useState<
    | {
        vrnt_id: string;
        name: string;
        options: {
          optn_id: string;
          name: string;
        }[];
      }
    | undefined
  >(group);
  useEffect(() => {
    setGr(group);
  }, []);
  useEffect(() => {
    console.log(gr);
  }, [gr]);

  return (
    <FormField
      control={control}
      name={`variants.${index}.variant.${index2}.optn_id`}
      render={({ field }) => (
        <FormItem>
          <Select
            onOpenChange={() => {
              console.log("open");

              const currVariant = variants[index];

              const variantNotSelected: {
                optn_id: string;
                vrnt_id: string;
              }[] = [];
              currVariant.variant.forEach(({ optn_id, vrnt_id }) => {
                if (optn_id.trim().length > 0) {
                  //countOfSelected++;
                } else {
                  variantNotSelected.push({ optn_id, vrnt_id });
                }
              });

              const currSelectVariant = currVariant.variant.filter(
                ({ optn_id, vrnt_id }) => {
                  if (optn_id.trim().length > 0) {
                    //countOfSelected++;
                    return true;
                  } else {
                    return false;
                    //variantNotSelected.push({ optn_id, vrnt_id });
                  }
                }
              );
              const cantShowList: string[] = [];
              console.log(variantNotSelected);
              if (variantNotSelected.length === 1) {
                const compoleteVariant = variants.filter(({ variant }) => {
                  const selectedList = variant.filter(
                    (item) => item.optn_id.trim().length > 0
                  );
                  if (selectedList.length === variant.length) {
                    return true;
                  } else {
                    return false;
                  }
                });
                //find complete variant

                compoleteVariant.forEach((cvrnt) => {
                  const found = cvrnt.variant.find(
                    (vrnt) =>
                      vrnt.vrnt_id === variantNotSelected[0].vrnt_id &&
                      currSelectVariant.every((currSVrnt) =>
                        cvrnt.variant.find(
                          (c) =>
                            c.optn_id === currSVrnt.optn_id &&
                            c.vrnt_id &&
                            currSVrnt.vrnt_id
                        )
                      )
                  );
                  console.log(found);
                  if (found) {
                    cantShowList.push(found.optn_id);
                  }
                });
              } else if (variantNotSelected.length <= 0) {
                //when all complete
                //click open on complete variant
                console.log("when all complete");
                const compoleteVariant = variants.filter(
                  ({ variant }, index2) => {
                    const selectedList = variant.filter(
                      (item) => item.optn_id.trim().length > 0
                    );
                    if (index === index2) {
                      return false;
                    } else if (selectedList.length === variant.length) {
                      return true;
                    } else {
                      return false;
                    }
                  }
                );

                compoleteVariant.forEach((cvrnt) => {
                  const found = cvrnt.variant.find(
                    (vrnt) =>
                      vrnt.vrnt_id === group?.vrnt_id &&
                      currSelectVariant.every((currSVrnt) =>
                        cvrnt.variant.find(
                          (c) =>
                            c.optn_id === currSVrnt.optn_id &&
                            c.vrnt_id &&
                            currSVrnt.vrnt_id
                        )
                      )
                  );
                  if (found) {
                    cantShowList.push(found.optn_id);
                  }
                });
              }

              //count section
              const currSelected = currVariant.variant.find(
                ({ vrnt_id }) => vrnt_id === group?.vrnt_id
              );
              let maxCount = 0;

              if (currSelected) {
                console.log("curr se");
                groups
                  ?.filter((gr) => gr.vrnt_id !== group?.vrnt_id)
                  .forEach((gr, index) => {
                    if (index <= 0) {
                      maxCount = maxCount + gr.options.length;
                    } else {
                      maxCount = maxCount * gr.options.length;
                    }
                  });

                if (currSelected.optn_id.trim().length > 0) {
                  console.log("test");
                  const isFullOptns: { optn_id: string; count: number }[] = [];

                  variants.forEach((vr) => {
                    vr.variant.forEach(({ optn_id, vrnt_id }) => {
                      if (
                        vrnt_id === currSelected.vrnt_id &&
                        optn_id.trim().length > 0
                      ) {
                        const foundIndex = isFullOptns.findIndex(
                          (isFull) => isFull.optn_id === optn_id
                        );
                        if (foundIndex < 0) {
                          isFullOptns.push({
                            count: 1,
                            optn_id: optn_id,
                          });
                        } else {
                          isFullOptns[foundIndex].count =
                            isFullOptns[foundIndex].count + 1;
                        }
                      }
                    });
                  });

                  if (isFullOptns.length > 0) {
                    isFullOptns.forEach((isFull) => {
                      if (
                        isFull.count === maxCount &&
                        currSelected.optn_id !== isFull.optn_id
                      ) {
                        cantShowList.push(isFull.optn_id);
                      }
                    });
                  }
                } else {
                  console.log("0--", maxCount);
                  const isFullOptns: { optn_id: string; count: number }[] = [];

                  variants.forEach((vr) => {
                    vr.variant.forEach(({ optn_id, vrnt_id }) => {
                      if (
                        vrnt_id === currSelected.vrnt_id &&
                        optn_id.trim().length > 0
                      ) {
                        const foundIndex = isFullOptns.findIndex(
                          (isFull) => isFull.optn_id === optn_id
                        );
                        if (foundIndex < 0) {
                          isFullOptns.push({
                            count: 1,
                            optn_id: optn_id,
                          });
                        } else {
                          isFullOptns[foundIndex].count =
                            isFullOptns[foundIndex].count + 1;
                        }
                      }
                    });
                  });

                  if (isFullOptns.length > 0) {
                    isFullOptns.forEach((isFull) => {
                      if (isFull.count === maxCount) {
                        cantShowList.push(isFull.optn_id);
                      }
                    });
                  }

                  console.log(isFullOptns);
                }
              } else {
              }

              // console.log(cantShowList.includes(option.optn_id));
              console.log(cantShowList);
              if (cantShowList.length > 0) {
                if (group) {
                  setGr({
                    name: group.name,
                    vrnt_id: group.vrnt_id,
                    options: group.options.filter(
                      (option) => !cantShowList.includes(option.optn_id)
                    ),
                  });
                }
              } else {
                if (group) {
                  setGr({
                    name: group.name,
                    vrnt_id: group.vrnt_id,
                    options: group.options.filter(
                      (option) => !cantShowList.includes(option.optn_id)
                    ),
                  });
                }
              }
            }}
            onValueChange={(val) => {
              field.onChange(val);
            }}
            defaultValue={
              field.value.trim().length > 0 ? field.value : undefined
            }
            value={field.value.trim().length > 0 ? field.value : undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select a ${group?.name}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>
                  {`${group?.name.slice(0, 1).toUpperCase()}${group?.name.slice(
                    1
                  )}`}
                </SelectLabel>
                {gr?.options.map((option) => (
                  <SelectItem value={option.optn_id}>{`${option.name
                    .slice(0, 1)
                    .toUpperCase()}${option.name.slice(1)}`}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* <Options
          group={groups.find(
            (group) => group.vrnt_id === fieldItem.vrnt_id
          )}
          index={index}
          variants={variants}
        /> */}
          {/* <Select
          onOpenChange={() => {
            console.log("open");
          }}
          onValueChange={(val) => {
            field.onChange(val);
          }}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue
                placeholder={`Select a ${
                  groups.find(
                    (group) => group.vrnt_id === fieldItem.vrnt_id
                  )?.name
                }`}
              />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>
                {`${groups
                  .find((group) => group.vrnt_id === fieldItem.vrnt_id)
                  ?.name.slice(0, 1)
                  .toUpperCase()}${groups
                  .find((group) => group.vrnt_id === fieldItem.vrnt_id)
                  ?.name.slice(1)}`}
              </SelectLabel>
              {
                <Options
                  group={groups.find(
                    (group) => group.vrnt_id === fieldItem.vrnt_id
                  )}
                  index={index}
                  variants={variants}
                />
              }

              {groups
                .find((group) => group.vrnt_id === fieldItem.vrnt_id)
                ?.options.filter((option) => {
                  //find max count of select
         

                  const currVariant = variants[index];
             
                  const variantNotSelected: {
                    optn_id: string;
                    vrnt_id: string;
                  }[] = [];
                  currVariant.variant.forEach(
                    ({ optn_id, vrnt_id }) => {
                      if (optn_id.trim().length > 0) {
                        //countOfSelected++;
                      } else {
                        variantNotSelected.push({ optn_id, vrnt_id });
                      }
                    }
                  );
                  const cantShowList: string[] = [];
                  if (variantNotSelected.length === 1) {
                    //find complete variant
                    const compoleteVariant = variants.filter(
                      ({ variant }) => {
                        const selectedList = variant.filter(
                          (item) => item.optn_id.trim().length > 0
                        );
                        if (selectedList.length === variant.length) {
                          return true;
                        } else {
                          return false;
                        }
                      }
                    );
                   
                    compoleteVariant.forEach((cvrnt) => {
                      const found = cvrnt.variant.find(
                        (vrnt) =>
                          vrnt.vrnt_id === variantNotSelected[0].vrnt_id
                      );
                      if (found) {
                        cantShowList.push(found.optn_id);
                      }
                    });
                  }

                  console.log(cantShowList.includes(option.optn_id));
                  console.log(cantShowList);
                  console.log(option);
                  return !cantShowList.includes(option.optn_id);
       
                })
                .map((option) => (
                  <SelectItem value={option.optn_id}>{`${option.name
                    .slice(0, 1)
                    .toUpperCase()}${option.name.slice(
                    1
                  )}`}</SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select> */}

          <FormMessage />
        </FormItem>
      )}
    />
    // <Select
    //   onOpenChange={() => {
    //     console.log("open");
    //     setGr({
    //       name: "test",
    //       vrnt_id: "fsds",
    //       options: [{ name: "ggg", optn_id: "name" }],
    //     });
    //   }}
    //   onValueChange={(val) => {
    //     //   field.onChange(val);
    //   }}
    // >
    //   <FormControl>
    //     <SelectTrigger>
    //       <SelectValue placeholder={`Select a ${group?.name}`} />
    //     </SelectTrigger>
    //   </FormControl>
    //   <SelectContent>
    //     <SelectGroup>
    //       <SelectLabel>
    //         {`${group?.name.slice(0, 1).toUpperCase()}${group?.name.slice(1)}`}
    //       </SelectLabel>
    //       {gr?.options.map((option) => (
    //         <SelectItem value={option.optn_id}>{`${option.name
    //           .slice(0, 1)
    //           .toUpperCase()}${option.name.slice(1)}`}</SelectItem>
    //       ))}
    //     </SelectGroup>
    //   </SelectContent>
    // </Select>
  );
};

export default Options;
