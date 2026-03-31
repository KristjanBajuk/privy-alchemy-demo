import {toViemAccount, useWallets} from "@privy-io/react-auth";
import {useEffect, useState} from "react";
import type { LocalAccount } from "viem";

const usePrivySigner = () => {
  const { wallets } = useWallets();
  const wallet = wallets.find((w) => w.walletClientType === "privy");
  const [signer, setSigner] = useState<LocalAccount | undefined>(undefined);

  useEffect(() => {
    console.log("wallet", wallet);
    console.log("signer", signer);
    if (!wallet || signer) return;
    toViemAccount({ wallet }).then(setSigner);
  }, [wallet, signer]);

  return signer;
};

export default usePrivySigner;
