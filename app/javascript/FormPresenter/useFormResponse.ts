import React, { useCallback } from 'react';

// Copied from react-router-dom
type JsonObject = {
  [Key in string]: JsonValue;
} & {
  [Key in string]?: JsonValue | undefined;
};
type JsonArray = JsonValue[] | readonly JsonValue[];
type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;

type BaseAttrs = JsonObject;

export type FormResponse<AttrsType extends BaseAttrs = BaseAttrs> = {
  __typename: string;
  id: string;
  form_response_attrs: AttrsType;
};

export default function useFormResponse<ResponseType extends FormResponse<AttrsType>, AttrsType extends BaseAttrs>(
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
