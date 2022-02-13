import { FormResponse } from '../FormPresenter/useFormResponse';

export type SerializedFormResponseContainer = {
  __typename: string;
  id: string;
  form_response_attrs_json?: string | null;
};
export type WithFormResponse<T extends SerializedFormResponseContainer> = FormResponse & T;

export default function deserializeFormResponse<T extends SerializedFormResponseContainer>(
  formResponseContainer: T,
): WithFormResponse<T> {
  return {
    ...formResponseContainer,
    form_response_attrs: JSON.parse(formResponseContainer.form_response_attrs_json ?? '{}'),
  };
}
