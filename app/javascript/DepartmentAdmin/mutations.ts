import { gql } from '@apollo/client';
import { AdminDepartmentFields } from './queries';

export const CreateDepartment = gql`
  mutation CreateDepartment($department: DepartmentInput!) {
    createDepartment(input: { department: $department }) {
      department {
        id: transitionalId
        ...AdminDepartmentFields
      }
    }
  }

  ${AdminDepartmentFields}
`;

export const UpdateDepartment = gql`
  mutation UpdateDepartment($id: Int!, $department: DepartmentInput!) {
    updateDepartment(input: { id: $id, department: $department }) {
      department {
        id: transitionalId
        ...AdminDepartmentFields
      }
    }
  }

  ${AdminDepartmentFields}
`;

export const DeleteDepartment = gql`
  mutation DeleteDepartment($id: Int!) {
    deleteDepartment(input: { id: $id }) {
      clientMutationId
    }
  }
`;
