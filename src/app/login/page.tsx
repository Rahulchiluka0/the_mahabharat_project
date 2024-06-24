import * as React from 'react';
import type { Metadata } from 'next';
import { Layout } from '@/components/auth/layout';
import LoginPage from '@/components/auth/login-form';

// export const metadata = { title: `Sign in | Auth | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Layout>
        <LoginPage />
    </Layout>
  );
}
