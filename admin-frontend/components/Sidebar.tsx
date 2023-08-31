import {
    LayoutGrid,
    ListOrdered,
    Lock,
    LucideIcon,
    ShieldAlert,
    FileText,
    User2,
    FileCheck2,
    ShoppingBag,
    PackageSearch
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
  
  export const sidebarItems: SidebarProp = [
    {
      name: "Dashboard",
      href: `/`,
      icon: LayoutGrid,
    },{
      name: "Admin",
      href: "/admins",
      icon: Lock
    },{
      name: "Complaint",
      href: "/complaints",
      icon: FileText
    },
    {
      name: "Comment",
      href: `/comments`,
      icon: User2,
    },
    {
      name: "Products",
      href: `/products`,
      icon: ListOrdered,
    },
    {
      name: "Category",
      href: "/categories",
      icon: PackageSearch
    },
    {
      name: "Approves",
      href: `/approves`,
      icon: FileCheck2
    },
    {
      name: "Merchants",
      href: `/merchants`,
      icon: ShoppingBag
    }
  ];
  
  export function Sidebar({ className }: SidebarProps) {
    const router = useRouter();
    return (
      <div className={cn("pb-12", className)}>
  
        <div className="space-y-4 py-4">
          <div className="px-0 text-center md:px-4  py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Admin Crypto Fashion
            </h2>
            <div className="space-y-1">
              {sidebarItems.map(({ icon: Icon, name, href }) => {
                return (
                  <Link key={name} href={href ? href : `/`} passHref>
                    <Button
                      variant={router.pathname === href ? "secondary" : router.pathname.match(`^${href}`) && href !== '/'? "secondary":"ghost"}
                      size="lg"
                      className="w-full justify-start"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {name}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
  