import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import buildFormStateFromData from './buildFormStateFromData';
import ErrorDisplay from '../ErrorDisplay';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';
import UserConProfileForm from './UserConProfileForm';
import { userConProfileQuery, userConProfileAdminQuery } from './queries';
import { updateUserConProfileMutation } from './mutations';

@withRouter
@graphql(userConProfileQuery)
@GraphQLQueryResultWrapper
class EditUserConProfile extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(userConProfileQuery).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    userConProfileId: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = buildFormStateFromData(props.data.userConProfile, props.data.convention);
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState(buildFormStateFromData(nextProps.data.userConProfile, nextProps.data.convention));
  }

  userConProfileChanged = (userConProfile) => {
    this.setState({ userConProfile });
  }

  saveClicked = async (updateUserConProfile) => {
    try {
      const { userConProfile } = this.state;
      await updateUserConProfile({
        variables: {
          input: {
            id: userConProfile.id,
            user_con_profile: {
              ...(
                this.props.data.currentAbility.can_update_privileges_user_con_profile
                  ? { privileges: userConProfile.privileges }
                  : {}
              ),
              form_response_attrs_json: JSON.stringify(userConProfile.form_response_attrs),
            },
          },
        },
        update: (cache, { data: { updateUserConProfile: { user_con_profile: updatedUserConProfile } } }) => {
          const variables = { id: this.props.userConProfileId };
          const query = cache.readQuery({ query: userConProfileAdminQuery, variables });
          cache.writeQuery({
            query: userConProfileAdminQuery,
            variables,
            data: {
              ...query,
              userConProfile: {
                ...query.userConProfile,
                ...updatedUserConProfile,
              },
            },
          });
        },
      });

      this.props.history.push(`/${this.state.userConProfile.id}`);
    } catch (error) {
      this.setState({ error });
    }
  }

  render = () => (
    <div>
      <h1 className="mb-4">
        Editing
        {' '}
        {this.state.userConProfile.name}
      </h1>
      <UserConProfileForm
        canUpdatePrivileges={
          this.props.data.currentAbility.can_update_privileges_user_con_profile
        }
        userConProfile={this.state.userConProfile}
        regularPrivilegeNames={this.props.data.convention.privilege_names
          .filter(priv => priv !== 'site_admin' && !this.props.data.convention.mail_privilege_names.includes(priv))}
        mailPrivilegeNames={this.props.data.convention.mail_privilege_names}
        onChange={this.userConProfileChanged}
        footerContent={(
          <Mutation mutation={updateUserConProfileMutation}>
            {updateUserConProfile => (
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => this.saveClicked(updateUserConProfile)}
              >
                Save changes
              </button>
            )}
          </Mutation>
        )}
        form={this.state.form}
        convention={this.state.convention}
      />
      <ErrorDisplay graphQLError={this.state.error} />
    </div>
  );
}

export default EditUserConProfile;
