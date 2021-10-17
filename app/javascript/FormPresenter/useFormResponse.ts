import React, { useCallback } from 'react';

export type FormResponse<AttrsType extends Record<string, unknown> = Record<string, unknown>> = {
  form_response_attrs: AttrsType;
};

export default function useFormResponse<
  ResponseType extends FormResponse<AttrsType>,
  AttrsType extends Record<string, unknown>,
>(
  response: ResponseType,
  setResponse: React.Dispatch<React.SetStateAction<ResponseType>>,
): [AttrsType, (prevState: AttrsType) => void] {
  const setResponseAttrs = useCallback(
    (newAttrs: AttrsType) =>
      setResponse((prevResponse) => ({
        ...prevResponse,
        form_response_attrs: {
          ...prevResponse.form_response_attrs,
          ...newAttrs,
        },
      })),
    [setResponse],
  );

  return [response.form_response_attrs, setResponseAttrs];
}
