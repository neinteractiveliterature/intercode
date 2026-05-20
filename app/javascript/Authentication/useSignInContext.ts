import { useContext } from 'react';
import { useQuery } from '@apollo/client/react';
import AppRootContext from '../AppRootContext';
import { SignInContextQueryDocument } from './queries.generated';

export type SignInContext = {
  conventionName: string | null | undefined;
  oauthAppName: string | null | undefined;
};

export function useSignInContext(): SignInContext {
  const { conventionName } = useContext(AppRootContext);
  const { data } = useQuery(SignInContextQueryDocument, {
    skip: conventionName != null,
  });
  return {
    conventionName: conventionName ?? data?.signInConvention?.name,
    oauthAppName: data?.signInOAuthApplication?.name,
  };
}
