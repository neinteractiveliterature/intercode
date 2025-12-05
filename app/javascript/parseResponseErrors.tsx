import { CombinedGraphQLErrors } from '@apollo/client';
import isEqual from 'lodash/isEqual';

export class FormValidationError extends Error {
  validationErrors: Record<string, string[]>;

  constructor(validationErrors: Record<string, string[]>) {
    super();
    this.validationErrors = validationErrors;
  }
}

export function parseResponseErrors(error: Error, errorPath: readonly (string | number)[]) {
  if (CombinedGraphQLErrors.is(error)) {
    const updateError = error.errors.find((graphQLError) => isEqual(graphQLError.path, errorPath));
    const validationErrors = (updateError?.extensions?.validationErrors as Record<string, string[]>) ?? {};
    return validationErrors;
  } else {
    return {};
  }
}
