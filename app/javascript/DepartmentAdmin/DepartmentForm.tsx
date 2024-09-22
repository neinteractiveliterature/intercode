import { useState } from 'react';
import { BootstrapFormInput, BootstrapFormTextarea } from '@neinteractiveliterature/litform';

import { Department } from '../graphqlTypes.generated';

export type DepartmentFormProps = {
  initialDepartment: Pick<Department, 'name' | 'proposal_description'>;
  disabled: boolean;
};

function DepartmentForm({ initialDepartment, disabled }: DepartmentFormProps): JSX.Element {
  const [name, setName] = useState(initialDepartment.name);
  const [proposalDescription, setProposalDescription] = useState(initialDepartment.proposal_description);

  return (
    <>
      <BootstrapFormInput label="Name" name="name" value={name || ''} onTextChange={setName} disabled={disabled} />

      <BootstrapFormTextarea
        label="Description for proposal dialog"
        name="proposal_description"
        value={proposalDescription || ''}
        onTextChange={setProposalDescription}
        disabled={disabled}
      />
    </>
  );
}

export default DepartmentForm;
