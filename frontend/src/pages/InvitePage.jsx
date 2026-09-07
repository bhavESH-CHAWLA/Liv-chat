import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import toast from "react-hot-toast";
import { UserCheck, UserPlus, XCircle, ArrowLeft, Loader2, Copy, Check, ShieldCheck } from "lucide-react";

function InvitePage() {
  const { id } = useParams();
  const { authUser } = useAuthStore();
  const { getInviteProfile, sendContactRequest, acceptContactRequest, declineContactRequest } = useChatStore();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const data = await getInviteProfile(id);
        setProfile(data);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Unable to load invite details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) loadProfile();
  }, [getInviteProfile, id]);

  const handleSendRequest = async () => {
    setActionLoading(true);
    try {
      await sendContactRequest(id);
      toast.success("Contact request sent successfully!");
      const data = await getInviteProfile(id);
      setProfile(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to send contact request.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    setActionLoading(true);
    try {
      await acceptContactRequest(id);
      toast.success("Contact request accepted! You can now chat.");
      const data = await getInviteProfile(id);
      setProfile(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to accept request.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineRequest = async () => {
    setActionLoading(true);
    try {
      await declineContactRequest(id);
      toast.success("Contact request declined.");
      const data = await getInviteProfile(id);
      setProfile(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to decline request.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyInviteUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setHasCopied(true);
      toast.success("Invite URL copied!");
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-slate-950 text-slate-100">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center max-w-md w-full shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4">
            <UserPlus className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold mb-2 text-slate-100">Sign In to Connect</h1>
          <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
            You need to be signed in to your Liv-chat account to accept invitations or start chatting with this member.
          </p>
          <Link
            to="/login"
            className="w-full inline-flex items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition shadow-md shadow-cyan-500/20 focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-slate-950 text-slate-100">
      <div className="w-full max-w-2xl">
        <BorderAnimatedContainer>
          <div className="p-6 md:p-8 space-y-6">
            {/* Top Navigation */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Messages
              </Link>
              <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Verified Invitation
              </span>
            </div>

            {isLoading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400 text-sm">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                <span>Loading invitation details…</span>
              </div>
            ) : !profile ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                Invitation profile not found or link has expired.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Profile Card Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div className="avatar online">
                    <div className="size-20 rounded-full overflow-hidden border-2 border-cyan-500/40 shadow-xl bg-slate-800">
                      <img
                        src={profile.profilePic || "/avatar.png"}
                        alt={`${profile.fullName}'s avatar`}
                        className="size-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-slate-100 truncate">{profile.fullName}</h1>
                    <p className="text-slate-400 text-sm truncate font-mono mt-0.5">{profile.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      Active Member
                    </div>
                  </div>
                </div>

                {/* Connection Status Box */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-200">Connection Status</h2>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      {profile.isSelf
                        ? "This is your personal invite link. You can copy and send this URL to invite other users to connect."
                        : profile.isContact
                        ? "You are connected! You can open the chat anytime from your conversation list."
                        : profile.requestStatus === "outgoing"
                        ? "You have already sent a request to this user. Waiting for approval."
                        : profile.requestStatus === "incoming"
                        ? "This user has sent you a connection request. Accept below to start chatting."
                        : "Connect with this user to start instant real-time messaging."}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2">
                    {profile.isSelf ? (
                      <button
                        type="button"
                        onClick={handleCopyInviteUrl}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition shadow-md shadow-cyan-500/20 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-cyan-300"
                      >
                        {hasCopied ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-950" />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy Your Invite URL</span>
                          </>
                        )}
                      </button>
                    ) : profile.requestStatus === "incoming" ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={handleAcceptRequest}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition shadow-md shadow-cyan-500/20 active:scale-[0.99] disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-cyan-300"
                        >
                          {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                          <span>Accept Request</span>
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={handleDeclineRequest}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-5 py-3 text-sm font-bold text-slate-300 transition active:scale-[0.99] disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-cyan-400"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Decline</span>
                        </button>
                      </div>
                    ) : profile.requestStatus === "outgoing" ? (
                      <div className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs font-semibold text-amber-300">
                        <span>⏳ Request pending member response</span>
                      </div>
                    ) : profile.isContact ? (
                      <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition shadow-md shadow-cyan-500/20 focus-visible:ring-2 focus-visible:ring-cyan-300"
                      >
                        <span>Open Direct Chat</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={handleSendRequest}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition shadow-md shadow-cyan-500/20 active:scale-[0.99] disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-cyan-300"
                      >
                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                        <span>Send Contact Request</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default InvitePage;

