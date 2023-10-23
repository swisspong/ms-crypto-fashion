import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  CreditCard,
  Loader2,
  PlusCircle,
  Settings,
  Store,
  User,
} from "lucide-react";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUserInfo } from "@/src/hooks/user/queries";
import { useSignout } from "@/src/hooks/auth/mutations";
import { useRouter } from "next/router";
import { Skeleton } from "./ui/skeleton";
import { data } from "autoprefixer";
import Link from "next/link";

const UserNav = () => {
  const {
    data: me,
    isLoading: meLoading,
    isSuccess: meSuccess,
    isError,
  } = useUserInfo();
  const router = useRouter();
  const {
    mutate: signoutHandler,
    isLoading: siginoutLoading,
    isSuccess,
  } = useSignout();
  useEffect(() => {
    if (isSuccess) {
      router.push("/signin");
    }
  }, [isSuccess]);
  useEffect(() => {
    if (meSuccess) {
      if (!me) router.push("/signin");
    }
  }, [meSuccess]);
  if (meLoading) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }
  return (
    <>
      {isError && !me ? (
        <Link href={"/signin"}>
          <Button size={"sm"} variant={"outline"}>เข้าสู่ระบบ</Button>
        </Link>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/03.png" alt="@shadcn" />
                <AvatarFallback>
                  {me?.username
                    ? me.username
                        .split(" ")
                        .map((word) => word.substring(0, 1).toUpperCase())
                        .filter((word, index) => index <= 1)
                        .join("")
                    : me?.address.substring(0, 2) +
                      ".." +
                      me?.address.substring(
                        me.address.length - 2,
                        me.address.length
                      )}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {me?.username
                    ? me.username
                        .split(" ")
                        .map((word) => word.substring(0, 1).toUpperCase())
                        .filter((word, index) => index <= 1)
                        .join("")
                    : me?.address.substring(0, 3) +
                      "..." +
                      me?.address.substring(
                        me.address.length - 3,
                        me.address.length
                      )}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {me?.email ? me?.email : "no email"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/account")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>ตั้งค่า</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("http://merchant.example.com/")}
              >
                <Store className="mr-2 h-4 w-4" />
                <span>ร้านค้า</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={siginoutLoading}
              onClick={() => signoutHandler()}
            >
              {siginoutLoading ? (
                <Loader2 className="mr-2 h-4 w-4" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              <span>ออกจากระบบ</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default UserNav;
