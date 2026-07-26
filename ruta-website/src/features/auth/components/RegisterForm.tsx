import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowsUpDownIcon, MapPinIcon, SearchIcon } from '@/components/icons';
import { readJsonResponse } from '@/services/http/client';
import { firstError, validateEmail, validatePassword, validateUsername } from '@/utils/validation';
import Alert from '@/components/ui/Alert';
import Checkbox from '@/components/ui/Checkbox';
import PrimaryButton from '@/components/ui/PrimaryButton';
import TextField from '@/components/ui/TextField';
import AuthCard from './AuthCard';
import AuthStatusStrip from './AuthStatusStrip';
import SocialAuthButtons from './SocialAuthButtons';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');

    // Same rules the API enforces, so the user sees them without a round trip.
    const validationError = firstError(
      validateUsername(formData.username),
      validateEmail(formData.email),
      validatePassword(formData.password),
    );

    if (validationError) return setError(validationError);
    if (!acceptedTerms) return setError('Please accept the Terms of Service and Privacy Policy to continue.');

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        // The design has a single password field; the API still checks the pair,
        // so the confirmation mirrors what was typed.
        body: JSON.stringify({ ...formData, confirmPassword: formData.password }),
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
    <AuthCard
      title="Join RUTA Today"
      description="Plan your smarter commute in the Philippines."
      footer={<AuthStatusStrip stacked status="Secure Registration Active" />}
    >
      <form onSubmit={handleSignUp} className="space-y-5">
        <TextField
          required
          label="Username"
          type="text"
          name="username"
          autoComplete="username"
          placeholder="juandelacruz"
          icon={<ArrowsUpDownIcon className="h-4 w-4" />}
          value={formData.username}
          onChange={(event) => setFormData({ ...formData, username: event.target.value })}
        />

        <TextField
          required
          label="Email Address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="name@example.com"
          icon={<SearchIcon className="h-4 w-4" />}
          value={formData.email}
          onChange={(event) => setFormData({ ...formData, email: event.target.value })}
        />

        <TextField
          required
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          icon={<MapPinIcon className="h-3 w-4" />}
          value={formData.password}
          onChange={(event) => setFormData({ ...formData, password: event.target.value })}
        />

        <Checkbox checked={acceptedTerms} onChange={setAcceptedTerms} name="acceptedTerms">
          I agree to the{' '}
          <Link href="/about_us" className="font-bold text-blue-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/about_us" className="font-bold text-blue-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </Checkbox>

        {error ? <Alert tone="error">{error}</Alert> : null}
        {notice ? <Alert tone="info">{notice}</Alert> : null}

        <PrimaryButton withChevron type="submit" loading={loading} loadingLabel="Creating Account…">
          Create Account
        </PrimaryButton>
      </form>

      <div className="mt-8">
        <SocialAuthButtons
          label="Or sign up with"
          onSelect={(provider) => {
            setError('');
            setNotice(`${provider} sign-up isn't available yet. Please register with your email.`);
          }}
        />
      </div>

      <p className="mt-8 text-center text-sm font-medium text-slate-500">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-bold text-blue-600 hover:underline">
          Log In
        </Link>
      </p>
    </AuthCard>
  );
}
