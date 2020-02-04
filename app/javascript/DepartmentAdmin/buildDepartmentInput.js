export default function buildDepartmentInput(department) {
  return {
    name: department.name,
    proposal_description: department.proposal_description,
  };
}
