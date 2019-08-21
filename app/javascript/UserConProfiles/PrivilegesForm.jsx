import React from 'react';
import PropTypes from 'prop-types';
import { humanize } from 'inflected';

import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';

function PrivilegesForm({
  regularPrivilegeNames, userConProfile, onChange,
}) {
  const regularPrivileges = userConProfile.privileges.filter((
    priv => regularPrivilegeNames.includes(priv)
  ));

  const regularPrivilegesChanged = (newPrivs) => {
    onChange({
      ...userConProfile,
      privileges: [...newPrivs],
    });
  };

  return (
    <>
      <MultipleChoiceInput
        name="regular_privileges"
        caption="Privileges"
        choices={
          [...regularPrivilegeNames].sort()
            .map(choice => ({ label: humanize(choice), value: choice }))
        }
        choiceClassName="form-check-inline"
        value={regularPrivileges}
        multiple
        onChange={regularPrivilegesChanged}
      />
    </>
  );
}

PrivilegesForm.propTypes = {
  regularPrivilegeNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  userConProfile: PropTypes.shape({
    privileges: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PrivilegesForm;
