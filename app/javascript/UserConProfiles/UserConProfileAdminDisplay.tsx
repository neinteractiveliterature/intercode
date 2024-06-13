import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  useConfirm,
  useModal,
  ErrorDisplay,
  PageLoadingIndicator,
  BootstrapFormTextarea,
} from '@neinteractiveliterature/litform';
import upperFirst from 'lodash/upperFirst';

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
import humanize from '../humanize';
import Modal from 'react-bootstrap4-modal';
import useAsyncFunction from '../useAsyncFunction';

async function becomeUser(userConProfileId: string, justification: string) {
  const formData = new FormData();
  formData.append('justification', justification);

  const response = await fetch(`/user_con_profiles/${userConProfileId}/become`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
    body: formData,
  });

  if (!response.ok) {
    const json = await response.json();
    throw new Error(
      Object.entries(json.errors)
        .map(([key, error]) => `${upperFirst(key)} ${error}`)
        .join(', '),
    );
  }

  window.location.href = '/';
}

type BecomeUserModalProps = {
  visible: boolean;
  close: () => void;
  userConProfileId?: string;
  userConProfileName?: string;
};

function BecomeUserModal({ userConProfileId, userConProfileName, visible, close }: BecomeUserModalProps): JSX.Element {
  const [justification, setJustification] = useState('');
  const [becomeAsync, error, inProgress] = useAsyncFunction(becomeUser);

  const becomeClicked = async () => {
    if (userConProfileId == null) {
      return;
    }

    await becomeAsync(userConProfileId, justification);
    close();
  };

  return (
    <Modal visible={visible}>
      <div className="modal-header">Become user</div>
      <div className="modal-body">
        <p>
          Are you sure you want to become {userConProfileName} for the duration of this session?{' '}
          <strong>
            Your actions while acting as this user will be logged, and the web site administrators may review this log
            for audit purposes.
          </strong>
        </p>

        <BootstrapFormTextarea
          label="Justification"
          helpText="Please enter the reason why you’re temporarily becoming this user.  For example: user requested signup assistance, troubleshooting, etc."
          value={justification}
          onTextChange={setJustification}
        />

        <ErrorDisplay stringError={error?.message} />
      </div>
      <div className="modal-footer">
        <button disabled={inProgress} onClick={close} type="button" className="btn btn-secondary">
          Cancel
        </button>
        {userConProfileId && (
          <button disabled={inProgress} onClick={becomeClicked} type="button" className="btn btn-primary">
            Become user
          </button>
        )}
      </div>
    </Modal>
  );
}

function UserConProfileAdminDisplay(): JSX.Element {
  const userConProfileId = useParams<{ id: string }>().id;
  if (userConProfileId == null) {
    throw new Error('userConProfileId not found in params');
  }
  const navigate = useNavigate();
  const { data, loading, error } = useUserConProfileAdminQuery({
    variables: { id: userConProfileId },
  });
  const formItems = useMemo(
    () => (loading || error || !data ? [] : getSortedParsedFormItems(data.convention.user_con_profile_form)),
    [data, loading, error],
  );
  const formResponse = useMemo(
    () => (loading || error || !data ? null : deserializeFormResponse(data.convention.user_con_profile)),
    [data, loading, error],
  );
  const confirm = useConfirm();
  const [deleteUserConProfile] = useDeleteUserConProfileMutation();
  const becomeUserModal = useModal<{ userConProfileId: string; userConProfileName: string }>();

  usePageTitle(useValueUnless(() => data?.convention.user_con_profile.name, error || loading));

  const deleteConfirmed = async () => {
    if (!data) {
      return;
    }
    await deleteUserConProfile({
      variables: { userConProfileId: data.convention.user_con_profile.id },
    });
    navigate('/user_con_profiles', { replace: true });
  };

  const renderFormItems = () =>
    formItems.map((item) => {
      if (!data || item.item_type === 'static_text' || !item.identifier || !formResponse) {
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
              convention={data.convention}
              value={formResponse.form_response_attrs[item.identifier]}
              displayMode="admin"
            />
          </td>
        </tr>
      );
    });

  const renderUserAdminSection = () => {
    const ability = data?.convention.my_profile?.ability;

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
            <a href={`/reports/user_con_profiles/${userConProfileId}`} target="_blank" rel="noopener noreferrer">
              Printable report
            </a>
          </li>
          {ability?.can_become_user_con_profile ? (
            <li className="list-group-item">
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() =>
                  becomeUserModal.open({
                    userConProfileId,
                    userConProfileName: data?.convention.user_con_profile.name ?? 'this user',
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
                    prompt: `Are you sure you want to remove ${data?.convention.user_con_profile.name} from ${data?.convention.name}?`,
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

        <BecomeUserModal
          visible={becomeUserModal.visible}
          close={becomeUserModal.close}
          userConProfileId={becomeUserModal.state?.userConProfileId}
          userConProfileName={becomeUserModal.state?.userConProfileName}
        />
      </div>
    );
  };

  const renderSignupsSection = () => {
    if (!data?.convention.my_profile?.ability?.can_read_signups) {
      return null;
    }

    return <UserConProfileSignupsCard userConProfileId={data.convention.user_con_profile.id} showWithdrawFromAll />;
  };

  if (loading) {
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!data) {
    return <ErrorDisplay stringError="No data returned for query" />;
  }

  return (
    <div className="row">
      <div className="col-lg-9">
        <header className="d-flex align-items-center mb-4">
          <div className="me-2">
            <Gravatar
              url={data.convention.user_con_profile.gravatar_url}
              enabled={data.convention.user_con_profile.gravatar_enabled}
              pixelSize={40}
            />
          </div>
          <div>
            <h1 className="mb-0">{data.convention.user_con_profile.name}</h1>
          </div>
        </header>
        <table className="table table-sm table-striped my-4">
          <tbody>
            <tr>
              <th scope="row" className="pe-2">
                Email
              </th>
              <td className="col-md-9">{data.convention.user_con_profile.email}</td>
            </tr>

            {renderFormItems()}

            {/* TODO maybe add staff positions and/or permissions here */}
          </tbody>
        </table>

        {data.convention.ticket_mode !== 'disabled' && (
          <TicketAdminSection userConProfile={data.convention.user_con_profile} convention={data.convention} />
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
