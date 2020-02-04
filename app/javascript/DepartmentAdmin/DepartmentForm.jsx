import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useAsyncFunction from '../useAsyncFunction';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import BootstrapFormTextarea from '../BuiltInFormControls/BootstrapFormTextarea';
import ErrorDisplay from '../ErrorDisplay';

function DepartmentForm({ initialDepartment, onSave }) {
  const [name, setName] = useState(initialDepartment.name);
  const [proposalDescription, setProposalDescription] = useState(
    initialDepartment.proposal_description,
  );
  const [save, saveError, saveInProgress] = useAsyncFunction(onSave);

  const saveClicked = () => save({
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

      <ErrorDisplay graphQLError={saveError} />

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

DepartmentForm.propTypes = {
  initialDepartment: PropTypes.shape({
    name: PropTypes.string,
    proposal_description: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};

export default DepartmentForm;
