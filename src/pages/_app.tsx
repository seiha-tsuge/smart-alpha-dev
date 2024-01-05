import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { createTheme, MantineProvider } from "@mantine/core";

import { api } from "@/utils/api";

import { type NextPage } from "next";

import { type AppProps } from "next/app";
import { type ReactElement, type ReactNode } from "react";

import "@mantine/core/styles.css";
import "@/styles/globals.css";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
  Component: NextPageWithLayout;
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={session}>
      <MantineProvider theme={theme}>
        {getLayout(<Component {...pageProps} />)}
      </MantineProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
