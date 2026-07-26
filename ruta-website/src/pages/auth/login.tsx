import PageMeta from '@/components/PageMeta';
import LoginForm from '@/features/auth/components/LoginForm';
import AuthLayout from '@/layouts/AuthLayout';
import type { NextPageWithLayout } from '@/types/page';

const LoginPage: NextPageWithLayout = () => (
  <>
    <PageMeta title="Log In" description="Sign in to manage your routes and commute alerts." />
    <LoginForm />
  </>
);

LoginPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default LoginPage;
