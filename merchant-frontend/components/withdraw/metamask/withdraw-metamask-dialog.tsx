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

          <WithdrawMetamaskForm setOpen={setOpen} />
          {/* <WithdrawForm setOpen={setOpen} /> */}
        </>
      </DialogContent>
    </Dialog>
  );
}
