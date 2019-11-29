import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { humanize } from 'inflected';
import fetch from 'unfetch';
import { Link, useHistory } from 'react-router-dom';
import { useMutation } from 'react-apollo-hooks';

import { useConfirm } from '../ModalDialogs/Confirm';
import { DeleteUserConProfile } from './mutations.gql';
import { deserializeForm, deserializeFormResponseModel } from '../FormPresenter/GraphQLFormDeserialization';
import FormItemDisplay from '../FormPresenter/ItemDisplays/FormItemDisplay';
import TicketAdminSection from './TicketAdminSection';
import { UserConProfileAdminQuery } from './queries.gql';
import UserConProfileSignupsCard from '../EventsApp/SignupAdmin/UserConProfileSignupsCard';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';

function UserConProfileAdminDisplay({ userConProfileId }) {
  const history = useHistory();
  const { data, error } = useQuerySuspended(UserConProfileAdminQuery, {
    variables: { id: userConProfileId },
  });
  const form = useMemo(
    () => (error ? null : deserializeForm(data.convention.user_con_profile_form)),
    [data, error],
  );
  const formResponse = useMemo(
    () => (error ? null : deserializeFormResponseModel(data.userConProfile)),
    [data, error],
  );
  const confirm = useConfirm();
  const [deleteUserConProfile] = useMutation(DeleteUserConProfile);

  usePageTitle(useValueUnless(() => data.userConProfile.name, error));

  const becomeUser = useCallback(
    async () => {
      await fetch(`/user_con_profiles/${userConProfileId}/become`, {
        method: 'POST',
        credentials: 'include',
      });

      window.location.href = '/';
    },
    [userConProfileId],
  );

  const deleteConfirmed = async () => {
    await deleteUserConProfile({ variables: { userConProfileId: data.userConProfile.id } });
    history.replace('/user_con_profiles');
  };

  const renderFormItems = () => form.getAllItems().map((item) => {
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

  const renderUserAdminSection = () => {
    const { ability } = data.myProfile;

    return (
      <div className="card my-4 mt-lg-0">
        <div className="card-header">User administration</div>
        <ul className="list-group list-group-flush">
          {
            ability.can_update_user_con_profile
              ? (
                <li className="list-group-item">
                  <Link to={`/user_con_profiles/${userConProfileId}/edit`}>
                    Edit profile
                  </Link>
                </li>
              )
              : null
          }
          <li className="list-group-item">
            <a
              href={`/reports/user_con_profiles/${userConProfileId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Printable report
            </a>
          </li>
          {ability.can_become_user_con_profile
            ? (
              <li className="list-group-item">
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => confirm({
                    prompt: `Are you sure you want to become ${data.userConProfile.name} for the duration of this session?`,
                    action: becomeUser,
                  })}
                >
                  Become user
                </button>
              </li>
            )
            : null}
          {ability.can_delete_user_con_profile
            ? (
              <li className="list-group-item">
                <button
                  type="button"
                  className="btn btn-link p-0 text-danger"
                  onClick={() => confirm({
                    prompt: `Are you sure you want to remove ${data.userConProfile.name} from ${data.convention.name}?`,
                    action: deleteConfirmed,
                    renderError: (deleteError) => <ErrorDisplay graphQLError={deleteError} />,
                  })}
                >
                  Delete
                </button>
              </li>
            )
            : null}
        </ul>
      </div>
    );
  };

  const renderSignupsSection = () => {
    if (!data.myProfile.ability.can_read_signups) {
      return null;
    }

    return <UserConProfileSignupsCard userConProfileId={data.userConProfile.id} />;
  };

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <div className="row">
      <div className="col-lg-9">
        <h1>{data.userConProfile.name}</h1>
        <table className="table table-sm table-striped my-4">
          <tbody>
            <tr>
              <th scope="row" className="pr-2">Email</th>
              <td className="col-md-9">
                {data.userConProfile.email}
              </td>
            </tr>

            {renderFormItems()}

            {/* TODO maybe add staff positions and/or permissions here */}
          </tbody>
        </table>

        {
          data.convention.ticket_mode !== 'disabled' && (
            <TicketAdminSection
              userConProfile={data.userConProfile}
              convention={data.convention}
            />
          )
        }
      </div>

      <div className="col-lg-3">
        {renderUserAdminSection()}
        {renderSignupsSection()}
      </div>
    </div>
  );
}

UserConProfileAdminDisplay.propTypes = {
  userConProfileId: PropTypes.number.isRequired,
};

export default UserConProfileAdminDisplay;
