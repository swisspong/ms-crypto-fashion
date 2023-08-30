import {

  Loader2,
  LogOut,

} from "lucide-react";
import { PlusCircle, MenuIcon } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Sidebar } from "./Sidebar";
import SelectTheme from "./SelectTheme";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSignout } from "@/src/hooks/auth/mutations";
import { useGetAdminInfo } from "@/src/hooks/auth/queries";

export function Menu() {
  const router = useRouter();
  const [open, setOpen] = useState<string>("");
  const [canChange, setCanChange] = useState<boolean>(false);
  const { mutate, isLoading, isSuccess } = useSignout();
  const { data, isLoading: infoLoading } = useGetAdminInfo();

  const pathParts = router.pathname.substring(1).split('/').filter(part => part !== '');
  const pathName = pathParts.map(part => part.toUpperCase() === '[ID]' ? router.query.id : part).join(' > ');

  useEffect(() => {
    if (!isLoading && canChange) {
      setCanChange((prev) => !prev);
      setOpen("");
    }
  }, [isLoading]);

  useEffect(() => {
    if (isSuccess) {
      setOpen("");
      router.push("/signin");
    }
  }, [isSuccess]);

  return (
    <Menubar
      onValueChange={(value) => {
        if (!canChange) {
          console.log("menubar change", value);
          setOpen(value);
        }
      }}
      value={open}
      className="rounded-none sticky top-0 backdrop-blur-sm bg-white/30 dark:bg-black/30 border-b border-none  px-2 lg:px-6 flex justify-between mb-0 mt-5"
    >
      <div className="flex items-center space-x-2 ">
        <h1 className="font-bold"><Link href={`/${pathParts[0] !== undefined ? pathParts[0] : ''}`}>{router.pathname === `/` ? `Dashboard` : pathName.toUpperCase()}</Link></h1>


      </div>

      <div className="flex items-center  space-x-2 ">
        <SelectTheme />
        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer">Account</MenubarTrigger>
          <MenubarContent forceMount>
            <MenubarLabel inset>Account</MenubarLabel>
            <MenubarSeparator />
            <MenubarRadioGroup value={data?.username}>
              <MenubarRadioItem disabled={isLoading} value={data?.username ?? ''}>
                {data?.username}
              </MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarItem
              className="cursor-pointer"
              onClick={() => {
                setCanChange((prev) => !prev);
                mutate();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4 mr-2" />
              )}
              Signout
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="block lg:hidden justify-self-end "
            size={"sm"}
            variant={"ghost"}
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          position={"left"}
          size="content"
          className="bg-background"
        >
          <SheetHeader>
            <SheetTitle>Admin Sms</SheetTitle>
          </SheetHeader>
          <Sidebar className="bg-background" />
        </SheetContent>
      </Sheet>
    </Menubar>
  );
}
