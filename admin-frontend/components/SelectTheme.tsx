
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Laptop, Moon, MoreHorizontal, Sun } from "lucide-react";
import { useTheme } from "next-themes";
const SelectTheme = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>

          {theme === "light" ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="font-medium">
        <DropdownMenuItem
          onClick={() => {
            setTheme("light");
          }}
        >
          <Sun className="w-4 h-4 mr-2" />
          Light
        </DropdownMenuItem>

        {/* <DropdownMenuItem>View customer</DropdownMenuItem> */}
        {/* <DropdownMenuItem>View payment details</DropdownMenuItem> */}

        <DropdownMenuItem
          onClick={() => {
            setTheme("dark");
          }}
        >
          <Moon className="w-4 h-4 mr-2" />
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SelectTheme;
