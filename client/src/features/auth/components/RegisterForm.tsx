import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LockIcon, UserIcon } from '@/components/icons';
import { errorMessage } from '@/lib/http';
import * as authApi from '@/services/auth.service';
import Alert from '@/components/ui/Alert';
import Checkbox from '@/components/ui/Checkbox';
import PrimaryButton from '@/components/ui/PrimaryButton';
import TextField from '@/components/ui/TextField';
import AuthCard from './AuthCard';
import AuthStatusStrip from './AuthStatusStrip';
import SocialAuthButtons from './SocialAuthButtons';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');

    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match.');
    if (!acceptedTerms) return setError('Please accept the Terms of Service and Privacy Policy to continue.');

    setLoading(true);
    try {
      await authApi.register(formData);

      router.push('/auth/login?registered=1');
    } catch (registerError) {
      setError(errorMessage(registerError, 'Registration failed.'));
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
          icon={<UserIcon className="h-4 w-4" />}
          value={formData.username}
          onChange={(event) => setFormData({ ...formData, username: event.target.value })}
        />

        <TextField
          required
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          icon={<LockIcon className="h-4 w-4" />}
          value={formData.password}
          onChange={(event) => setFormData({ ...formData, password: event.target.value })}
        />

        <TextField
          required
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          icon={<LockIcon className="h-4 w-4" />}
          value={formData.confirmPassword}
          onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })}
        />

        <Checkbox checked={acceptedTerms} onChange={setAcceptedTerms} name="acceptedTerms">
          I agree to the{' '}
          <Link href="/about-us" className="font-bold text-blue-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/about-us" className="font-bold text-blue-600 hover:underline">
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
            setNotice('');

            if (provider === 'Google') {
              window.location.href = '/api/auth/google/start';
              return;
            }

            setNotice(`${provider} sign-up isn't available yet. Please register with a username.`);
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
