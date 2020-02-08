import { useCallback, useEffect } from 'react';
import debounce from 'debounce-promise';

export default function useAutocommitFormResponseOnChange(commit, response) {
  const debouncedCommit = useCallback(
    debounce(commit, 300, { leading: true }),
    [commit],
  );

  useEffect(
    () => { debouncedCommit(response); },
    [debouncedCommit, response],
  );

  return debouncedCommit;
}
