import React from "react";

import { Group, ActionIcon } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import { useFinancialResultsQueryForm } from "@/objects/financial-results/form";

import { addDaysToDate, subtractDaysFromDate } from "@/utils/date";

export const DateHeader = () => {
  const { register, getValues, setValue } = useFinancialResultsQueryForm();

  const incrementDate = () => {
    const currentDate = getValues("date");
    const incrementedDate = addDaysToDate(currentDate, 1);
    setValue("date", incrementedDate);
  };

  const decrementDate = () => {
    const currentDate = getValues("date");
    const decrementedDate = subtractDaysFromDate(currentDate, 1);
    setValue("date", decrementedDate);
  };

  const handleDateChange = (date: Date | null) => {
    setValue("date", date);
  };

  return (
    <Group>
      <ActionIcon variant="transparent" onClick={decrementDate}>
        <IconChevronLeft />
      </ActionIcon>

      <DatePickerInput
        valueFormat="YYYY/MM/DD"
        {...register("date")}
        onChange={handleDateChange}
      />

      <ActionIcon variant="transparent" onClick={incrementDate}>
        <IconChevronRight />
      </ActionIcon>
    </Group>
  );
};
