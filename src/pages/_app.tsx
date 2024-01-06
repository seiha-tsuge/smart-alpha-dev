import { SessionProvider } from "next-auth/react";
import { AppProvider } from "@/providers/app";

import { api } from "@/utils/api";

import type { AppPropsWithLayout } from "@/types/next";

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={session}>
      <AppProvider>{getLayout(<Component {...pageProps} />)}</AppProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
