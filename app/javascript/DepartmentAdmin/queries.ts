import { gql } from '@apollo/client';

export const AdminDepartmentFields = gql`
  fragment AdminDepartmentFields on Department {
    id: transitionalId
    name
    proposal_description

    event_categories {
      id: transitionalId
      name
    }
  }
`;

export const DepartmentAdminQuery = gql`
  query DepartmentAdminQuery {
    currentAbility {
      can_update_departments
    }

    convention: conventionByRequestHost {
      id: transitionalId

      departments {
        id: transitionalId
        ...AdminDepartmentFields
      }
    }
  }

  ${AdminDepartmentFields}
`;
