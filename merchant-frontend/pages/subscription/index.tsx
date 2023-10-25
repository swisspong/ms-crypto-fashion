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

import { useUserInfo } from "@/src/hooks/user/queries";
import { MerchantFormat } from "@/src/types/enums/merchant";

import { useGetMerchantCredential } from "@/src/hooks/merchant/queries";
import OpenStoreDialog from "@/components/subscription/open-store/open-store-dialog";
import PaymentSubscriptionDialog from "@/components/subscription/payment-subscription/payment-subsciption-dialog";

const inter = Inter({ subsets: ["latin"] });

export default function Subscription() {
  // const dataQuery = useUserInfo();
  const dataQuery = useGetMerchantCredential();
  return (
    <Layout>
      <Separator className="my-4" />
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>สมัครเปิดร้านค้าทุกเดือนด้วยเงิน 300 บาท</CardTitle>
          <CardDescription>ขั้นตอนการเปิดร้านค้า</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-1">
          <div
            className={`-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all ${
              dataQuery.data?.status === MerchantFormat.CLOSED ||
              dataQuery.data?.status === MerchantFormat.DISAPPROVAL
                ? "bg-accent"
                : ""
            } hover:bg-accent hover:text-accent-foreground`}
          >
            {/* <Tally1 /> */}
            <Bell className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">ขั้นตอนที่ 1</p>
              <p className="text-sm text-muted-foreground">
                ขั้นตอนที่ 1: จัดการสินค้าของคุณ
              </p>
            </div>
            {dataQuery.data?.status === MerchantFormat.CLOSED ? (
              <Badge>ขั้นตอนปัจจุบัน</Badge>
            ) : dataQuery.data?.status === MerchantFormat.DISAPPROVAL ? (
              <Badge>ส่งข้อมูลรับรองตัวตนอีกครั้ง</Badge>
            ) : undefined}
          </div>
          <div className="-mx-2 flex items-start space-x-4 rounded-md  p-2 text-accent-foreground transition-all">
            <AtSign className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">ขั้นตอนที่ 2</p>
              <p className="text-sm text-muted-foreground">
                ขั้นตอนที่ 2: กดปุ่ม เปิดร้าน
              </p>
            </div>
          </div>
          <div
            className={`-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all ${
              dataQuery.data?.status === MerchantFormat.IN_PROGRESS
                ? "bg-accent"
                : ""
            } hover:bg-accent hover:text-accent-foreground`}
          >
            <BellOff className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">ขั้นตอนที่ 3</p>
              <p className="text-sm text-muted-foreground">
                ขั้นตอนที่ 3:
                รอให้ผู้ดูแลระบบตรวจสอบว่าร้านค้าของคุณเป็นร้านแฟชั่น
              </p>
            </div>
            {dataQuery.data?.status === MerchantFormat.IN_PROGRESS ? (
              <Badge>กำลังดำเนินการ</Badge>
            ) : undefined}
          </div>
          <div
            className={`-mx-2 flex items-start space-x-4 rounded-md p-2 ${
              dataQuery.data?.status === MerchantFormat.APPROVED ||
              dataQuery.data?.status === MerchantFormat.OPENED
                ? "bg-accent"
                : ""
            } transition-all hover:bg-accent hover:text-accent-foreground`}
          >
            <BellOff className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">ขั้นตอนที่ 4</p>
              <p className="text-sm text-muted-foreground">
                ขั้นตอนที่ 4: หากตรวจสอบสำเร็จ
                ปุ่มจะแสดงราคาและคุณสามารถคลิกปุ่มชำระค่าสมัครเปิดร้านเพื่อขายได้
              </p>
            </div>
            {dataQuery.data?.status === MerchantFormat.APPROVED ||
            dataQuery.data?.status === MerchantFormat.OPENED ? (
              <Badge>ขั้นตอนปัจจุบัน</Badge>
            ) : undefined}
          </div>
        </CardContent>
        <CardFooter>
          {dataQuery.data?.status === MerchantFormat.CLOSED ||
          dataQuery.data?.status === MerchantFormat.DISAPPROVAL ? (
            <OpenStoreDialog />
          ) : dataQuery.data?.status === MerchantFormat.APPROVED ? (
            <PaymentSubscriptionDialog />
          ) : undefined}
        </CardFooter>
      </Card>
    </Layout>
  );
}
