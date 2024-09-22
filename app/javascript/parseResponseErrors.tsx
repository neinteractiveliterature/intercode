import isEqual from 'lodash/isEqual';
import { ApolloError } from '@apollo/client';

export class FormValidationError extends Error {
  validationErrors: Record<string, string[]>;

  constructor(validationErrors: Record<string, string[]>) {
    super();
    this.validationErrors = validationErrors;
  }
}

export function parseResponseErrors(error: ApolloError, errorPath: readonly (string | number)[]) {
  const { graphQLErrors } = error;
  const updateError = graphQLErrors.find((graphQLError) => isEqual(graphQLError.path, errorPath));
  const validationErrors = (updateError?.extensions?.validationErrors as Record<string, string[]>) ?? {};
  return validationErrors;
}
