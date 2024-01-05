import React from "react";

import { Group, ActionIcon } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";
import { UserButton } from "./UserButton";

interface HeaderProps {
  navbarDisplayPreference: string;
  setNavbarDisplayPreference: (
    value: string | ((prevState: string) => string)
  ) => void;
}

export const Header = ({
  navbarDisplayPreference,
  setNavbarDisplayPreference,
}: HeaderProps) => {
  const onClick = () => {
    setNavbarDisplayPreference(
      navbarDisplayPreference === "opened" ? "collapsed" : "opened"
    );
  };

  return (
    <Group h="100%" px="lg" justify="space-between">
      <ActionIcon variant="transparent" onClick={onClick}>
        <IconMenu2 stroke={2} />
      </ActionIcon>
      <UserButton />
    </Group>
  );
};
