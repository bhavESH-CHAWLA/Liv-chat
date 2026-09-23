import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, MailWarning, MessageSquare } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { axiosInstance } from "../lib/axios";

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Confirming your email address...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing its token.");
      return;
    }

    let isActive = true;

    const verifyEmail = async () => {
      try {
        const response = await axiosInstance.post("/auth/verify-email", { token });
        if (isActive) {
          setStatus("success");
          setMessage(response.data.message || "Your email has been verified successfully.");
        }
      } catch (error) {
        if (isActive) {
          setStatus("error");
          setMessage(error?.response?.data?.message || "This verification link is invalid or expired.");
        }
      }
    };

    verifyEmail();

    return () => {
      isActive = false;
    };
  }, [searchParams]);

  const isSuccess = status === "success";
  const isVerifying = status === "verifying";

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl shadow-cyan-950/20">
        <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border ${isSuccess ? "border-emerald-400/30 bg-emerald-400/10" : "border-cyan-400/30 bg-cyan-400/10"}`}>
          {isVerifying && <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />}
          {isSuccess && <CheckCircle2 className="h-8 w-8 text-emerald-400" />}
          {status === "error" && <MailWarning className="h-8 w-8 text-rose-400" />}
        </div>

        <div className="mb-3 flex items-center justify-center gap-2 text-cyan-400">
          <MessageSquare className="h-5 w-5" />
          <span className="font-semibold">Liv-chat</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">
          {isVerifying ? "Verifying your email" : isSuccess ? "Email verified" : "Verification failed"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">{message}</p>

        {!isVerifying && (
          <Link to="/login" className="auth-btn mt-7 inline-flex w-full items-center justify-center">
            {isSuccess ? "Continue to sign in" : "Back to sign in"}
          </Link>
        )}
      </section>
    </main>
  );
}

export default VerifyEmailPage;
