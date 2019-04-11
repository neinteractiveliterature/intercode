import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Form from '../Models/Form';
import PrivilegesForm from './PrivilegesForm';
import SinglePageFormPresenter from '../FormPresenter/SinglePageFormPresenter';
import UserConProfilePropType from './UserConProfilePropType';

class UserConProfileForm extends React.Component {
  static propTypes = {
    canUpdatePrivileges: PropTypes.bool.isRequired,
    userConProfile: UserConProfilePropType.isRequired,
    regularPrivilegeNames: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    mailPrivilegeNames: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    footerContent: PropTypes.node.isRequired,
    onChange: PropTypes.func.isRequired,
    convention: PropTypes.shape({}).isRequired,
    form: Form.propType.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      tab: 'profile',
    };
  }

  formResponseValuesChanged = (newResponseValues) => {
    this.props.onChange({
      ...this.props.userConProfile,
      form_response_attrs: {
        ...this.props.userConProfile.form_response_attrs,
        ...newResponseValues,
      },
    });
  }

  profileTabClicked = (event) => {
    event.preventDefault();
    this.setState({ tab: 'profile' });
  }

  privilegesTabClicked = (event) => {
    event.preventDefault();
    this.setState({ tab: 'privileges' });
  }

  renderPrivileges = () => (
    <div>
      <PrivilegesForm
        regularPrivilegeNames={this.props.regularPrivilegeNames}
        mailPrivilegeNames={this.props.mailPrivilegeNames}
        userConProfile={this.props.userConProfile}
        onChange={this.props.onChange}
      />
    </div>
  )

  renderContent = () => {
    if (this.state.tab === 'profile' || !this.props.canUpdatePrivileges) {
      return (
        <SinglePageFormPresenter
          form={this.props.form}
          convention={this.props.convention}
          response={this.props.userConProfile.form_response_attrs}
          responseValuesChanged={this.formResponseValuesChanged}
        />
      );
    }

    return this.renderPrivileges();
  }

  render = () => (
    <div>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            href="#profile"
            className={classNames('nav-link', { active: this.state.tab === 'profile' })}
            onClick={this.profileTabClicked}
          >
            Profile
          </a>
        </li>
        {
          this.props.canUpdatePrivileges
            ? (
              <li className="nav-item">
                <a
                  href="#privileges"
                  className={classNames('nav-link', { active: this.state.tab === 'privileges' })}
                  onClick={this.privilegesTabClicked}
                >
                  Privileges
                </a>
              </li>
            )
            : null
        }
      </ul>
      <div className="card border-top-0">
        <div className="card-body">
          {this.renderContent()}
        </div>
        <div className="card-footer">
          {this.props.footerContent}
        </div>
      </div>
    </div>
  )
}

export default UserConProfileForm;
