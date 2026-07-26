import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm';
import AuthLayout from '@/layouts/AuthLayout';
import type { NextPageWithLayout } from '@/types/page';

const ForgotPasswordPage: NextPageWithLayout = () => <ForgotPasswordForm />;

ForgotPasswordPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default ForgotPasswordPage;
