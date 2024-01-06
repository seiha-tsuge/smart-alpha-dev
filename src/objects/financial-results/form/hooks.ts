import { useForm } from "react-hook-form";

import { FinancialResultsInitialValues } from "./initialValues";

export interface FinancialResultsQueryForm {
  date: Date;
}

export const useFinancialResultsQueryForm = () => {
  return useForm<FinancialResultsQueryForm>({
    defaultValues: FinancialResultsInitialValues.query,
  });
};
