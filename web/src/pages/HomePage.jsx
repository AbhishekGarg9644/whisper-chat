import { ArrowRightIcon, SparklesIcon, XIcon, UserIcon, MailIcon, LockIcon } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import api from "../lib/axios";

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("sign-in");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginStore = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const endpoint = mode === "sign-in" ? "/auth/login" : "/auth/signup";
      const payload = mode === "sign-in" 
        ? { email: formData.email, password: formData.password }
        : formData;
        
      const res = await api.post(endpoint, payload);
      await loginStore(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (m) => {
    setMode(m);
    setFormData({ name: "", email: "", password: "" });
    setError(null);
    setIsModalOpen(true);
  };

  return (
    <div className="h-screen bg-base-100 text-base flex">
      {/* AUTH MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-base-200 w-full max-w-md rounded-3xl p-8 relative shadow-2xl border border-base-300">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 btn btn-circle btn-ghost btn-sm"
            >
              <XIcon className="w-5 h-5" />
            </button>
            
            <h2 className="text-3xl font-bold mb-2">
              {mode === "sign-in" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-base-content/60 mb-6">
              {mode === "sign-in" 
               ? "Sign in to your account to continue" 
               : "Join Whisper and start chatting."}
            </p>

            {error && (
              <div className="bg-error/10 text-error p-3 rounded-xl text-sm mb-4 border border-error/20">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "sign-up" && (
                <div className="form-control">
                  <label className="label text-xs font-semibold uppercase text-base-content/60">Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                    <input 
                      type="text"
                      required
                      placeholder="John Doe"
                      className="input input-bordered bg-base-100 w-full pl-10"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="form-control">
                <label className="label text-xs font-semibold uppercase text-base-content/60">Email</label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                  <input 
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="input input-bordered bg-base-100 w-full pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label text-xs font-semibold uppercase text-base-content/60">Password</label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    className="input input-bordered bg-base-100 w-full pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="btn w-full mt-4 bg-linear-to-r from-amber-500 to-orange-500 text-white border-none shadow-lg shadow-orange-500/20"
              >
                {isLoading ? <span className="loading loading-spinner"></span> : (mode === "sign-in" ? "Sign in" : "Sign up")}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-base-content/60">
              {mode === "sign-in" ? "Don't have an account? " : "Already have an account? "}
              <button 
                className="text-amber-500 font-semibold hover:underline"
                onClick={() => {
                  setMode(mode === "sign-in" ? "sign-up" : "sign-in");
                  setError(null);
                }}
              >
                {mode === "sign-in" ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEFT SIDE */}
      <div className="flex flex-1 flex-col p-8 lg:p-12 relative overflow-hidden">
        {/* NAVBAR */}
        <nav className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div
              className="size-9 rounded-xl bg-linear-to-br from bg-amber-400 to-orange-500
             flex items-center justify-center shadow-lg shadow-gray-500/20
          "
            >
              <SparklesIcon className="size-5 text-primary-content" />
            </div>
            <span className="text-xl font-bold">Whisper</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => openModal("sign-in")} className="px-5 py-2.5 text-sm font-medium text-base-content/50 hover:text-base-content transition">
              Sign in
            </button>
            <button onClick={() => openModal("sign-up")} className="btn gap-2 bg-linear-to-r from-amber-500 to-orange-500 text-sm font-semibold rounded-full hover:opacity-90 shadow-lg shadow-orange-500/25 border-none">
              Get Started
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col justify-center max-w-xl relative z-10">
          {/* Tag */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Now Available
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight font-mono">
            Messaging for
            <br />
            <span className="bg-linear-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              everyone
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg text-base-content/70 leading-relaxed max-w-md">
            Secure, blazing-fast conversations with real-time presence and instant delivery. Connect
            with anyone, anywhere.
          </p>

          {/* CTA BTNS */}
          <div className="mt-10 flex items-center gap-4">
            <button onClick={() => openModal("sign-up")} className="group flex items-center gap-3 px-8 py-4 bg-base-100 text-base-content font-semibold rounded-2xl hover:bg-base-200 transition border border-base-200 shadow-sm">
              Start chatting
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button onClick={() => openModal("sign-in")} className="px-8 py-4 text-base-content/60 font-semibold hover:text-base-content transition">
              I have an account
            </button>
          </div>

          {/* Avatars */}
          <div className="mt-8 flex items-center gap-4">
            <div className="avatar-group -space-x-3">
              <div className="avatar">
                <div className="w-10 rounded-full border-2 border-base-100">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                    alt="User avatar"
                  />
                </div>
              </div>
              <div className="avatar">
                <div className="w-10 rounded-full border-2 border-base-100">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                    alt="User avatar"
                  />
                </div>
              </div>
              <div className="avatar">
                <div className="w-10 rounded-full border-2 border-base-100">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                    alt="User avatar"
                  />
                </div>
              </div>
              <div className="avatar">
                <div className="w-10 rounded-full border-2 border-base-100">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                    alt="User avatar"
                  />
                </div>
              </div>
              <div className="avatar avatar-placeholder">
                <div className="w-10 rounded-full border-2 border-base-100 bg-base-300 text-base-content">
                  <span className="text-xs font-mono">+5k</span>
                </div>
              </div>
            </div>
            <span className="text-sm text-base-content/70">
              Join <span className="font-mono text-base-content/80">10,000+</span> happy users
            </span>
          </div>

          {/* STATS */}
          <div className="mt-12 flex items-center gap-10">
            <div>
              <div className="text-2xl font-bold font-mono">10K+</div>
              <div className="text-xs text-base-content/60 mt-1 uppercase tracking-wider">
                Users
              </div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <div className="text-2xl font-bold font-mono">99.9%</div>
              <div className="text-xs text-base-content/60 mt-1 uppercase tracking-wider">
                Uptime
              </div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <div className="text-2xl font-bold font-mono">&lt;50ms</div>
              <div className="text-xs text-base-content/60 mt-1 uppercase tracking-wider">
                Latency
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* RIGHT SIDE */}
      <div className="hidden lg:flex flex-1 relative bg-base-200 items-center justify-center overflow-hidden">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Radial Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]
           bg-linear-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-[100px]"
        />

        {/* Image Container */}
        <div className="relative z-10">
          {/* Decorative border */}
          <div className="absolute -inset-px rounded-3xl bg-linear-to-b from-white/20 to-white/5 p-px">
            <div className="w-full h-full rounded-3xl bg-base-200" />
          </div>

          {/* Card */}
          <div className="relative p-6 rounded-3xl border border-base-300 bg-base-200/80 backdrop-blur-xl shadow-2xl">
            <img src="/auth.png" alt="Chat illustration" className="w-80 xl:w-96 rounded-2xl" />

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium backdrop-blur-sm">
              ● 3 online
            </div>

            <div className="absolute -bottom-4 -left-4 px-4 py-2.5 bg-base-300/40 border border-base-300 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-linear-to-br from-amber-400 to-orange-500" />
                  <div className="w-6 h-6 rounded-full bg-linear-to-br from-rose-400 to-pink-500" />
                </div>
                <span className="text-sm text-base-content/80">typing...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
