import {toViemAccount, useCreateWallet, usePrivy, useWallets, WalletWithMetadata} from "@privy-io/react-auth";
import {useEffect, useRef, useState} from "react";
import type { LocalAccount } from "viem";

const usePrivySigner = () => {
  const { wallets } = useWallets();
  const wallet = wallets.find((w) => w.walletClientType === "privy");
  const [signer, setSigner] = useState<LocalAccount | undefined>(undefined);

  const { authenticated, user } = usePrivy();
  const { createWallet } = useCreateWallet();
  const creatingWallet = useRef(false);

  useEffect(() => {
    if (!authenticated || !user || wallet || creatingWallet.current) return;
    const hasEmbeddedWallet = user.linkedAccounts.some(
      (account): account is WalletWithMetadata =>
        account.type === 'wallet' && (account as WalletWithMetadata).walletClientType === 'privy'
    );
    if (!hasEmbeddedWallet) {
      creatingWallet.current = true;
      createWallet()
        .catch(console.error)
        .finally(() => {
          creatingWallet.current = false;
        });
    }
  }, [authenticated, user, wallet, createWallet]);

  useEffect(() => {
    if (!wallet || signer) return;
    toViemAccount({ wallet }).then(setSigner);
  }, [wallet, signer]);

  return signer;
};

export default usePrivySigner;
