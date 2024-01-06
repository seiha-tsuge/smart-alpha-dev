import React, { type PropsWithChildren } from "react";

import { createTheme, MantineProvider } from "@mantine/core";

import "dayjs/locale/ja";
import { DatesProvider } from "@mantine/dates";

import "@mantine/core/styles.layer.css";
import "@mantine/dates/styles.layer.css";
import "mantine-datatable/styles.layer.css";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <MantineProvider theme={theme}>
      <DatesProvider
        settings={{
          locale: "ja",
        }}
      >
        {children}
      </DatesProvider>
    </MantineProvider>
  );
};
