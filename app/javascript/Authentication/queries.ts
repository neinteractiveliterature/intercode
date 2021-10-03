import { gql } from '@apollo/client';

export const AccountFormContentQuery = gql`
  query AccountFormContentQuery {
    accountFormContentHtml
  }
`;

export const EditUserQuery = gql`
  query EditUserQuery {
    convention: conventionByRequestHostIfPresent {
      id
      name
    }

    currentUser {
      id
      first_name
      last_name
      email
    }
  }
`;
