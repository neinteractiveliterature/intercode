import { gql } from '@apollo/client';

export const AdminDepartmentFields = gql`
  fragment AdminDepartmentFields on Department {
    id
    name
    proposal_description

    event_categories {
      id
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
      id

      departments {
        id
        ...AdminDepartmentFields
      }
    }
  }

  ${AdminDepartmentFields}
`;
