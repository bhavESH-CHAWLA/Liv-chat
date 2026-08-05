import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MessageCircleIcon, LockIcon, MailIcon, UserIcon, LoaderIcon } from "lucide-react";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-[#071022] to-[#081428]">
      <div className="w-full max-w-4xl">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row rounded-2xl overflow-hidden">
            {/* FORM COLUMN - LEFT SIDE */}
            <div className="md:w-1/2 p-10 flex items-center justify-center bg-transparent">
              <div className="w-full max-w-md">
                {/* HEADING TEXT */}
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-cyan-300 mb-4" />
                  <h2 className="text-3xl font-semibold text-white mb-2">Create Account</h2>
                  <p className="text-white/70">Create your LIV-CHAT account</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* FULL NAME */}
                  <div>
                    <label className="auth-input-label">Full Name</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />

                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="input"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* EMAIL INPUT */}
                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />

                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input"
                        placeholder="johndoe@gmail.com"
                      />
                    </div>
                  </div>

                  {/* PASSWORD INPUT */}
                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />

                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button className="auth-btn shadow-xl transition-transform active:scale-[0.99]" type="submit" disabled={isSigningUp}>
                    {isSigningUp ? <LoaderIcon className="w-5 h-5 animate-spin mx-auto" /> : "Create Account"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="auth-link text-white/80 hover:underline">
                    Already have an account? Login
                  </Link>
                </div>
              </div>
            </div>

            {/* FORM ILLUSTRATION - RIGHT SIDE */}
            <div className="hidden md:block md:w-1/2 bg-gradient-to-bl from-[#06212b] to-[#021019] p-8">
              <div className="h-full flex flex-col justify-center items-center text-center">
                <img src="/signup.png" alt="People using mobile devices" className="w-3/4 h-auto object-contain rounded-lg shadow-2xl" />
                <div className="mt-6">
                  <h3 className="text-xl font-medium text-cyan-300">Start Your Journey Today</h3>
                  <p className="text-white/70 mt-2">Fast, private messaging for everyone.</p>
                  <div className="mt-4 flex justify-center gap-3">
                    <span className="auth-badge">Free</span>
                    <span className="auth-badge">Private</span>
                    <span className="auth-badge">Lightweight</span>
                  </div>
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