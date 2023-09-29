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
  Terminal,
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
import { withUser } from "@/src/hooks/user/auth/auth-hook";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { useUserInfo } from "@/src/hooks/user/queries";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RoleFormat } from "@/src/types/user";
import { useRouter } from "next/router";
import AlertOpentMerchant from "@/components/alert-open-merchant";
import AlertInfoMerchant from "@/components/alert-info-merchant";
import { usePaymentReport } from "@/src/hooks/payment/queries";
import { useMerchantOrders } from "@/src/hooks/order/queries";
import { WithdrawDialog } from "@/components/withdraw/withdraw-dialog";


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const paymentReportQuery = usePaymentReport();
  const dataQuery = useMerchantOrders({
    page: 1,
    per_page: 5,
  });
  return (
    <Layout>
      <AlertOpentMerchant />
      <Separator className="my-4" />

      <AlertInfoMerchant />

      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">แดชบอร์ด</h2>
        <div className="flex items-center space-x-2">
          {/* <CalendarDateRangePicker /> */}
          {/* <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button> */}
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
          {/* <TabsTrigger value="analytics" disabled>
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Notifications
          </TabsTrigger> */}
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                {/* <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle> */}
                <CardTitle className="text-sm font-medium">รายได้รวม</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {/* <div className="text-2xl font-bold">$45,231.89</div> */}
                <div className="text-2xl font-bold">
                  ฿
                  {paymentReportQuery.data?.data.find(
                    (item) => item._id === "deposit"
                  )?.totalAmount ?? 0}
                </div>
                {/* <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p> */}
                <p className="text-xs text-muted-foreground">
                  รายได้รวมทั้งหมดตั้งแต่เปิดร้าน
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                {/* <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle> */}
                <CardTitle className="text-sm font-medium">
                  จำนวนที่ถอนได้
                </CardTitle>
                <WithdrawDialog />
              </CardHeader>
              <CardContent>
                {/* <div className="text-2xl font-bold">$45,231.89</div> */}
                <div className="text-2xl font-bold">
                  ฿
                  {(paymentReportQuery.data?.data.find(
                    (item) => item._id === "deposit"
                  )?.totalAmount ?? 0) -
                    (paymentReportQuery.data?.data.find(
                      (item) => item._id === "withdraw"
                    )?.totalAmount ?? 0) -
                    50<=0?0:(paymentReportQuery.data?.data.find(
                      (item) => item._id === "deposit"
                    )?.totalAmount ?? 0) -
                      (paymentReportQuery.data?.data.find(
                        (item) => item._id === "withdraw"
                      )?.totalAmount ?? 0) -
                      50}
                </div>
                {/* <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p> */}
                <p className="text-xs text-muted-foreground">
                  จำนวนที่ถอนได้ทั้งหมด
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                {/* <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle> */}
                <CardTitle className="text-sm font-medium">ยอดการถอน</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {/* <div className="text-2xl font-bold">$45,231.89</div> */}
                <div className="text-2xl font-bold">
                  ฿
                  {paymentReportQuery.data?.data.find(
                    (item) => item._id === "withdraw"
                  )?.totalAmount ?? 0}
                </div>
                {/* <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p> */}
                <p className="text-xs text-muted-foreground">
                  จำนวนที่ถอนไปแล้วทั้งหมดตั้งแต่เปิดร้าน
                </p>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscriptions
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card> */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ยอดขาย</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{dataQuery.data?.total}
                </div>
                <p className="text-xs text-muted-foreground">
                  {/* +19% from last month */}
                  จำนวนยอดขายทั้งหมด
                </p>
              </CardContent>
            </Card>
            {/* <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Now
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last hour
                </p>
              </CardContent>
            </Card> */}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>ภาพรวม</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>
                  ยอดขายล่าสุด
                  {/* Recent Sales */}
                </CardTitle>
                <CardDescription>
                  คุณทำยอดขายได้ {dataQuery.data?.total} ครั้ง
                  {/* You made sales this month. */}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}

export const getServerSideProps = withUser();
