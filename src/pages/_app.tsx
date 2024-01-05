import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { createTheme, MantineProvider } from "@mantine/core";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@mantine/core/styles.css";
import "@/styles/globals.css";

const theme = createTheme({
  /** Put your mantine theme override here */
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <MantineProvider theme={theme}>
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
