import React from "react";

import { AppShell } from "@mantine/core";
import { Header } from "./Header";
import { Navbar } from "./Navbar";

import { useLocalStorage } from "@mantine/hooks";

import type { PropsWithChildren } from "react";

export const MainLayout = ({ children }: PropsWithChildren) => {
  const [navbarDisplayPreference, setNavbarDisplayPreference] = useLocalStorage(
    {
      key: "navbar-display-preference",
      defaultValue: "opened",
    }
  );

  const isOpen = navbarDisplayPreference === "opened";

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: isOpen ? 260 : 64, breakpoint: 0 }}
    >
      <AppShell.Header>
        <Header
          navbarDisplayPreference={navbarDisplayPreference}
          setNavbarDisplayPreference={setNavbarDisplayPreference}
        />
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar isOpen={isOpen} />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export const getLayout = (page: React.ReactNode) => (
  <MainLayout>{page}</MainLayout>
);
