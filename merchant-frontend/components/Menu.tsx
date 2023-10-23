import { Loader2, LogOut, Router } from "lucide-react";
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
  const labelHeading = (path: string) => {
    switch (path) {
      case "/":
        // code block
        return "ภาพรวม";

      case "orders":
        return "รายการคำสั่งซื้อ";
      // code block
      case "[orderId]":
        return router.query.orderId;
      case "categories":
        return "หมวดหมู่สินค้าภายในร้านค้า";
      case "[catId]":
        return router.query.catId;
      case "products":
        return "รายการสินค้า";
      case "[prodId]":
        return router.query.prodId;
      case "setting":
        return "ตั้งค่าบัญชีร้านค้า"
      case "subscription":
        return "สมัครเปิดร้านค้า"
      default:
        return path;
      // code block
    }
  };
  const [open, setOpen] = useState<string>("");
  const [canChange, setCanChange] = useState<boolean>(false);
  const pathName = router.pathname
    .substring(1)
    .toUpperCase()
    .replace("/", " > ");
  const { data, isLoading, isSuccess } = useUserInfo();
  const { data: merchantInfo } = useMerchantById(data?.mcht_id);

  const {
    mutate,
    isLoading: logoutLoading,
    isSuccess: logoutSuccess,
  } = useSignout();

  useEffect(() => {
    if (logoutSuccess) {
      router.push(`http://example.com/signin`);
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
      className="rounded-none sticky top-0 backdrop-blur-sm  border-b border-none  px-2 lg:px-6 flex justify-between mb-0 mt-5"
    >
      <div className="flex items-center space-x-2 ">
        <h1 className="font-bold">
          {/* {router.pathname === `/` ? `ภาพรวม` : pathName} */}
          {router.pathname === `/`
            ? `ภาพรวม`
            : router.pathname
              .substring(1)
              .split("/")
              .map((path) => labelHeading(path))
              .join(" > ")}
        </h1>
      </div>

      <div className="flex items-center space-x-2 justify-end flex-1">

        <div style={{ marginLeft: 'auto' }}>
          <MenubarMenu>
            <MenubarTrigger className="cursor-pointer">บัญชี</MenubarTrigger>
            <MenubarContent forceMount>
              <MenubarLabel inset>บัญชี</MenubarLabel>
              <MenubarSeparator />
              <MenubarRadioGroup value={`merchant`}>
                <MenubarRadioItem value={`merchant`}>
                  {merchantInfo?.name}
                </MenubarRadioItem>
              </MenubarRadioGroup>
              <MenubarSeparator />
              <MenubarItem onClick={() => mutate()} disabled={logoutLoading}>
                ออกจากระบบ
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </div>

      </div>
      <SelectTheme />

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
            <SheetTitle>Merchant Crypto Fashion</SheetTitle>
          </SheetHeader>
          <Sidebar className="bg-background" />
        </SheetContent>
      </Sheet>
    </Menubar>
  );
}
