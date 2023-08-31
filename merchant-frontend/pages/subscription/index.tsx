import Image from "next/image";
import { Inter } from "next/font/google";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AtSign,
  Bell,
  BellOff,
  CreditCard,
  Download,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { Overview } from "@/components/overview";
import { RecentSales } from "@/components/recent-sales";
import { Badge } from "@/components/ui/badge";
import OpenStoreDialog from "@/components/subscription/open-store-dialog";
import { useUserInfo } from "@/src/hooks/user/queries";
import { MerchantFormat } from "@/src/types/enums/merchant";
import PaymentSubscriptionDialog from "@/components/subscription/payment-subsciption-dialog";

const inter = Inter({ subsets: ["latin"] });

export default function Subscription() {
  const dataQuery = useUserInfo();
  return (
    <Layout>
      <Separator className="my-4" />
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Subscription every month with 300 bath</CardTitle>
          <CardDescription>Step to open store.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-1">
          <div
            className={`-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all ${
              dataQuery.data?.merchant.status === MerchantFormat.CLOSED ||
              dataQuery.data?.merchant.status === MerchantFormat.DISAPPROVAL
                ? "bg-accent"
                : ""
            } hover:bg-accent hover:text-accent-foreground`}
          >
            {/* <Tally1 /> */}
            <Bell className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">First</p>
              <p className="text-sm text-muted-foreground">
                First step: Manage your product
              </p>
            </div>
            {dataQuery.data?.merchant.status === MerchantFormat.CLOSED ? (
              <Badge>You are here</Badge>
            ) : dataQuery.data?.merchant.status ===
              MerchantFormat.DISAPPROVAL ? (
              <Badge>Send Credential Again</Badge>
            ) : undefined}
          </div>
          <div className="-mx-2 flex items-start space-x-4 rounded-md  p-2 text-accent-foreground transition-all">
            <AtSign className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Second</p>
              <p className="text-sm text-muted-foreground">
                Second step: Click button open store.
              </p>
            </div>
          </div>
          <div
            className={`-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all ${
              dataQuery.data?.merchant.status === MerchantFormat.IN_PROGRESS
                ? "bg-accent"
                : ""
            } hover:bg-accent hover:text-accent-foreground`}
          >
            <BellOff className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Third</p>
              <p className="text-sm text-muted-foreground">
                Third step: Wait for admin validate your store is fashion store.
              </p>
            </div>
            {dataQuery.data?.merchant.status === MerchantFormat.IN_PROGRESS ? (
              <Badge>In progress</Badge>
            ) : undefined}
          </div>
          <div
            className={`-mx-2 flex items-start space-x-4 rounded-md p-2 ${
              dataQuery.data?.merchant.status === MerchantFormat.APPROVED ||
              dataQuery.data?.merchant.status === MerchantFormat.OPENED
                ? "bg-accent"
                : ""
            } transition-all hover:bg-accent hover:text-accent-foreground`}
          >
            <BellOff className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Fourth</p>
              <p className="text-sm text-muted-foreground">
                Fourth step: If validate success this button will show price and
                you can click this button to pay for sale.
              </p>
            </div>
            {dataQuery.data?.merchant.status === MerchantFormat.APPROVED ||
            dataQuery.data?.merchant.status === MerchantFormat.OPENED ? (
              <Badge>You are here</Badge>
            ) : undefined}
          </div>
        </CardContent>
        <CardFooter>
          {dataQuery.data?.merchant.status === MerchantFormat.CLOSED ||
          dataQuery.data?.merchant.status === MerchantFormat.DISAPPROVAL ? (
            <OpenStoreDialog />
          ) : dataQuery.data?.merchant.status === MerchantFormat.APPROVED ? (
            <PaymentSubscriptionDialog />
          ) : undefined}
        </CardFooter>
      </Card>
    </Layout>
  );
}
