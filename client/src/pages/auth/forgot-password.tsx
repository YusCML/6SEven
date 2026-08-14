import PageMeta from '@/components/PageMeta';
import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm';
import AuthLayout from '@/layouts/AuthLayout';
import type { NextPageWithLayout } from '@/types/page';

const ForgotPasswordPage: NextPageWithLayout = () => (
  <>
    <PageMeta title="Reset Password" description="We will email you the steps to restore access to your RUTA account." />
    <ForgotPasswordForm />
  </>
);

ForgotPasswordPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default ForgotPasswordPage;
