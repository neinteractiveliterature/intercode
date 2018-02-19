import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import deserializeUserConProfile from './deserializeUserConProfile';
import ErrorDisplay from '../ErrorDisplay';
import Form from '../Models/Form';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';
import UserConProfileForm from './UserConProfileForm';
import { userConProfileQuery, fragments } from './queries';

const updateUserConProfileMutation = gql`
mutation($input: UpdateUserConProfileInput!) {
  updateUserConProfile(input: $input) {
    user_con_profile {
      ...UserConProfileFields
    }
  }
}

${fragments.userConProfile}
`;

@graphql(updateUserConProfileMutation, {
  props: ({ mutate }) => ({
    updateUserConProfile: userConProfile => mutate({
      variables: {
        input: {
          id: userConProfile.id,
          user_con_profile: {
            privileges: userConProfile.privileges,
            form_response_attrs_json: JSON.stringify(userConProfile.formResponseAttrs),
          },
        },
      },
    }),
  }),
})
@graphql(userConProfileQuery)
@GraphQLQueryResultWrapper
class EditUserConProfile extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(userConProfileQuery).isRequired,
    updateUserConProfile: PropTypes.func.isRequired,
    regularPrivilegeNames: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    mailPrivilegeNames: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = this.buildStateFromData(props.data);
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState(this.buildStateFromData(nextProps.data));
  }

  buildStateFromData = (data) => {
    const {
      user_con_profile_form: userConProfileForm,
      ...conventionProps
    } = data.convention;

    return {
      userConProfile: deserializeUserConProfile(data.userConProfile),
      convention: conventionProps,
      form: Form.fromApiResponse(JSON.parse(userConProfileForm.form_api_json)),
    };
  }

  userConProfileChanged = (userConProfile) => {
    this.setState({ userConProfile });
  }

  saveClicked = async () => {
    try {
      await this.props.updateUserConProfile(this.state.userConProfile);
      window.location.href = `/user_con_profiles/${this.state.userConProfile.id}`;
    } catch (error) {
      this.setState({ error });
    }
  }

  render = () => (
    <div>
      <h1 className="mb-4">Editing {this.state.userConProfile.name}</h1>
      <UserConProfileForm
        userConProfile={this.state.userConProfile}
        regularPrivilegeNames={this.props.regularPrivilegeNames}
        mailPrivilegeNames={this.props.mailPrivilegeNames}
        onChange={this.userConProfileChanged}
        footerContent={(
          <button className="btn btn-primary" onClick={this.saveClicked}>Save changes</button>
        )}
        form={this.state.form}
        convention={this.state.convention}
      />
      <ErrorDisplay graphQLError={this.state.error} />
    </div>
  );
}

export default EditUserConProfile;
