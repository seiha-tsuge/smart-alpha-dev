import React from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

import { Box, Group, Stack, Button, UnstyledButton, Popover, Avatar, Text } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';

export const UserButton = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return null;

  const { name, image } = sessionData.user;

  return (
    <Popover width={296} trapFocus position='bottom-end' shadow='md'>
      <Popover.Target>
        <UnstyledButton>
          <Avatar src={image} alt="it's me" size='md' />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown p={0}>
        <Box p={16}>
          <Stack>
            <Group>
              <Avatar src={image} alt="it's me" size='md' />
              <Text>{name}</Text>
            </Group>
            <Button
              justify='center'
              fullWidth
              variant='default'
              leftSection={<IconLogout size={14} />}
              onClick={() => signOut()}
            >
              Sign out
            </Button>
          </Stack>
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
};
