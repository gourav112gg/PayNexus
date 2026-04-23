'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Wallet, QrCode, Users } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAppStore();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (!formData.name) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        await register(formData.email, formData.password, formData.name);
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-primary rounded-full smooth-transition shadow-[0_4px_12px_rgba(30,215,96,0.3)]">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-[28px] font-bold text-foreground tracking-tight">PayNexus</h1>
          </div>
          <p className="text-muted-foreground text-[16px]">
            {isLogin ? 'Welcome back to your account' : 'Start splitting payments instantly'}
          </p>
        </div>

        {/* Login/Register Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-[14px] font-bold text-foreground mb-2">Full Name</label>
                <Input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[14px] font-bold text-foreground mb-2">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[14px] font-bold text-foreground mb-2">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-[14px] font-bold smooth-transition">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/40 text-center">
            <p className="text-[14px] text-muted-foreground">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ email: '', password: '', name: '' });
                }}
                className="font-bold text-foreground hover:text-primary smooth-hover tracking-wide"
              >
                {isLogin ? 'CREATE ONE' : 'SIGN IN'}
              </button>
            </p>
          </div>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-8 p-5 rounded-[8px] bg-muted shadow-sm">
          <p className="text-[14px] font-bold text-foreground mb-3 uppercase tracking-wide">Demo Account</p>
          <div className="space-y-2">
            <p className="text-[14px] text-muted-foreground">
              Email: <span className="font-mono text-foreground tracking-wide">user1@example.com</span>
            </p>
            <p className="text-[14px] text-muted-foreground">
              Pass: <span className="font-mono text-foreground tracking-wide">password</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
