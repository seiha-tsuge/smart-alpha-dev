import Head from 'next/head';

import { FinancialResults } from '@/components/pages/financial-results';
import { getLayout } from '@/components/layouts/MainLayout';

export const HomePage = () => {
  return (
    <>
      <Head>
        <title>Smart Alpha</title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <FinancialResults />
    </>
  );
};

HomePage.getLayout = getLayout;

export default HomePage;
