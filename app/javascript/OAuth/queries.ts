import { gql } from '@apollo/client';

export const OAuthAuthorizationPromptQuery = gql`
  query OAuthAuthorizationPromptQuery($queryParams: Json!) {
    currentUser {
      id
    }
    oauthPreAuth(queryParams: $queryParams)
  }
`;

export const OAuthAuthorizedApplicationsQuery = gql`
  query OAuthAuthorizedApplicationsQuery {
    myAuthorizedApplications {
      uid
      name
      scopes
    }
  }
`;
