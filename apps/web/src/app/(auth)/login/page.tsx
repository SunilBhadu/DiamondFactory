'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      router.push(redirect);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Invalid email or password. Please try again.';
      setError('root', { message });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/google`;
  };

  return (
    <div className="bg-charcoal-50 flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block">
            <span className="font-display text-charcoal-900 text-3xl font-bold">
              Diamond <span className="text-gold-500">Factory</span>
            </span>
          </Link>
          <p className="text-charcoal-500 mt-2">Sign in to your account</p>
        </div>

        <div className="shadow-card rounded-2xl bg-white p-8">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            className="border-charcoal-200 hover:border-charcoal-400 text-charcoal-700 mb-6 flex w-full items-center justify-center gap-3 rounded-xl border-2 py-3 font-medium transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="border-charcoal-200 w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="text-charcoal-400 bg-white px-3">or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={`w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none ${
                  errors.email
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-charcoal-300 focus:border-gold-500'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="text-charcoal-700 block text-sm font-medium">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-gold-600 hover:text-gold-700 text-sm transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  className={`w-full rounded-xl border px-4 py-3 pr-12 transition-colors focus:outline-none ${
                    errors.password
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-charcoal-300 focus:border-gold-500'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-charcoal-400 hover:text-charcoal-600 absolute top-1/2 right-4 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Root error */}
            {errors.root && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">{errors.root.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="bg-gold-500 hover:bg-gold-600 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign In
            </button>
          </form>

          <p className="text-charcoal-500 mt-6 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-gold-600 hover:text-gold-700 font-semibold">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
