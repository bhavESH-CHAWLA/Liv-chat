import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MessageSquare, Lock, Mail, User, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import toast from "react-hot-toast";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    signup(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-slate-950">
      <div className="w-full max-w-4xl">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row rounded-none md:rounded-3xl overflow-hidden">
            {/* FORM COLUMN - LEFT SIDE */}
            <div className="w-full md:w-1/2 p-6 sm:p-10 flex items-center justify-center bg-transparent">
              <div className="w-full max-w-md">
                {/* HEADING */}
                <div className="text-center mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-sky-500/10 border border-cyan-500/30 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/10">
                    <MessageSquare className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-1.5">Create Account</h1>
                  <p className="text-slate-400 text-xs sm:text-sm">Join <span className="text-cyan-400 font-semibold">Liv-chat</span> and start messaging today</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* FULL NAME */}
                  <div>
                    <label htmlFor="signup-name" className="auth-input-label">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="auth-input-icon" />
                      <input
                        id="signup-name"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="input"
                        placeholder="Alex Morgan"
                        autoComplete="name"
                        aria-required="true"
                      />
                    </div>
                  </div>

                  {/* EMAIL INPUT */}
                  <div>
                    <label htmlFor="signup-email" className="auth-input-label">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="auth-input-icon" />
                      <input
                        id="signup-email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input"
                        placeholder="alex@example.com"
                        autoComplete="email"
                        aria-required="true"
                      />
                    </div>
                  </div>

                  {/* PASSWORD INPUT */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="signup-password" className="auth-input-label !mb-0">
                        Password
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">Min. 6 chars</span>
                    </div>
                    <div className="relative">
                      <Lock className="auth-input-icon" />
                      <input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input pr-11"
                        placeholder="••••••••••••"
                        autoComplete="new-password"
                        aria-required="true"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 rounded-lg transition focus-visible:ring-2 focus-visible:ring-cyan-400"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isSigningUp}
                    aria-busy={isSigningUp}
                    className="auth-btn mt-2"
                  >
                    {isSigningUp ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Account…
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center text-xs sm:text-sm text-slate-400">
                  <span>Already have an account? </span>
                  <Link to="/login" className="auth-link font-semibold">
                    Sign in here
                  </Link>
                </div>
              </div>
            </div>

            {/* ILLUSTRATION COLUMN - RIGHT SIDE */}
            <div
              className="hidden md:flex md:w-1/2 bg-gradient-to-bl from-slate-900 via-slate-950 to-slate-950 p-8 border-l border-slate-800/80 items-center justify-center text-center select-none"
              aria-hidden="true"
            >
              <div className="max-w-sm flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-sky-500/20 rounded-3xl blur-xl" />
                  <img
                    src="/signup.png"
                    alt=""
                    className="relative w-full max-w-[280px] h-auto object-contain rounded-2xl shadow-2xl border border-slate-800"
                  />
                </div>

                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  Start Your Journey Today
                </h2>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Fast, private messaging with rich media, instant delivery, and custom avatars.
                </p>

                <div className="mt-5 flex items-center justify-center gap-2">
                  <span className="auth-badge">Zero Fees</span>
                  <span className="auth-badge">Private</span>
                  <span className="auth-badge">Ultra-fast</span>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default SignUpPage;