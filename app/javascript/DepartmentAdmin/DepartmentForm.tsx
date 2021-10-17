import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import {
  BootstrapFormInput,
  BootstrapFormTextarea,
  ErrorDisplay,
} from '@neinteractiveliterature/litform';

import useAsyncFunction from '../useAsyncFunction';
import { Department, DepartmentInput } from '../graphqlTypes.generated';

export type DepartmentFormProps = {
  initialDepartment: Pick<Department, 'name' | 'proposal_description'>;
  onSave: (departmentInput: DepartmentInput) => Promise<unknown>;
};

function DepartmentForm({ initialDepartment, onSave }: DepartmentFormProps): JSX.Element {
  const [name, setName] = useState(initialDepartment.name);
  const [proposalDescription, setProposalDescription] = useState(
    initialDepartment.proposal_description,
  );
  const [save, saveError, saveInProgress] = useAsyncFunction(onSave);

  const saveClicked = () =>
    save({
      name,
      proposal_description: proposalDescription,
    });

  return (
    <>
      <BootstrapFormInput
        label="Name"
        value={name || ''}
        onTextChange={setName}
        disabled={saveInProgress}
      />

      <BootstrapFormTextarea
        label="Description for proposal dialog"
        value={proposalDescription || ''}
        onTextChange={setProposalDescription}
        disabled={saveInProgress}
      />

      <ErrorDisplay graphQLError={saveError as ApolloError} />

      <button
        type="button"
        className="btn btn-primary"
        onClick={saveClicked}
        disabled={saveInProgress}
      >
        Save department
      </button>
    </>
  );
}

export default DepartmentForm;
