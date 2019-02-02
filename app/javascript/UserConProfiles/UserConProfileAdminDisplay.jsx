import React from 'react';
import PropTypes from 'prop-types';
import { humanize, titleize } from 'inflected';
import fetch from 'unfetch';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Link, withRouter } from 'react-router-dom';

import Confirm from '../ModalDialogs/Confirm';
import { deserializeForm, deserializeFormResponseModel } from '../FormPresenter/GraphQLFormDeserialization';
import FormItemDisplay from '../FormPresenter/ItemDisplays/FormItemDisplay';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import TicketAdminSection from './TicketAdminSection';
import { UserConProfileAdminQuery } from './queries.gql';
import UserConProfileSignupsCard from '../EventsApp/SignupAdmin/UserConProfileSignupsCard';

const deleteUserConProfileMutation = gql`
mutation DeleteUserConProfile($userConProfileId: Int!) {
  deleteUserConProfile(input: { id: $userConProfileId }) {
    user_con_profile {
      id
    }
  }
}
`;

@withRouter
class UserConProfileAdminDisplay extends React.Component {
  static propTypes = {
    userConProfileId: PropTypes.number.isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  }

  becomeUser = async () => {
    await fetch(`/user_con_profiles/${this.props.userConProfileId}/become`, {
      method: 'POST',
      credentials: 'same-origin',
    });

    window.location.href = '/';
  }

  renderFormItems = (data) => {
    const form = deserializeForm(data.convention.user_con_profile_form);
    const formResponse = deserializeFormResponseModel(data.userConProfile);

    return form.getAllItems().map((item) => {
      if (item.item_type === 'static_text') {
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

    return (
      <div className="card my-4 mt-lg-0">
        <div className="card-header">User administration</div>
        <ul className="list-group list-group-flush">
          {
            ability.can_update_user_con_profile
              ? (
                <li className="list-group-item">
                  <Link to={`/${this.props.userConProfileId}/edit`}>
                    Edit profile/privileges
                  </Link>
                </li>
              )
              : null
          }
          <li className="list-group-item">
            <a
              href={`/reports/user_con_profiles/${this.props.userConProfileId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Printable report
            </a>
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
                              this.props.history.replace('/');
                            },
                          })}
                        >
                          Delete
                        </button>
                      )}
                    </Confirm.Trigger>
                  )}
                </Mutation>
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
      query={UserConProfileAdminQuery}
      variables={{ id: this.props.userConProfileId }}
    >
      {({ data }) => (
        <div className="row">
          <div className="col-lg-9">
            <h1>{data.userConProfile.name}</h1>
            <table className="table table-sm table-striped my-4">
              <tbody>
                <tr>
                  <th scope="row" className="pr-2">Email</th>
                  <td className="col-md-9">
                    {data.userConProfile.user.email}
                  </td>
                </tr>

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
