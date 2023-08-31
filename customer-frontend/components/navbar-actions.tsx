"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import UserNav from "./user-nav";
import { useUserInfo } from "@/src/hooks/user/queries";

const NavbarActions = () => {
  const router = useRouter();
 
  return (
    <div className="ml-auto flex items-center gap-x-4">
      <Button
        onClick={() => router.push("/cart")}
        className="flex items-center rounded-full bg-black px-4 py-2"
      >
        <ShoppingBag size={20} color="white" />
        <span className="ml-2 text-sm font-medium text-white">{0}</span>
      </Button>
      <UserNav />
    </div>
  );
};

export default NavbarActions;
