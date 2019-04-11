import { useCallback } from 'react';

export default function useFormResponse(response, setResponse) {
  const setResponseAttrs = useCallback(
    newAttrs => setResponse(prevResponse => ({
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
