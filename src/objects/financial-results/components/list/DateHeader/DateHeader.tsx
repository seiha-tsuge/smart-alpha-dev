import React from 'react';

import { Group, ActionIcon } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import { useFinancialResultsQueryForm } from '@/objects/financial-results/form';

import { addDaysToDate, subtractDaysFromDate } from '@/utils/date';

import classes from './DateHeader.module.css';

export const DateHeader = () => {
  const form = useFinancialResultsQueryForm();

  const incrementDate = () => {
    const date = form.getInputProps('date').value as Date;
    form.setFieldValue('date', addDaysToDate(date, 1));
  };

  const decrementDate = () => {
    const date = form.getInputProps('date').value as Date;
    form.setFieldValue('date', subtractDaysFromDate(date, 1));
  };

  return (
    <Group className={classes.root}>
      <ActionIcon variant='transparent' onClick={decrementDate} className={classes.actionIcon}>
        <IconChevronLeft />
      </ActionIcon>

      <DatePickerInput valueFormat='YYYY/MM/DD' {...form.getInputProps('date')} />

      <ActionIcon variant='transparent' onClick={incrementDate} className={classes.actionIcon}>
        <IconChevronRight />
      </ActionIcon>
    </Group>
  );
};
