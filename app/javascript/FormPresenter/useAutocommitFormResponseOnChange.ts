import { useEffect, useMemo } from 'react';
import debounce from 'debounce-promise';
import { FormResponse } from './useFormResponse';

export default function useAutocommitFormResponseOnChange<
  FormResponseType extends FormResponse,
  CommitResult = unknown,
>(
  commit: (response: FormResponseType) => Promise<CommitResult>,
  response: FormResponseType,
): (response: FormResponseType) => Promise<CommitResult> {
  const debouncedCommit = useMemo(() => debounce(commit, 300, { leading: true }), [commit]);

  useEffect(() => {
    debouncedCommit(response);
  }, [debouncedCommit, response]);

  return debouncedCommit;
}
