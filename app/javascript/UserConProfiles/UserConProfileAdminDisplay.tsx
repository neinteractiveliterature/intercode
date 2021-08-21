import { useCallback, useMemo } from 'react';
import { humanize } from 'inflected';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useConfirm, ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import FormItemDisplay from '../FormPresenter/ItemDisplays/FormItemDisplay';
import TicketAdminSection from './TicketAdminSection';
import UserConProfileSignupsCard from '../EventsApp/SignupAdmin/UserConProfileSignupsCard';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';
import Gravatar from '../Gravatar';
import { useDeleteUserConProfileMutation } from './mutations.generated';
import { useUserConProfileAdminQuery } from './queries.generated';
import deserializeFormResponse from '../Models/deserializeFormResponse';
import { getSortedParsedFormItems } from '../Models/Form';

function UserConProfileAdminDisplay() {
  const userConProfileId = Number.parseInt(useParams<{ id: string }>().id, 10);
  const history = useHistory();
  const { data, loading, error } = useUserConProfileAdminQuery({
    variables: { id: userConProfileId },
  });
  const formItems = useMemo(
    () =>
      loading || error ? [] : getSortedParsedFormItems(data!.convention!.user_con_profile_form),
    [data, loading, error],
  );
  const formResponse = useMemo(
    () => (loading || error ? null : deserializeFormResponse(data!.userConProfile)),
    [data, loading, error],
  );
  const confirm = useConfirm();
  const [deleteUserConProfile] = useDeleteUserConProfileMutation();

  usePageTitle(useValueUnless(() => data!.userConProfile.name, error || loading));

  const becomeUser = useCallback(async () => {
    await fetch(`/user_con_profiles/${userConProfileId}/become`, {
      method: 'POST',
      credentials: 'include',
    });

    window.location.href = '/';
  }, [userConProfileId]);

  const deleteConfirmed = async () => {
    await deleteUserConProfile({ variables: { userConProfileId: data!.userConProfile.id } });
    history.replace('/user_con_profiles');
  };

  const renderFormItems = () =>
    formItems.map((item) => {
      if (item.item_type === 'static_text' || !item.identifier || !formResponse) {
        return null;
      }

      return (
        <tr key={item.identifier}>
          <th scope="row" className="pe-2">
            {humanize(item.identifier)}
          </th>
          <td className="col-md-9">
            <FormItemDisplay
              formItem={item}
              convention={data!.convention!}
              value={formResponse.form_response_attrs[item.identifier]}
              displayMode="admin"
            />
          </td>
        </tr>
      );
    });

  const renderUserAdminSection = () => {
    const { ability } = data!.myProfile!;

    return (
      <div className="card my-4 mt-lg-0">
        <div className="card-header">User administration</div>
        <ul className="list-group list-group-flush">
          {ability?.can_update_user_con_profile ? (
            <li className="list-group-item">
              <Link to={`/user_con_profiles/${userConProfileId}/edit`}>Edit profile</Link>
            </li>
          ) : null}
          <li className="list-group-item">
            <a
              href={`/reports/user_con_profiles/${userConProfileId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Printable report
            </a>
          </li>
          {ability?.can_become_user_con_profile ? (
            <li className="list-group-item">
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() =>
                  confirm({
                    prompt: `Are you sure you want to become ${
                      data!.userConProfile.name
                    } for the duration of this session?`,
                    action: becomeUser,
                  })
                }
              >
                Become user
              </button>
            </li>
          ) : null}
          {ability?.can_delete_user_con_profile ? (
            <li className="list-group-item">
              <button
                type="button"
                className="btn btn-link p-0 text-danger"
                onClick={() =>
                  confirm({
                    prompt: `Are you sure you want to remove ${data!.userConProfile.name} from ${
                      data!.convention!.name
                    }?`,
                    action: deleteConfirmed,
                    renderError: (deleteError) => <ErrorDisplay graphQLError={deleteError} />,
                  })
                }
              >
                Delete
              </button>
            </li>
          ) : null}
        </ul>
      </div>
    );
  };

  const renderSignupsSection = () => {
    if (!data?.myProfile?.ability?.can_read_signups) {
      return null;
    }

    return <UserConProfileSignupsCard userConProfileId={data.userConProfile.id} />;
  };

  if (loading) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <div className="row">
      <div className="col-lg-9">
        <header className="d-flex align-items-center mb-4">
          <div className="me-2">
            <Gravatar
              url={data!.userConProfile.gravatar_url}
              enabled={data!.userConProfile.gravatar_enabled}
              pixelSize={40}
            />
          </div>
          <div>
            <h1 className="mb-0">{data!.userConProfile.name}</h1>
          </div>
        </header>
        <table className="table table-sm table-striped my-4">
          <tbody>
            <tr>
              <th scope="row" className="pe-2">
                Email
              </th>
              <td className="col-md-9">{data!.userConProfile.email}</td>
            </tr>

            {renderFormItems()}

            {/* TODO maybe add staff positions and/or permissions here */}
          </tbody>
        </table>

        {data!.convention!.ticket_mode !== 'disabled' && (
          <TicketAdminSection
            userConProfile={data!.userConProfile}
            convention={data!.convention!}
          />
        )}
      </div>

      <div className="col-lg-3">
        {renderUserAdminSection()}
        {renderSignupsSection()}
      </div>
    </div>
  );
}

export default UserConProfileAdminDisplay;
