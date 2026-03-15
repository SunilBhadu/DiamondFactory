'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Minimum 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login?redirect=/account/profile');
  }, [isAuthenticated, authLoading, router]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
    },
  });

  useEffect(() => {
    if (user)
      reset({ firstName: user.firstName, lastName: user.lastName, phone: user.phone ?? '' });
  }, [user, reset]);

  const {
    register: regPwd,
    handleSubmit: handlePwd,
    reset: resetPwd,
    formState: { errors: pwdErrors },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const updateProfile = useMutation({
    mutationFn: (data: ProfileForm) => apiClient.patch('/users/me', data).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  });

  const changePassword = useMutation({
    mutationFn: (data: PasswordForm) =>
      apiClient.patch('/users/me/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => resetPwd(),
  });

  return (
    <div className="mx-auto max-w-2xl space-y-10 px-4 py-12">
      <h1 className="font-display text-charcoal-900 text-3xl font-bold">My Profile</h1>

      {/* ── Personal Information ─────────────────────────── */}
      <section className="border-charcoal-200 rounded-2xl border bg-white p-6">
        <h2 className="font-display text-charcoal-800 mb-6 text-xl font-semibold">
          Personal Information
        </h2>
        <form onSubmit={handleSubmit((d) => updateProfile.mutate(d))} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
          </div>
          <Input label="Email" value={user?.email ?? ''} disabled className="bg-charcoal-50" />
          <Input
            label="Phone"
            {...register('phone')}
            placeholder="+91 98765 43210"
            error={errors.phone?.message}
          />
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={!isDirty || updateProfile.isPending}>
              {updateProfile.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
            {updateProfile.isSuccess && (
              <span className="text-sm text-green-600">Profile updated successfully</span>
            )}
          </div>
        </form>
      </section>

      {/* ── Change Password ──────────────────────────────── */}
      <section className="border-charcoal-200 rounded-2xl border bg-white p-6">
        <h2 className="font-display text-charcoal-800 mb-6 text-xl font-semibold">
          Change Password
        </h2>
        <form onSubmit={handlePwd((d) => changePassword.mutate(d))} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            {...regPwd('currentPassword')}
            error={pwdErrors.currentPassword?.message}
          />
          <Input
            label="New Password"
            type="password"
            {...regPwd('newPassword')}
            error={pwdErrors.newPassword?.message}
          />
          <Input
            label="Confirm New Password"
            type="password"
            {...regPwd('confirmPassword')}
            error={pwdErrors.confirmPassword?.message}
          />
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="outline" disabled={changePassword.isPending}>
              {changePassword.isPending ? 'Updating…' : 'Update Password'}
            </Button>
            {changePassword.isSuccess && (
              <span className="text-sm text-green-600">Password updated</span>
            )}
            {changePassword.isError && (
              <span className="text-sm text-red-500">Current password incorrect</span>
            )}
          </div>
        </form>
      </section>

      {/* ── Account Info ─────────────────────────────────── */}
      <section className="border-charcoal-100 bg-charcoal-50 rounded-2xl border p-6">
        <h2 className="font-display text-charcoal-700 mb-3 text-lg font-semibold">
          Account Details
        </h2>
        <dl className="text-charcoal-600 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Member since</dt>
            <dd>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                  })
                : '—'}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Account type</dt>
            <dd className="capitalize">{user?.role ?? 'Customer'}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Email verified</dt>
            <dd>{user?.emailVerified ? '✅ Verified' : '⚠️ Not verified'}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
