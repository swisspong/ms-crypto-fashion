import { Loader2, LogOut } from "lucide-react";
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
import { useUserInfo } from "@/src/hooks/user/queries";
import { useSignout } from "@/src/hooks/user/auth/mutations";
import { useMerchantById } from "@/src/hooks/merchant/queries";

export function Menu() {
  const router = useRouter();
  const [open, setOpen] = useState<string>("");
  const [canChange, setCanChange] = useState<boolean>(false);
  const pathName = router.pathname
    .substring(1)
    .toUpperCase()
    .replace("/", " > ");
  const { data, isLoading, isSuccess } = useUserInfo();
  const {data: merchantInfo} = useMerchantById(data?.mcht_id)
  

  const {
    mutate,
    isLoading: logoutLoading,
    isSuccess: logoutSuccess,
  } = useSignout();

  useEffect(() => {

    if (logoutSuccess) {
      router.push(`${process.env.HOST_CUSTOMER}/signin`);
    }
  }, [logoutSuccess]);
  return (
    <Menubar
      onValueChange={(value) => {
        if (!canChange) {
          console.log("menubar change", value);
          setOpen(value);
        }
      }}
      value={open}
      //value="radix-:r3:"
      className="rounded-none sticky top-0 backdrop-blur-sm bg-white/30 dark:bg-black/30 border-b border-none  px-2 lg:px-6 flex justify-between mb-0 mt-5"
    >
      <div className="flex items-center space-x-2 ">
        <h1 className="font-bold">
          {router.pathname === `/` ? `Dashboard` : pathName}
        </h1>
      </div>

      <div className="flex items-center space-x-2 ">
        <SelectTheme />

        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer">Account</MenubarTrigger>
          <MenubarContent forceMount>
            <MenubarLabel inset>Account</MenubarLabel>
            <MenubarSeparator />
            <MenubarRadioGroup value={`merchant`}>
              <MenubarRadioItem value={`merchant`}>
                {merchantInfo?.name}
              </MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarItem onClick={() => mutate()} disabled={logoutLoading}>
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
