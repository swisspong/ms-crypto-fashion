import React, { FC, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import configuration from "../../contracts/CryptoFashionTokenGoerli.json";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import detectEthereumProvider from "@metamask/detect-provider";
import { formatBalance, formatChainAsNum } from "@/lib/utils";
import Web3 from "web3";
import {
  getOrderWalletByCheckoutId,
  postOrderWallet,
} from "@/src/services/order.service";
import { useCheckoutOrdering } from "@/src/hooks/checkout/mutations";
import { useRouter } from "next/router";
import {
  useDeleteOrderWalletError,
  useSetTxHashOrder,
} from "@/src/hooks/order/mutations";
import BigNumber from "bignumber.js";
import { Banknote, User2 } from "lucide-react";
interface Props {
  data?: ICheckoutResponse;
  address: IAddress | undefined;
}
function later(delay: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}
const MetamaskPayment: FC<Props> = ({ address, data }) => {
  const router = useRouter();
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const initialState = { accounts: [], balance: "", chainId: "" };
  const [account, setAccount] = useState<string | null>(null);
  const [wallet, setWallet] = useState(initialState);
  const checkoutOrderMutate = useCheckoutOrdering();
  const orderDeleteMutate = useDeleteOrderWalletError();
  const setTxHashMutate = useSetTxHashOrder();
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
        const accounts = await window.ethereum.request(
          /* New */
          { method: "eth_accounts" } /* New */
        ); /* New */
        refreshAccounts(accounts); /* New */

        window.ethereum.on("accountsChanged", refreshAccounts); /* New */
        window.ethereum.on("chainChanged", refreshChain); /* New */
      }
    };
    getProvider();
    return () => {
      /* New */
      window.ethereum?.removeListener("accountsChanged", refreshAccounts);
      window.ethereum?.removeListener("chainChanged", refreshChain); /* New */
    };
  }, []);

  // useEffect(() => {
  //   const connect = async () => {
  //     const accounts = await web3.eth.requestAccounts();
  //     setAccount(accounts[0]);
  //   };
  //   connect();
  // }, []);
  const CONTRACT_ADDRESS = "0xb2720A94c56b403E02515Ed4512c0cF2831e3E2f";
  const CONTRACT_ABI = configuration;

  //const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
  const web3 = new Web3(
    Web3.givenProvider ||
      "https://goerli.infura.io/v3/b64de7c107a44261bb1b19536d7bed23"
  );
  const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  function convertToWei(price: number) {
    return "0x" + Number(price * 1e18).toString(16);
  }
  function convertToWeiHex(price: number) {
    return "0x" + price.toString(16);
  }
  function convertToWeiHex2(price: string): string {
    //const weiValue = web3.utils.toWei(price.toString(), "ether");
    const valueInWei = new BigNumber(price); // 1e19 in Wei
    return "0x" + valueInWei.toString(16);
    // return "0x" + BigInt(weiValue).toString(16);
  }
  function convertToWeiHex1(price: number | bigint): string {
    const web3 = new Web3();
    const weiValue = web3.utils.toWei(price.toString(), "ether");
    const hexString = BigInt(weiValue).toString(16);
    return "0x" + hexString;
  }
  function convertWeiToHexString(weiValue: string): string {
    return Web3.utils.toHex(weiValue);
  }
  function convertWeiToHexString1(weiValue: string): string {
    const weiNumber = new BigNumber(weiValue);
    return "0x" + weiNumber.toString(16);
  }
  const buyProduct = async () => {
    //console.log(convertToWei(1));
    if (data && address) {
      await checkoutOrderMutate.mutateAsync({
        chktId: router.query.chktId as string,
        body: {
          address: address.address,
          chkt_id: data.chkt_id,
          post_code: address.post_code,
          recipient: address.recipient,
          tel_number: address.tel_number,
          payment_method: "wallet",
        },
      });

      await later(2000);
      // const ordering = await postOrderWallet({
      //   address: address.address,
      //   chkt_id: data.chkt_id,
      //   post_code: address.post_code,
      //   recipient: address.recipient,
      //   tel_number: address.tel_number,
      //   payment_method: "wallet",
      // });
      const orderIds: string[] = [];
      const ordering = await getOrderWalletByCheckoutId(
        router.query.chktId as string
      );
      console.log("get order => ", ordering);
      const totalWei = ordering.data.totalWei;
      const amountInEther = web3.utils.fromWei(totalWei, "ether");
      //0x760ddc41af762c
      console.log(
        "check balance",
        wallet.balance,
        totalWei,
        amountInEther,
        convertWeiToHexString1(totalWei.toString()),
        convertWeiToHexString(totalWei.toString()),
        convertToWeiHex2("33219026662587372")
      );

      ordering.data.items.forEach((order) => {
        orderIds.push(order.id);
      });
      // const totalWei = ordering.data.reduce(
      //   (prev, acc) => prev + acc.wei.wei,
      //   0
      // );
      if (orderIds.length > 0) {
        // console.log(
        //   convertToWeiHex(totalWei),
        //   ordering.data.items.map((order) => [
        //     order.id,
        //     order.wei,
        //     ordering.data.userId,
        //     order.mchtId,
        //   ])
        // );
        try {
          // console.log(totalWei.toString(), "36462652051330800", "");
          // const str = "10000000000000000000";
          // const valueInWei = new BigNumber(str); // 1e19 in Wei
          // const valueHex = "0x" + valueInWei.toString(16);
          let result = await window.ethereum!.request({
            method: "eth_sendTransaction",
            params: [
              {
                from: wallet.accounts[0],
                to: CONTRACT_ADDRESS,
                chainId: wallet.chainId,
                data: (contract.methods as any)
                  .buyWithOrderArr(
                    //convertToWeiHex(totalWei),
                    // convertToWeiHex1(BigInt(totalWei / 1e18)),
                    //convertWeiToHexString(totalWei.toString()),
                    //convertWeiToHexString1(totalWei.toString()),
                    //totalWei.toString(),
                    convertToWeiHex2(totalWei.toString()),
                    // valueHex,
                    ordering.data.items.map((order) => [
                      order.id,
                      convertToWeiHex2(order.wei.toString()),
                      //valueHex,
                      ordering.data.userId,
                      order.mchtId,
                    ])
                  )
                  .encodeABI(),
                //value: convertWeiToHexString(totalWei.toString()),
                //value: convertWeiToHexString1(totalWei.toString()),
                //value: totalWei.toString(),
                value: convertToWeiHex2(totalWei.toString()),
                //value: convertWeiToHexString1(totalWei.toString()),
              },
            ],
          });
          console.log("============ success ==========");
          console.log(result);
          await setTxHashMutate.mutateAsync({ orderIds, txHash: result });
        } catch (error) {
          console.log("============ error ===========");
          console.log(error);
          console.log({ orderIds });
          await orderDeleteMutate.mutateAsync({ orderIds });
        }
        router.replace("/account/orders");
      }

      // console.log("result =>",result)
    }
    //   .then((result) => console.log(result));
    // await contract.methods
    //   .deposit()
    //   .send({
    //     from: wallet.accounts[0],
    //     value: Web3.utils.toWei("1", "ether"),
    //   })
    //   .then((bal) => console.log(bal));
    // const amount = 1000000000000;
    // const orderId = "2";
    // console.log(Web3.utils.toWei("50", "ether"));
    // await contract.methods
    //   .deposit()
    //   .send({
    //     from: wallet.accounts[0],
    //     value: Web3.utils.toWei("1", "ether"),
    //   })
    //   .then((bal) => console.log(bal));
    // await contract.methods
    //   .buy(Web3.utils.toWei("1", "ether"), "4")
    //   .send({ from: wallet.accounts[0] })
    //   .catch((err) => console.log(err));
  };
  const updateWallet = async (accounts: any) => {
    const balance = formatBalance(
      await window.ethereum!.request({
        /* New */ method: "eth_getBalance" /* New */,
        params: [accounts[0], "latest"] /* New */,
      })
    ); /* New */
    const chainId = await window.ethereum!.request({
      /* New */ method: "eth_chainId" /* New */,
    }); /* New */
    setWallet({ accounts, balance, chainId }); /* Updated */
  };

  const handleConnect = async () => {
    /* New */
    let accounts = await window.ethereum.request({
      /* New */ method: "eth_requestAccounts" /* New */,
    }); /* New */
    updateWallet(accounts); /* New */
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>
          Add a new payment method to your account.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">
        <RadioGroup
          defaultValue={"wallet"}
          value={"wallet"}
          className="grid grid-cols-3 gap-4"
        >
          <Label
            htmlFor="credit"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem
              value="credit"
              id="credit"
              className="sr-only"
              disabled={true}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="mb-3 h-6 w-6"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
            Card
          </Label>
          <Label
            htmlFor="wallet"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem
              value="wallet"
              id="wallet"
              className="sr-only"
              disabled={true}
            />
            <Icons.metamask className="mb-3 h-6 w-6" />
            Metamask
          </Label>
        </RadioGroup>
        {wallet.accounts.length > 0 && (
          <Card>
            <CardContent className="pt-6 grid gap-1">
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-1 transition-all hover:bg-accent hover:text-accent-foreground">
                <Banknote className="mt-px h-5 w-5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    จำนวน ETH ของคุณ
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ETH {wallet.balance}
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
        )}
      </CardContent>
      <CardFooter>
        {hasProvider && wallet.accounts.length > 0 ? (
          <Button className="w-full" type="button" onClick={buyProduct}>
            <Icons.metamask className="w-6 h-6 mr-2" />
            Pay
          </Button>
        ) : (
          <Button className="w-full" type="button" onClick={handleConnect}>
            <Icons.metamask className="w-6 h-6 mr-2" />
            Pay with metamask
          </Button>
        )}

        {wallet.accounts.length > 0 /* New */ && (
          <></>
          // <>
          //   <div>Wallet Accounts: {wallet.accounts[0]}</div>
          //   <div>Wallet Balance: {wallet.balance}</div>
          //   <div>Hex ChainId: {wallet.chainId}</div>
          //   <div>Numeric ChainId: {formatChainAsNum(wallet.chainId)}</div>
          // </>
        )}
      </CardFooter>
    </Card>
  );
};

export default MetamaskPayment;
