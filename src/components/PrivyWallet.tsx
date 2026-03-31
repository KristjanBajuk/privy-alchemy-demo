import { usePrivy } from "@privy-io/react-auth";

export default function PrivyWallet() {
  const { login } = usePrivy();

  return (
    <div className="card">
      <h2>Privy modal login</h2>
      <p>Social, wallet, passkey — opens the Privy login modal.</p>
      <button onClick={() => login()}>Login with Privy</button>
    </div>
  );
}
