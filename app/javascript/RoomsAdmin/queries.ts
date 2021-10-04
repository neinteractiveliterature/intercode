import { gql } from '@apollo/client';

export const RoomsAdminQuery = gql`
  query RoomsAdminQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      rooms {
        id: transitionalId
        name

        runs {
          id: transitionalId
        }
      }
    }
  }
`;
