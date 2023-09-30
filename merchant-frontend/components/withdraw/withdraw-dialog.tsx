import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetMerchantCredential } from "@/src/hooks/merchant/queries";
import { useGetRecipient, usePaymentReport } from "@/src/hooks/payment/queries";
import WithdrawForm from "./withdraw-form";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Banknote,
  BanknoteIcon,
  BellIcon,
  CreditCard,
  User2,
} from "lucide-react";
import RecipientForm from "./recipient-form";

export function WithdrawDialog() {
  const paymentReportQuery = usePaymentReport();
  const credentialQuery = useGetMerchantCredential();
  const recipientQuery = useGetRecipient(credentialQuery.data?.recp_id);
  const [open, setOpen] = useState(false);
  return (
    <Dialog onOpenChange={(val) => setOpen(val)} open={open}>
      <DialogTrigger asChild>
        <Button
          size={"sm"}
          disabled={
            !paymentReportQuery.data?.data ||
            paymentReportQuery.data?.data.amountCreditCanWithdraw <= 0
          }
        >
          ถอน
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {credentialQuery.data?.recp_id ? (
          <>
            <DialogHeader>
              <DialogTitle>ถอนเงินออกจากระบบ</DialogTitle>
              <DialogDescription>
                ถอนเงินได้ไม่เกิน{" "}
                {paymentReportQuery.data?.data.amountCreditCanWithdraw} บาท
              </DialogDescription>
            </DialogHeader>
            <Card>
              <CardContent className="pt-6 grid gap-1">
                <div className="-mx-2 flex items-start space-x-4 rounded-md p-1 transition-all hover:bg-accent hover:text-accent-foreground">
                  <BanknoteIcon className="mt-px h-5 w-5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">ธนาคาร</p>
                    <p className="text-sm text-muted-foreground">
                      {recipientQuery.data?.bank_account.brand}
                    </p>
                  </div>
                </div>
                <div className="-mx-2 flex items-start space-x-4 rounded-md p-1 transition-all hover:bg-accent hover:text-accent-foreground">
                  <CreditCard className="mt-px h-5 w-5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">เลขบัญชี</p>
                    <p className="text-sm text-muted-foreground">
                      {recipientQuery.data?.bank_account.account_number}
                    </p>
                  </div>
                </div>
                <div className="-mx-2 flex items-start space-x-4 rounded-md p-1 transition-all hover:bg-accent hover:text-accent-foreground">
                  <User2 className="mt-px h-5 w-5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">ชื่อ</p>
                    <p className="text-sm text-muted-foreground">
                      {recipientQuery.data?.bank_account.name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <WithdrawForm setOpen={setOpen} />
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>ถอนเงินออกจากระบบ</DialogTitle>
              <DialogDescription>ระบุบัญชีเพื่อรับเงิน</DialogDescription>
            </DialogHeader>
            <Card></Card>
            <RecipientForm />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
