import { Department, DepartmentInput } from '../graphqlTypes.generated';

export default function buildDepartmentInput(
  department: Pick<Department, 'name' | 'proposal_description'>,
): DepartmentInput {
  return {
    name: department.name,
    proposal_description: department.proposal_description,
  };
}

export function buildDepartmentInputFromFormData(formData: FormData): DepartmentInput {
  return {
    name: formData.get('name')?.toString(),
    proposal_description: formData.get('description')?.toString(),
  };
}
