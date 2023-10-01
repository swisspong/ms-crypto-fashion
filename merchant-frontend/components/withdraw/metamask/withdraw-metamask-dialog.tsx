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
import { useState } from "react";

import {
  Banknote,
  BanknoteIcon,
  BellIcon,
  CreditCard,
  User2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import WithdrawMetamaskForm from "./withdraw-metamask-form";

export function WithdrawMetamaskDialog() {
  const paymentReportQuery = usePaymentReport();

  const [open, setOpen] = useState(false);
  return (
    <Dialog onOpenChange={(val) => setOpen(val)} open={open}>
      <DialogTrigger asChild>
        <Button
          size={"sm"}
          disabled={
            !paymentReportQuery.data?.data ||
            paymentReportQuery.data?.data.amountWalletCanWithdraw <= 0
          }
        >
          ถอน
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <>
          <DialogHeader>
            <DialogTitle>ถอนเงินออกจากระบบ</DialogTitle>
            <DialogDescription>
              ถอนเงินได้ไม่เกิน{" "}
              {paymentReportQuery.data?.data.amountEthCanWithdraw} ETH
            </DialogDescription>
          </DialogHeader>
          <Card>
            <CardContent className="pt-6 grid gap-1">
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-1 transition-all hover:bg-accent hover:text-accent-foreground">
                <User2 className="mt-px h-5 w-5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    จำนวนที่จะถอน
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ETH {paymentReportQuery.data?.data.amountEthCanWithdraw}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ฿ {paymentReportQuery.data?.data.amountWalletCanWithdraw}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <WithdrawMetamaskForm setOpen={setOpen} />
        </>
      </DialogContent>
    </Dialog>
  );
}
