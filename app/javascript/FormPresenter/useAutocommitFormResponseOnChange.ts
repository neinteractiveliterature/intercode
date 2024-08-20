import { useEffect, useMemo, useRef } from 'react';
import debounce from 'debounce-promise';
import { FormResponse } from './useFormResponse';

export type AutocommitFormResponseFunction<FormResponseType extends FormResponse, CommitResult = unknown> = (
  response: FormResponseType,
) => Promise<CommitResult>;

export default function useAutocommitFormResponseOnChange<
  FormResponseType extends FormResponse,
  CommitResult = unknown,
>(
  commit: (response: FormResponseType) => Promise<CommitResult>,
  response: FormResponseType,
): AutocommitFormResponseFunction<FormResponseType, CommitResult> {
  const commitRef = useRef(commit);
  useEffect(() => {
    commitRef.current = commit;
  }, [commit]);
  const debouncedCommit = useMemo(
    () => debounce((response) => commitRef.current(response), 300, { leading: true }),
    [],
  );

  useEffect(() => {
    debouncedCommit(response);
  }, [debouncedCommit, response]);

  return debouncedCommit;
}
