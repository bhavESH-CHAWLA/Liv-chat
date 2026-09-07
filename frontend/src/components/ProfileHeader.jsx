import { useEffect, useState, useRef } from "react";
import { LogOut, VolumeX, Volume2, QrCode, Camera, Copy, Check, X, Loader2, MessageSquare } from "lucide-react";
import QRCode from "qrcode";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import FocusTrap from "./a11y/FocusTrap";

function ProfileHeader({ onToggleInvite, isInviteActive = false }) {
  const { logout, authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteQr, setInviteQr] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [isInviteLoading, setIsInviteLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const userInviteUrl = `${window.location.origin}/invite/${authUser?._id}`;

  useEffect(() => {
    if (!showInviteModal || !authUser) return;

    const generateQr = async () => {
      setIsInviteLoading(true);
      try {
        const dataUrl = await QRCode.toDataURL(userInviteUrl, {
          margin: 1,
          width: 260,
          errorCorrectionLevel: "H",
          color: {
            dark: "#0b1120",
            light: "#ffffff",
          },
        });
        setInviteQr(dataUrl);
        setInviteLink(userInviteUrl);
      } catch (error) {
        console.error("Failed to generate invite QR:", error);
        toast.error("Could not render QR code");
      } finally {
        setIsInviteLoading(false);
      }
    };

    generateQr();
  }, [showInviteModal, authUser, userInviteUrl]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(userInviteUrl);
      setHasCopied(true);
      toast.success("Invite link copied to clipboard!");
      setTimeout(() => setHasCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy link");
    }
  };

  const handleInviteClick = () => {
    if (onToggleInvite) {
      onToggleInvite();
    } else {
      setShowInviteModal(true);
    }
  };

  return (
    <header role="banner" className="p-4 md:p-5 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl flex-shrink-0">
      <div className="flex items-center justify-between gap-3">
        {/* User Profile Info */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="avatar online relative group">
            <button
              type="button"
              disabled={isUpdatingProfile}
              className="size-12 md:size-13 rounded-full overflow-hidden relative border-2 border-cyan-500/30 group-hover:border-cyan-400 transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Change profile picture"
              title="Click to update profile photo"
            >
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt={`${authUser?.fullName || "User"}'s profile`}
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-focus:opacity-100 flex items-center justify-center transition-opacity">
                {isUpdatingProfile ? (
                  <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 text-white" />
                )}
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-slate-100 font-bold text-base truncate">
                {authUser?.fullName || "Account"}
              </h2>
            </div>
            <p className="text-slate-400 text-xs truncate">
              {authUser?.email}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span className="text-[11px] font-medium text-emerald-400">
                Online
              </span>
              <span className="sr-only">Status: Active & connected</span>
            </div>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
          {/* QR Invite Button */}
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition shadow-sm active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
              isInviteActive
                ? "bg-cyan-400 text-slate-950 shadow-cyan-500/30 ring-2 ring-cyan-400/50"
                : "bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 hover:shadow-cyan-500/20"
            }`}
            onClick={handleInviteClick}
            aria-label={isInviteActive ? "Hide invite QR code" : "Show invite QR code"}
            title="Invite friends via QR code"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">Invite</span>
          </button>

          {/* Sound Toggle Button */}
          <button
            type="button"
            className={`p-2 rounded-xl border transition duration-150 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
              isSoundEnabled
                ? "border-slate-800 bg-slate-900/90 text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800"
                : "border-slate-800/80 bg-slate-900/50 text-slate-500 hover:text-slate-300 hover:border-slate-700"
            }`}
            onClick={toggleSound}
            aria-label={isSoundEnabled ? "Mute audio sound effects" : "Unmute audio sound effects"}
            title={isSoundEnabled ? "Sound enabled (click to mute)" : "Sound muted (click to unmute)"}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Logout Button */}
          <button
            type="button"
            className="p-2 rounded-xl border border-slate-800/80 bg-slate-900/60 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10 transition duration-150 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
            onClick={logout}
            aria-label="Sign out of account"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Accessible Invite Dialog Modal (Fallback/Expanded View) */}
      {showInviteModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="invite-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowInviteModal(false)}
        >
          <FocusTrap onEscape={() => setShowInviteModal(false)}>
            <div
              className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 id="invite-dialog-title" className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-cyan-400" />
                    Invite Friends to Chat
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Share your QR code or direct link to connect instantly.
                  </p>
                </div>
                <button
                  type="button"
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition focus-visible:ring-2 focus-visible:ring-cyan-400"
                  onClick={() => setShowInviteModal(false)}
                  aria-label="Close invite modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 flex flex-col items-center justify-center">
                {isInviteLoading ? (
                  <div className="h-56 flex flex-col items-center justify-center gap-3 text-slate-400 text-sm">
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                    <span>Generating unique QR code…</span>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="bg-white p-3.5 rounded-2xl shadow-xl border border-white/40 flex items-center justify-center">
                      {inviteQr ? (
                        <img
                          src={inviteQr}
                          alt="Your personalized invite QR Code"
                          className="w-48 h-48 rounded-lg object-contain"
                        />
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center text-slate-500 text-xs">
                          QR Code unavailable
                        </div>
                      )}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="size-8 rounded-lg bg-slate-950 border-2 border-cyan-400 shadow-md flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                      </div>
                    </div>
                  </div>
                )}
                <p className="text-xs text-slate-400 text-center mt-3">
                  Scan with your phone camera or app
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
                  <span className="text-xs text-slate-300 truncate select-all flex-1 font-mono">
                    {userInviteUrl}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 py-3 text-slate-950 text-sm font-bold shadow-md shadow-cyan-500/20 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Invite Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </FocusTrap>
        </div>
      )}
    </header>
  );
}

export default ProfileHeader;
