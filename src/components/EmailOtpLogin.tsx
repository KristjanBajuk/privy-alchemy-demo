import { useState } from "react";
import { useLoginWithEmail } from "@privy-io/react-auth";

export default function EmailOtpLogin() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [error, setError] = useState<string | null>(null);

  const { sendCode, loginWithCode, state } = useLoginWithEmail({
    onError: (err) => setError(String(err)),
  });

  const loading =
    state.status === "sending-code" || state.status === "submitting-code";

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    await sendCode({ email });
    setStep("otp");
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    await loginWithCode({ code });
  }

  return (
    <div className="card">
      <h2>Email OTP login</h2>

      {step === "email" ? (
        <form onSubmit={handleSendCode} className="form">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading || !email}>
            {loading ? "Sending…" : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="form">
          <p className="hint">Code sent to <strong>{email}</strong></p>
          <input
            type="text"
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            disabled={loading}
            maxLength={6}
            inputMode="numeric"
            autoFocus
          />
          <div className="row">
            <button
              type="button"
              className="secondary"
              onClick={() => { setStep("email"); setCode(""); setError(null); }}
              disabled={loading}
            >
              Back
            </button>
            <button type="submit" disabled={loading || code.length < 6}>
              {loading ? "Verifying…" : "Verify"}
            </button>
          </div>
        </form>
      )}

      {error && <p className="error">❌ {error}</p>}
    </div>
  );
}
