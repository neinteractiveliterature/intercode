import { gql } from '@apollo/client';
import { AdminDepartmentFields } from './queries';

export const CreateDepartment = gql`
  mutation CreateDepartment($department: DepartmentInput!) {
    createDepartment(input: { department: $department }) {
      department {
        id
        ...AdminDepartmentFields
      }
    }
  }

  ${AdminDepartmentFields}
`;

export const UpdateDepartment = gql`
  mutation UpdateDepartment($id: ID!, $department: DepartmentInput!) {
    updateDepartment(input: { transitionalId: $id, department: $department }) {
      department {
        id
        ...AdminDepartmentFields
      }
    }
  }

  ${AdminDepartmentFields}
`;

export const DeleteDepartment = gql`
  mutation DeleteDepartment($id: ID!) {
    deleteDepartment(input: { transitionalId: $id }) {
      clientMutationId
    }
  }
`;
