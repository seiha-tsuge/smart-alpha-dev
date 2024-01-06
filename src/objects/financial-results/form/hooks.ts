import { useForm } from "@mantine/form";

import { FinancialResultsInitialValues } from "./initialValues";

export interface FinancialResultsQueryForm {
  date: Date | null;
}

export const useFinancialResultsQueryForm = () => {
  return useForm<FinancialResultsQueryForm>({
    initialValues: FinancialResultsInitialValues.query,
  });
};
