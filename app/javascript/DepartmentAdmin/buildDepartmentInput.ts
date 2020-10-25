import { Department, DepartmentInput } from '../graphqlTypes.generated';

export default function buildDepartmentInput(
  department: Pick<Department, 'name' | 'proposal_description'>,
): DepartmentInput {
  return {
    name: department.name,
    proposal_description: department.proposal_description,
  };
}
