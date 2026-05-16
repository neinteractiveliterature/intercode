import { useContext } from 'react';
import { useQuery } from '@apollo/client/react';
import AppRootContext from '../AppRootContext';
import { SignInConventionQueryDocument } from './queries.generated';

export function useSignInConventionName(): string | null | undefined {
  const { conventionName } = useContext(AppRootContext);
  const { data } = useQuery(SignInConventionQueryDocument, {
    skip: conventionName != null,
  });
  return conventionName ?? data?.signInConvention?.name;
}
