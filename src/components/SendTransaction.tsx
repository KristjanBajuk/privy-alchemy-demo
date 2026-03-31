import { useMemo, useCallback, useState } from "react";
import { zeroAddress } from "viem";
import { createSmartWalletClient, alchemyWalletTransport } from "@alchemy/wallet-apis";
import { sepolia } from "viem/chains";
import type { LocalAccount } from "viem";

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY ?? "";
const GAS_MANAGER_POLICY_ID = import.meta.env.VITE_GAS_MANAGER_POLICY_ID ?? "";

interface Props {
  signer: LocalAccount;
}

export default function SendTransaction({ signer }: Props) {
  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const client = useMemo(
    () =>
      createSmartWalletClient({
        signer,
        transport: alchemyWalletTransport({
          apiKey: ALCHEMY_API_KEY,
        }),
        chain: sepolia,
        paymaster: GAS_MANAGER_POLICY_ID
          ? { policyId: GAS_MANAGER_POLICY_ID }
          : undefined,
      }),
    [signer],
  );

  const handleSend = useCallback(async () => {
    setLoading(true);
    setError(null);
    setTxHash(null);
    try {
      const { id } = await client.sendCalls({
        calls: [{ to: zeroAddress, value: BigInt(0), data: "0x" }],
      });
      const result = await client.waitForCallsStatus({ id });
      const hash = result.receipts?.[0]?.transactionHash ?? null;
      setTxHash(hash);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [client]);

  return (
    <div className="card">
      <h2>Smart Wallet</h2>
      <p className="address">
        Signer: <code>{signer.address}</code>
      </p>
      <p className="chain">Chain: Sepolia (EIP-7702)</p>

      <button onClick={handleSend} disabled={loading}>
        {loading ? "Sending…" : "Send test transaction (0 ETH to zero address)"}
      </button>

      {txHash && (
        <p className="success">
          ✅ Tx hash:{" "}
          <a
            href={`https://sepolia.arbiscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
          >
            <code>{txHash.slice(0, 20)}…</code>
          </a>
        </p>
      )}

      {error && <p className="error">❌ {error}</p>}
    </div>
  );
}
