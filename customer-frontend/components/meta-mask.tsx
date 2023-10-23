"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { Eip1193Provider, BrowserProvider, ethers } from "ethers";
import { formatBalance } from "@/lib/utils";
import detectEthereumProvider from "@metamask/detect-provider";
import { getNonce } from "@/src/services/auth.service";
import { useSigninMetamask } from "@/src/hooks/auth/mutations";
import { useRouter } from "next/router";
declare global {
  interface Window {
    ethereum: Eip1193Provider & BrowserProvider;
  }
}
const MetaMask = () => {
  let ethereum: Eip1193Provider & BrowserProvider;
  const initialState = { accounts: [], balance: "", chainId: "" };
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const [wallet, setWallet] = useState(initialState);
  const router = useRouter();
  const signinMetamask = useSigninMetamask();
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
      method: "eth_requestAccounts",
    });
    updateWallet(accounts);
  };

  const connectToWallet = async () => {
    if (typeof window !== "undefined") {
      ethereum = window.ethereum;
    }

    try {
      if (!ethereum) return alert("Please install metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
      const { nonce } = await getNonce();
      console.log(nonce);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      // Sign the message using the signer account and the nonce value
      const message = `I am signing this message to prove my identity. Nonce: ${nonce}`;
      const signedMessage = await signer.signMessage(message);
      const data = { signedMessage, message, address };
      signinMetamask.mutate(data);
    } catch (err) {}
  };
  React.useEffect(() => {
    if (signinMetamask.isSuccess) router.push("/");
  }, [signinMetamask.isSuccess]);
  return (
    <Button variant="outline" type="button" onClick={connectToWallet}>
      <Icons.metamask className="mr-2 h-4 w-4" />
      MetaMask
    </Button>
  );
};

export default MetaMask;
