import React from 'react';
import PropTypes from 'prop-types';
import { humanize, titleize } from 'inflected';
import fetch from 'unfetch';
import { ApolloConsumer, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Confirm from '../ModalDialogs/Confirm';
import { deserializeForm, deserializeFormResponseModel } from '../FormPresenter/GraphQLFormDeserialization';
import FormItemDisplay from '../FormPresenter/ItemDisplays/FormItemDisplay';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import TicketAdminSection from './TicketAdminSection';
import { userConProfileAdminQuery } from './queries';
import UserConProfileSignupsCard from '../SignupAdmin/UserConProfileSignupsCard';

const deleteUserConProfileMutation = gql`
mutation($userConProfileId: Int!) {
  deleteUserConProfile(input: { id: $userConProfileId }) {
    user_con_profile {
      id
    }
  }
}
`;

class UserConProfileAdminDisplay extends React.Component {
  static propTypes = {
    userConProfileId: PropTypes.number.isRequired,
    editUserConProfileUrl: PropTypes.string.isRequired,
    becomeUserConProfileUrl: PropTypes.string.isRequired,
    becomeUserConProfileAuthenticityToken: PropTypes.string.isRequired,
    editTicketUrl: PropTypes.string.isRequired,
    newTicketUrl: PropTypes.string.isRequired,
  }

  becomeUser = async () => {
    await fetch(this.props.becomeUserConProfileUrl, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'X-CSRF-Token': this.props.becomeUserConProfileAuthenticityToken,
      },
    });

    window.location.href = '/';
  }

  renderFormItems = (data) => {
    const form = deserializeForm(data.convention.user_con_profile_form);
    const formResponse = deserializeFormResponseModel(data.userConProfile);

    return form.getAllItems().map((item) => {
      if (item.itemType === 'static_text') {
        return null;
      }

      return (
        <tr key={item.identifier}>
          <th scope="row" className="pr-2">
            {humanize(item.identifier)}
          </th>
          <td className="col-md-9">
            <FormItemDisplay
              formItem={item}
              convention={data.convention}
              value={formResponse.formResponseAttrs[item.identifier]}
            />
          </td>
        </tr>
      );
    });
  }

  renderUserAdminSection = (data) => {
    const { ability } = data.myProfile;
    if (!ability.can_update_user_con_profile) {
      return null;
    }

    return (
      <div className="card my-4 mt-lg-0">
        <div className="card-header">User administration</div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <a href={this.props.editUserConProfileUrl}>Edit profile/privileges</a>
          </li>
          {ability.can_become_user_con_profile
            ? (
              <li className="list-group-item">
                <Confirm.Trigger>
                  {confirm => (
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      onClick={() => confirm({
                        prompt: `Are you sure you want to become ${data.userConProfile.name} for the duration of this session?`,
                        action: this.becomeUser,
                      })}
                    >
                      Become user
                    </button>
                  )}
                </Confirm.Trigger>
              </li>
            )
            : null}
          {ability.can_delete_user_con_profile
            ? (
              <li className="list-group-item">
                <ApolloConsumer>
                  {client => (
                    <Mutation
                      mutation={deleteUserConProfileMutation}
                      variables={{ userConProfileId: data.userConProfile.id }}
                    >
                      {deleteUserConProfile => (
                        <Confirm.Trigger>
                          {confirm => (
                            <button
                              type="button"
                              className="btn btn-link p-0 text-danger"
                              onClick={() => confirm({
                                prompt: `Are you sure you want to remove ${data.userConProfile.name} from ${data.convention.name}?`,
                                action: async () => {
                                  await deleteUserConProfile();

                                  // we can't possibly know what permutations of the
                                  // UserConProfilesTable query are in the cache, so clear them all
                                  client.resetStore();
                                },
                              })}
                            >
                              Delete
                            </button>
                          )}
                        </Confirm.Trigger>
                      )}
                    </Mutation>
                  )}
                </ApolloConsumer>
              </li>
            )
            : null}
        </ul>
      </div>
    );
  }

  renderSignupsSection = (data) => {
    if (!data.myProfile.ability.can_read_signups) {
      return null;
    }

    return <UserConProfileSignupsCard userConProfileId={data.userConProfile.id} />;
  }

  render = () => (
    <QueryWithStateDisplay
      query={userConProfileAdminQuery}
      variables={{ id: this.props.userConProfileId }}
    >
      {({ data }) => (
        <div className="row">
          <div className="col-lg-9">
            <h1>{data.userConProfile.name}</h1>
            <table className="table table-sm table-striped my-4">
              <tbody>
                {this.renderFormItems(data)}

                <tr>
                  <th scope="row" className="pr-2">Privileges</th>
                  <td>
                    {data.userConProfile.privileges.length > 0
                      ? data.userConProfile.privileges.map(priv => titleize(priv)).join(', ')
                      : 'none'}
                  </td>
                </tr>
              </tbody>
            </table>

            <TicketAdminSection
              userConProfile={data.userConProfile}
              convention={data.convention}
              newTicketUrl={this.props.newTicketUrl}
              editTicketUrl={this.props.editTicketUrl}
            />
          </div>

          <div className="col-lg-3">
            {this.renderUserAdminSection(data)}
            {this.renderSignupsSection(data)}
          </div>
        </div>
      )}
    </QueryWithStateDisplay>
  )
}

export default UserConProfileAdminDisplay;
