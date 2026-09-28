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

  // Chains each commit onto the previous one so a new commit never starts until the last settled.
  const inFlightRef = useRef<Promise<unknown>>(Promise.resolve());
  const debouncedCommit = useMemo(
    () =>
      debounce(
        // refs are only read once debounce-promise invokes this callback, never during render
        // eslint-disable-next-line react-hooks/refs
        (response: FormResponseType) => {
          const result = inFlightRef.current.catch(() => undefined).then(() => commitRef.current(response));
          inFlightRef.current = result;
          return result;
        },
        300,
        { leading: true },
      ),
    [],
  );

  useEffect(() => {
    debouncedCommit(response);
  }, [debouncedCommit, response]);

  return debouncedCommit;
}
