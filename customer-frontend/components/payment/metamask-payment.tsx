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
      const ordering = await getOrderWalletByCheckoutId(
        router.query.chktId as string
      );
      console.log("get order => ", ordering);
      const totalWei = ordering.data.totalWei;
      console.log(
        convertToWeiHex(totalWei),
        ordering.data.items.map((order) => [
          order.id,
          order.wei,
          ordering.data.userId,
          order.mchtId,
        ])
      );
      // const totalWei = ordering.data.reduce(
      //   (prev, acc) => prev + acc.wei.wei,
      //   0
      // );
      try {
        let result = await window.ethereum!.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: wallet.accounts[0],
              to: CONTRACT_ADDRESS,
              chainId: wallet.chainId,
              data: (contract.methods as any)
                .buyWithOrderArr(
                  convertToWeiHex(totalWei),
                  ordering.data.items.map((order) => [
                    order.id,
                    order.wei,
                    ordering.data.userId,
                    order.mchtId,
                  ])
                )
                .encodeABI(),
              value: convertToWeiHex(totalWei),
            },
          ],
        });
        console.log("============ success ==========")
        console.log(result)
      } catch (error) {
        console.log("============ error ===========")
        console.log(error);
      }
      router.replace("/account/orders");

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
          <>
            <div>Wallet Accounts: {wallet.accounts[0]}</div>
            <div>Wallet Balance: {wallet.balance}</div> {/* New */}
            <div>Hex ChainId: {wallet.chainId}</div> {/* New */}
            <div>Numeric ChainId: {formatChainAsNum(wallet.chainId)}</div>{" "}
            {/* New */}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default MetamaskPayment;
