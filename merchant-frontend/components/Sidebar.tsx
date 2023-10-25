import {
  LayoutGrid,
  LayoutTemplate,
  ListOrdered,
  Lock,
  LucideIcon,
  Phone,
  SatelliteDish,
  Settings,
  User,
  User2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import Link from "next/link";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}
type SidebarProp = {
  name: string;
  href?: string;
  icon: LucideIcon;
}[];
// const prefix = "";
export const sidebarItems: SidebarProp = [
  {
    name: "ภาพรวม",
    href: `/`,
    icon: LayoutGrid,
  },
  {
    name: "รายการคำสั่งซื้อ",
    href: `/orders`,
    icon: User2,
  },
  {
    name: "หมวดหมู่สินค้าภายในร้านค้า",
    href: `/categories`,
    icon: User2,
  },
  {
    name: "สินค้า",
    href: `/products`,
    icon: ListOrdered,
  },
  {
    name: "สมัครเปิดร้านค้า",
    href: `/subscription`,
    icon: ListOrdered,
  },
  {
    name: "ตั้งค่าบัญชีร้านค้า",
    href: `/setting`,
    icon: Settings,
  },
];

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter();
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-0 text-center md:px-4  py-2">
          <h2 className="hidden md:block mb-2 px-2 text-lg font-semibold tracking-tight">
            Merchant Crypto Fashion
          </h2>
          <div className="space-y-1">
            {sidebarItems.map(({ icon: Icon, name, href }) => {
              return (
                <Link key={name} href={href ? href : `/`} passHref>
                  <Button
                    variant={router.pathname === href ? "secondary" : "ghost"}
                    size="lg"
                    className="w-full justify-start"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {name}
                  </Button>
                </Link>
              );
            })}
            <Link
              href={`${process.env.NEXT_PUBLIC_HOST_CUSTOMER}/storefront`}
              passHref
              target="_blank"
            >
              <Button
                variant={"ghost"}
                size="lg"
                className="w-full justify-start"
              >
                <LayoutTemplate className="mr-2 h-4 w-4" />
                หน้าร้านค้า
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
