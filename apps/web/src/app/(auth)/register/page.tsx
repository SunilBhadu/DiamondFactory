'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function PasswordStrengthIndicator({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', valid: password.length >= 8 },
    { label: 'Uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'Number', valid: /[0-9]/.test(password) },
    { label: 'Special character', valid: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.valid).length;
  const strength = score <= 1 ? 'Weak' : score <= 2 ? 'Fair' : score <= 3 ? 'Good' : 'Strong';
  const strengthColor =
    score <= 1
      ? 'bg-red-400'
      : score <= 2
        ? 'bg-orange-400'
        : score <= 3
          ? 'bg-yellow-400'
          : 'bg-green-500';

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex h-1 gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-colors ${
              i <= score ? strengthColor : 'bg-charcoal-200'
            }`}
          />
        ))}
      </div>
      <p className="text-charcoal-500 text-xs">
        Password strength: <span className="font-medium">{strength}</span>
      </p>
      <div className="grid grid-cols-2 gap-1">
        {checks.map((check) => (
          <div
            key={check.label}
            className={`flex items-center gap-1 text-xs ${
              check.valid ? 'text-green-600' : 'text-charcoal-400'
            }`}
          >
            <Check className="h-3 w-3" />
            {check.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { terms: false },
  });

  const password = watch('password', '');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError('root', { message });
    }
  };

  const handleGoogleSignup = () => {
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
          <p className="text-charcoal-500 mt-2">Create your account</p>
        </div>

        <div className="shadow-card rounded-2xl bg-white p-8">
          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignup}
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
            Sign up with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="border-charcoal-200 w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="text-charcoal-400 bg-white px-3">or create account with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  {...register('firstName')}
                  className={`w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none ${
                    errors.firstName
                      ? 'border-red-400'
                      : 'border-charcoal-300 focus:border-gold-500'
                  }`}
                  placeholder="Priya"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  {...register('lastName')}
                  className={`w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none ${
                    errors.lastName ? 'border-red-400' : 'border-charcoal-300 focus:border-gold-500'
                  }`}
                  placeholder="Sharma"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                Email address
              </label>
              <input
                type="email"
                autoComplete="email"
                {...register('email')}
                className={`w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none ${
                  errors.email ? 'border-red-400' : 'border-charcoal-300 focus:border-gold-500'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Phone (optional) */}
            <div>
              <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                Phone <span className="text-charcoal-400 font-normal">(Optional)</span>
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="border-charcoal-300 focus:border-gold-500 w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none"
                placeholder="+91 98765 43210"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password')}
                  className={`w-full rounded-xl border px-4 py-3 pr-12 transition-colors focus:outline-none ${
                    errors.password ? 'border-red-400' : 'border-charcoal-300 focus:border-gold-500'
                  }`}
                  placeholder="Create a strong password"
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
              <PasswordStrengthIndicator password={password} />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  className={`w-full rounded-xl border px-4 py-3 pr-12 transition-colors focus:outline-none ${
                    errors.confirmPassword
                      ? 'border-red-400'
                      : 'border-charcoal-300 focus:border-gold-500'
                  }`}
                  placeholder="Repeat your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-charcoal-400 hover:text-charcoal-600 absolute top-1/2 right-4 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms */}
            <div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  {...register('terms')}
                  className="accent-gold-500 mt-0.5 h-4 w-4"
                />
                <span className="text-charcoal-600 text-sm">
                  I agree to Diamond Factory's{' '}
                  <Link href="/terms" className="text-gold-600 underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-gold-600 underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms.message}</p>}
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
              Create Account
            </button>
          </form>

          <p className="text-charcoal-500 mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-gold-600 hover:text-gold-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
