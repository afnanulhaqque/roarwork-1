import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@roarworks.com');
  const [password, setPassword] = useState('Admin@Roarworks2026!');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);

    if (success) {
      showToast('Welcome back to The Roarworks Staff Portal!', 'success');
      navigate('/admin');
    } else {
      showToast('Invalid email or password. Please verify your credentials.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#070A11] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00B87C]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full bg-[#0F1522] rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" aria-label="Home" className="inline-flex mb-4 group">
            <img
              src="/images-removebg-preview.png"
              alt="The Roarworks"
              width="738"
              height="270"
              className="w-44 h-auto max-h-16 object-contain group-hover:scale-[1.02] transition-transform"
            />
          </Link>
          <h2 className="text-2xl font-extrabold text-white">Staff & Admin Portal</h2>
          <p className="text-xs text-gray-400 mt-1">
            Blue Area Islamabad Operations & CRM Management
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 space-y-1">
          <div className="flex items-center gap-1.5 text-[#00B87C] font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Pre-Seeded Demo Credentials:</span>
          </div>
          <div>Admin: <code className="text-white bg-black/40 px-1.5 py-0.5 rounded">admin@roarworks.com</code></div>
          <div>Password: <code className="text-white bg-black/40 px-1.5 py-0.5 rounded">Admin@Roarworks2026!</code></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@roarworks.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
              />
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
              />
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 mt-2 bg-[#00B87C] hover:bg-[#009F6B] disabled:bg-gray-600 text-white font-bold text-sm uppercase tracking-wider rounded-lg shadow-lg shadow-[#00B87C]/25 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? 'Verifying...' : 'Sign In to Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-gray-400 hover:text-white transition-colors">
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
};
