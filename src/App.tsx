import {PrivyProvider, usePrivy, User, createWalletCreationOnLoginPlugin} from "@privy-io/react-auth";
import PrivyWallet from "./components/PrivyWallet";
import EmailOtpLogin from "./components/EmailOtpLogin";
import SendTransaction from "./components/SendTransaction";
import usePrivySigner from "./hooks/usePrivySigner";
import "./App.css";

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID ?? "";

function Inner() {
    const {ready, authenticated, logout} = usePrivy();
    const signer = usePrivySigner();

    if (!ready) return <p className="status">Initializing Privy…</p>;

    if (!authenticated) {
        return (
            <>
                <p className="hint-top">Choose a login method to test the signer:</p>
                <PrivyWallet/>
                <div className="divider">or</div>
                <EmailOtpLogin/>
            </>
        );
    }

    return (
        <>
            <div className="card">
                <div className="row">
                    <span>✅ Authenticated</span>
                    <button className="secondary" onClick={() => logout()}>
                        Logout
                    </button>
                </div>
            </div>

            {signer ? (
                <SendTransaction signer={signer}/>
            ) : (
                <p className="status">Loading embedded wallet signer…</p>
            )}
        </>
    );
}

export default function App() {
    // Add custom logic to only create a new embedded wallet
    const walletCreationPluginOptions = {
        shouldCreateWallet: ({user}: { user: User }) =>
            user.customMetadata?.['blocksquare'] === undefined,
    };

    return (
        <PrivyProvider
            appId={PRIVY_APP_ID}
            config={{
                plugins: [createWalletCreationOnLoginPlugin(walletCreationPluginOptions)],
                embeddedWallets: {
                    ethereum: {
                        createOnLogin: "users-without-wallets",
                    }
                },
            }}

        >
            <main>
                <h1>Alchemy × Privy</h1>
                <Inner/>
            </main>
        </PrivyProvider>
    );
}
