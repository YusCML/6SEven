import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import { readJsonResponse } from '@/services/http/client';
import { firstError, validateEmail, validateFullName, validatePassword } from '@/utils/validation';
import AuthPageLayout from './AuthPageLayout';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    // Same rules the API enforces, so the user sees them without a round trip.
    const validationError = firstError(
      validateFullName(formData.fullName),
      validateEmail(formData.email),
      validatePassword(formData.password),
    );

    if (validationError) return setError(validationError);
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(formData),
      });
      const data = await readJsonResponse<{ error?: string }>(response);

      if (!response.ok) throw new Error(data.error || 'Registration failed.');

      // Registration does not sign you in — confirm the credentials by logging in.
      router.push('/auth/login?registered=1');
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout
      icon="🌐"
      title="Create Account"
      description="Join Ruta to plan efficient transit routes"
      containerClassName="flex-1 w-full flex items-center justify-center bg-slate-50 px-4 py-12"
    >
      <form onSubmit={handleSignUp} className="space-y-4">
        <FormField required label="Full Name" type="text" placeholder="Juan Dela Cruz" value={formData.fullName} onChange={(event) => setFormData({ ...formData, fullName: event.target.value })} />
        <FormField required label="Email Address" type="email" placeholder="name@domain.com" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} />
        <FormField required label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} />
        <FormField required label="Confirm Password" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })} />
        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 text-white font-medium py-3 rounded-lg shadow-sm transition mt-4">
          {loading ? 'Creating Account...' : 'Register Account'}
        </Button>
      </form>
      {error ? <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <p className="text-center text-sm text-slate-600 mt-6">
        Already have an account? <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">Log in</Link>
      </p>
    </AuthPageLayout>
  );
}
