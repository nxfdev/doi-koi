'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@doikoi.com');
  const [password, setPassword] = useState('doikoi2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate.');
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#502813] text-[#FCE08B] flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-[#763C1E] border border-[#FCE08B]/20 p-8 sm:p-10 space-y-8 shadow-2xl">
        <div className="text-center space-y-3">
          <div className="relative h-10 w-44 mx-auto">
            <Image
              src="/assets/brand/logo.png"
              alt="DOI KOI"
              fill
              className="object-contain brightness-200"
            />
          </div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-white">
            Administrative Portal
          </h1>
          <p className="text-xs text-[#FCE08B]/70 font-mono">
            Secure commerce & inventory access
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-950/60 border border-red-500/30 text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#FCE08B]/80 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#FCE08B]/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#502813] border border-[#FCE08B]/30 pl-10 pr-3 py-2.5 text-sm text-[#FCE08B] focus:outline-none focus:border-[#FCE08B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#FCE08B]/80 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#FCE08B]/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#502813] border border-[#FCE08B]/30 pl-10 pr-3 py-2.5 text-sm text-[#FCE08B] focus:outline-none focus:border-[#FCE08B]"
              />
            </div>
          </div>

          <div className="p-3 bg-[#502813]/60 border border-[#FCE08B]/10 text-[11px] text-[#FCE08B]/70 font-mono">
            Default credentials pre-filled for evaluation:
            <br />
            <strong>admin@doikoi.com</strong> / <strong>doikoi2026</strong>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FCE08B] text-[#763C1E] py-3.5 px-4 font-bold tracking-[0.2em] text-xs uppercase hover:bg-white transition-colors flex items-center justify-center gap-2 font-mono"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#FCE08B]/10">
          <a
            href="/"
            className="text-xs font-mono text-[#FCE08B]/60 hover:text-white transition-colors uppercase tracking-widest"
          >
            ← Return to Public Store
          </a>
        </div>
      </div>
    </div>
  );
}
