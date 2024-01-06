import React, { type PropsWithChildren } from "react";

import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export const AppProvider = ({ children }: PropsWithChildren) => {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
};
