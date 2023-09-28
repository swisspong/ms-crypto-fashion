
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "./ui/input";

interface FilterProps {
  search: string | undefined;
  setSerarch: Dispatch<SetStateAction<string | undefined>>;
}

const FilterSearchState: React.FC<FilterProps> = ({
  search,
  setSerarch,
}) => {

  return (
    <>
      <div>
        <Input
          placeholder="กรอกสิ่งที่ต้องการค้นหา"
          onChange={(e) => setSerarch(e.target.value)}
        />
      </div>
     
    </>
  );
};

export default FilterSearchState;
