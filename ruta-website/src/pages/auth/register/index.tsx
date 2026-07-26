import RegisterForm from '@/features/auth/components/RegisterForm';
import AuthLayout from '@/layouts/AuthLayout';
import type { NextPageWithLayout } from '@/types/page';

/** The design gives the sign-up screen its own footer links. */
const registerFooterLinks = [
  { label: 'Community Guidelines', href: '/about_us' },
  { label: 'Accessibility', href: '/about_us' },
  { label: 'Help Center', href: '/about_us' },
];

const RegisterPage: NextPageWithLayout = () => <RegisterForm />;

RegisterPage.getLayout = (page) => <AuthLayout footerLinks={registerFooterLinks}>{page}</AuthLayout>;

export default RegisterPage;
