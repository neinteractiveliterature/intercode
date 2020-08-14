import { useCallback } from 'react';

export type FormResponse = {
  form_response_attrs: {
    [fieldIdentifier: string]: any,
  },
};

export default function useFormResponse<ResponseType extends FormResponse>(
  response: ResponseType, setResponse: React.Dispatch<React.SetStateAction<ResponseType>>,
) {
  const setResponseAttrs = useCallback(
    (newAttrs: ResponseType['form_response_attrs']) => setResponse((prevResponse) => ({
      ...prevResponse,
      form_response_attrs: {
        ...prevResponse.form_response_attrs,
        ...newAttrs,
      },
    })),
    [setResponse],
  );

  return [response.form_response_attrs, setResponseAttrs] as const;
}
