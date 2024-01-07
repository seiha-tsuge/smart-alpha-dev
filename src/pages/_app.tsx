import Head from 'next/head';

import { SessionProvider } from 'next-auth/react';
import { AppProvider } from '@/providers/app';

import { api } from '@/utils/api';

import type { AppPropsWithLayout } from '@/types/next';

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>

      <SessionProvider session={session}>
        <AppProvider>{getLayout(<Component {...pageProps} />)}</AppProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
