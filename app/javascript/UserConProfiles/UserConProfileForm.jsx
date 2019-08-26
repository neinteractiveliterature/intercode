import React from 'react';
import PropTypes from 'prop-types';

import Form from '../Models/Form';
import SinglePageFormPresenter from '../FormPresenter/SinglePageFormPresenter';
import UserConProfilePropType from './UserConProfilePropType';
import { useTabs, TabList, TabBody } from '../UIComponents/Tabs';

function UserConProfileForm(props) {
  const formResponseValuesChanged = (newResponseValues) => {
    props.onChange({
      ...props.userConProfile,
      form_response_attrs: {
        ...props.userConProfile.form_response_attrs,
        ...newResponseValues,
      },
    });
  };

  const tabProps = useTabs([
    {
      name: 'Profile',
      id: 'profile',
      renderContent: () => (
        <SinglePageFormPresenter
          form={props.form}
          convention={props.convention}
          response={props.userConProfile.form_response_attrs}
          responseValuesChanged={formResponseValuesChanged}
        />
      ),
    },
  ]);

  return (
    <div>
      <TabList {...tabProps} />
      <div className="card border-top-0">
        <div className="card-body">
          <TabBody {...tabProps} />
        </div>
        <div className="card-footer">
          {props.footerContent}
        </div>
      </div>
    </div>
  );
}

UserConProfileForm.propTypes = {
  userConProfile: UserConProfilePropType.isRequired,
  footerContent: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  convention: PropTypes.shape({}).isRequired,
  form: Form.propType.isRequired,
};

export default UserConProfileForm;
