import React from "react";

import {
  Box,
  Group,
  Stack,
  Button,
  UnstyledButton,
  Popover,
  Avatar,
  Text,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";

export const UserButton = () => {
  return (
    <Popover width={296} trapFocus position="bottom-end" shadow="md">
      <Popover.Target>
        <UnstyledButton>
          <Avatar src="" alt="it's me" size="md" />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown p={0}>
        <Box p={16}>
          <Stack>
            <Group>
              <Avatar src="" alt="it's me" size="md" />
              <Text>Smart Alpha</Text>
            </Group>
            <Button
              justify="center"
              fullWidth
              variant="default"
              leftSection={<IconLogout size={14} />}
            >
              Sign out
            </Button>
          </Stack>
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
};
