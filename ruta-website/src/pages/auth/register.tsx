import PageMeta from '@/components/PageMeta';
import RegisterForm from '@/features/auth/components/RegisterForm';
import AuthLayout from '@/layouts/AuthLayout';
import type { NextPageWithLayout } from '@/types/page';

const registerFooterLinks = [
  { label: 'Community Guidelines', href: '/about-us' },
  { label: 'Accessibility', href: '/about-us' },
];

const RegisterPage: NextPageWithLayout = () => (
  <>
    <PageMeta title="Create Account" description="Join RUTA and plan your smarter commute in the Philippines." />
    <RegisterForm />
  </>
);

RegisterPage.getLayout = (page) => <AuthLayout footerLinks={registerFooterLinks}>{page}</AuthLayout>;

export default RegisterPage;
