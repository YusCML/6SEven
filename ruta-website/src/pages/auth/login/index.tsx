import LoginForm from '@/features/auth/components/LoginForm';
import AuthLayout from '@/layouts/AuthLayout';
import type { NextPageWithLayout } from '@/types/page';

const LoginPage: NextPageWithLayout = () => <LoginForm />;

LoginPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default LoginPage;
