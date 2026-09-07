import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { QrCode, Copy, Check, X, Loader2, MessageSquare, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

function InviteQrCard({ onClose }) {
  const { authUser } = useAuthStore();
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasCopied, setHasCopied] = useState(false);

  const inviteUrl = `${window.location.origin}/invite/${authUser?._id}`;

  useEffect(() => {
    if (!authUser?._id) return;

    let isMounted = true;
    const generateQr = async () => {
      setIsLoading(true);
      try {
        const url = await QRCode.toDataURL(inviteUrl, {
          margin: 1,
          width: 240,
          errorCorrectionLevel: "H", // High error correction to allow center badge
          color: {
            dark: "#0b1120",
            light: "#ffffff",
          },
        });
        if (isMounted) {
          setQrDataUrl(url);
        }
      } catch (err) {
        console.error("Failed to generate QR code:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    generateQr();
    return () => {
      isMounted = false;
    };
  }, [authUser?._id, inviteUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setHasCopied(true);
      toast.success("Invite link copied to clipboard!");
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="relative rounded-2xl border border-slate-800/90 bg-gradient-to-b from-slate-900/95 to-slate-950/95 p-4 shadow-xl backdrop-blur-xl transition-all duration-200">
      {/* Top Header with title and optional close */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/70">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              Scan to Connect
              <Sparkles className="w-3 h-3 text-cyan-400" />
            </h3>
            <p className="text-[10px] text-slate-400">Personal chat invitation</p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Hide invite QR code"
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition"
            title="Hide QR"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Centered QR Code Card Frame */}
      <div className="py-3.5 flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="w-40 h-40 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
            <span>Generating QR…</span>
          </div>
        ) : (
          <div className="relative group">
            {/* White card container for optimal camera contrast */}
            <div className="bg-white p-3 rounded-2xl shadow-xl shadow-cyan-500/5 border border-white/40 flex items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR invite code for ${authUser?.fullName || "User"}`}
                  className="w-36 h-36 md:w-40 md:h-40 rounded-lg object-contain block select-none"
                />
              ) : (
                <div className="w-36 h-36 flex items-center justify-center text-slate-400 text-xs">
                  Unavailable
                </div>
              )}
            </div>

            {/* Central Brand Badge */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="size-7 rounded-lg bg-slate-950 border-2 border-cyan-400 shadow-md flex items-center justify-center">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
              </div>
            </div>
          </div>
        )}

        <p className="text-[11px] text-slate-400 text-center mt-2.5 leading-tight">
          Scan with your phone camera to connect
        </p>
      </div>

      {/* Action Area */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 py-2.5 px-3 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 transition active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
        >
          {hasCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Invite Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default InviteQrCard;
