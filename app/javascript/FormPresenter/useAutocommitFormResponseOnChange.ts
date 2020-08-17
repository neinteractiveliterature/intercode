import { useEffect, useMemo } from 'react';
import debounce from 'debounce-promise';
import { FormResponse } from './useFormResponse';

export default function useAutocommitFormResponseOnChange<FormResponseType extends FormResponse>(
  commit: (response: FormResponseType) => Promise<any>,
  response: FormResponseType,
) {
  const debouncedCommit = useMemo(() => debounce(commit, 300, { leading: true }), [commit]);

  useEffect(() => {
    debouncedCommit(response);
  }, [debouncedCommit, response]);

  return debouncedCommit;
}
