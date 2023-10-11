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
import { useEffect, useState } from "react";

import {
  Banknote,
  BanknoteIcon,
  BellIcon,
  CreditCard,
  Loader2,
  User2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import WithdrawMetamaskForm from "./withdraw-metamask-form";
import detectEthereumProvider from "@metamask/detect-provider";
import { useWithdrawEth } from "@/src/hooks/payment/mutations";
export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
  return balance;
};

export function WithdrawMetamaskDialog() {
  const paymentReportQuery = usePaymentReport();
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const initialState = { accounts: [], balance: "", chainId: "" };
  const [account, setAccount] = useState<string | null>(null);
  const [wallet, setWallet] = useState(initialState);
  const handleChangeAccount = async () => {
    try {
      // Request access to the user's accounts
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });

      // 'accounts' will be an array of the user's Ethereum addresses
      const selectedAccount = accounts[0];

      console.log("Selected Account:", selectedAccount);
      setAccount(selectedAccount);
    } catch (error) {
      console.error("Error requesting accounts:", error);
    }
  };
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      if (accounts.length > 0) {
        updateWallet(accounts);
      } else {
        setWallet(initialState);
      }
    };
    const refreshChain = (chainId: any) => {
      setWallet((wallet) => ({ ...wallet, chainId })); /* New */
    };
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      console.log(provider);
      setHasProvider(Boolean(provider)); // transform provider to true or false

      if (provider) {
        /* New */
        const accounts = await (window as any).ethereum.request(
          /* New */
          { method: "eth_accounts" } /* New */
        ); /* New */
        refreshAccounts(accounts); /* New */

        (window as any).ethereum.on(
          "accountsChanged",
          refreshAccounts
        ); /* New */
        (window as any).ethereum.on("chainChanged", refreshChain); /* New */
      }
    };
    getProvider();
    return () => {
      /* New */
      (window as any).ethereum?.removeListener(
        "accountsChanged",
        refreshAccounts
      );
      (window as any).ethereum?.removeListener(
        "chainChanged",
        refreshChain
      ); /* New */
    };
  }, []);
  const updateWallet = async (accounts: any) => {
    const balance = formatBalance(
      await (window as any).ethereum!.request({
        /* New */ method: "eth_getBalance" /* New */,
        params: [accounts[0], "latest"] /* New */,
      })
    ); /* New */
    const chainId = await (window as any).ethereum!.request({
      /* New */ method: "eth_chainId" /* New */,
    }); /* New */
    setWallet({ accounts, balance, chainId }); /* Updated */
  };

  const handleConnect = async () => {
    /* New */
    let accounts = await (window as any).ethereum.request({
      /* New */ method: "eth_requestAccounts" /* New */,
    }); /* New */
    updateWallet(accounts); /* New */
  };
  const withdraw = useWithdrawEth();
  useEffect(() => {
    if (withdraw.isSuccess) {
      setOpen(false);
    }
  }, [withdraw.isSuccess]);
  return (
    <Dialog
      onOpenChange={(val) => {
        if (!withdraw.isLoading) {
          setOpen(val);
        }
      }}
      open={open}
    >
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
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-1 transition-all hover:bg-accent hover:text-accent-foreground">
                <User2 className="mt-px h-5 w-5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">บัญชี</p>
                  <p className="text-sm text-muted-foreground">
                    {wallet.accounts[0]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {wallet.accounts[0] ? undefined : (
            <Button onClick={handleConnect}>เชื่อมต่อ</Button>
          )}
          <Button
            onClick={() => withdraw.mutate({ address: wallet.accounts[0] })}
            disabled={!wallet.accounts[0] || withdraw.isLoading}
          >
            {withdraw.isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : undefined}
            ถอน
          </Button>
          {/* <WithdrawMetamaskForm setOpen={setOpen} /> */}
        </>
      </DialogContent>
    </Dialog>
  );
}
