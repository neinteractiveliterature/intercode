import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { humanize } from 'inflected';
import Form from '../Models/Form';
import FormPresenterApp from '../FormPresenter';
import FormSectionContainer from '../FormPresenter/containers/FormSectionContainer';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import UserConProfilePropType from './UserConProfilePropType';

class UserConProfileForm extends React.Component {
  static propTypes = {
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

  getRegularPrivileges = () => this.props.userConProfile.privileges.filter((
    priv => this.props.regularPrivilegeNames.includes(priv)
  ))

  getMailPrivileges = () => this.props.userConProfile.privileges.filter((
    priv => this.props.mailPrivilegeNames.includes(priv)
  ))

  regularPrivilegesChanged = (newPrivs) => {
    this.props.onChange({
      ...this.props.userConProfile,
      privileges: [...this.getMailPrivileges(), ...newPrivs],
    });
  }

  mailPrivilegesChanged = (newPrivs) => {
    this.props.onChange({
      ...this.props.userConProfile,
      privileges: [...this.getRegularPrivileges(), ...newPrivs],
    });
  }

  formResponseValuesChanged = (newResponseValues) => {
    this.props.onChange({
      ...this.props.userConProfile,
      formResponseAttrs: { ...this.props.userConProfile.formResponseAttrs, ...newResponseValues },
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
      <MultipleChoiceInput
        name="regular_privileges"
        caption="Privileges"
        choices={
          this.props.regularPrivilegeNames.sort()
            .map(choice => ({ label: humanize(choice), value: choice }))
        }
        choiceClassName="form-check-inline"
        value={this.getRegularPrivileges()}
        multiple
        onChange={this.regularPrivilegesChanged}
      />

      <MultipleChoiceInput
        name="mail_privileges"
        caption="Mail privileges"
        choices={
          this.props.mailPrivilegeNames.sort()
            .map(choice => ({ label: humanize(choice), value: choice }))
        }
        choiceClassName="form-check-inline"
        value={this.getMailPrivileges()}
        multiple
        onChange={this.mailPrivilegesChanged}
      />
    </div>
  )

  renderContent = () => {
    if (this.state.tab === 'profile') {
      return (
        <FormPresenterApp form={this.props.form}>
          <FormSectionContainer
            convention={this.props.convention}
            form={this.props.form}
            section={this.props.form.getSections().get(0)}
            errors={{}}
            response={this.props.userConProfile.formResponseAttrs}
            responseValuesChanged={this.formResponseValuesChanged}
          />
        </FormPresenterApp>
      );
    }

    return this.renderPrivileges();
  }

  render = () => (
    <div>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            href="#"
            className={classNames('nav-link', { active: this.state.tab === 'profile' })}
            onClick={this.profileTabClicked}
          >
            Profile
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#"
            className={classNames('nav-link', { active: this.state.tab === 'privileges' })}
            onClick={this.privilegesTabClicked}
          >
            Privileges
          </a>
        </li>
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
