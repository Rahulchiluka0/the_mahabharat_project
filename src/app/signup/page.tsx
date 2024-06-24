import * as React from 'react';
import type { Metadata } from 'next';
import { Layout } from '@/components/auth/layout';
import SignupPage  from '@/components/auth/sign-up-form';

// export const metadata = { title: `Sign in | Auth | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Layout>
        <SignupPage />
    </Layout>
  );
}
