import React, { useState } from 'react';
import Link from 'next/link';

import { NavLink, Tooltip, ActionIcon } from '@mantine/core';
import { IconBuilding } from '@tabler/icons-react';

import { ROUTE } from '@/consts/route';

import classes from './Navbar.module.css';

interface NavbarProps {
  isOpen: boolean;
}

export const Navbar = ({ isOpen }: NavbarProps) => {
  const [active, setActive] = useState(0);

  const navLinks = [{ label: '決算速報', href: ROUTE.HOME, icon: IconBuilding }];

  const renderNavLinks = navLinks.map((item, index) => {
    const { label, href, icon: Icon } = item;
    const isActive = active === index;

    return isOpen ? (
      <NavLink
        key={index}
        component={Link}
        href={href}
        label={label}
        leftSection={<Icon />}
        active={isActive}
        p='lg'
        h={64}
        onClick={() => setActive(index)}
      />
    ) : (
      <Tooltip key={index} label={label} position='right' withArrow>
        <ActionIcon
          component={Link}
          href={href}
          h={64}
          w='100%'
          radius={0}
          variant={isActive ? 'light' : 'default'}
          onClick={() => setActive(index)}
          className={classes.actionIcon}
        >
          <Icon />
        </ActionIcon>
      </Tooltip>
    );
  });

  return <>{renderNavLinks}</>;
};
