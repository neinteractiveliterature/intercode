import { gql } from '@apollo/client';

export const RoomsAdminQuery = gql`
  query RoomsAdminQuery {
    convention: conventionByRequestHost {
      id
      rooms {
        id
        name

        runs {
          id
        }
      }
    }
  }
`;
