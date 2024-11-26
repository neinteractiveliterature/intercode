import { Suspense, useMemo, useState } from 'react';
import { ActionFunction, Link, replace, useFetcher, useParams, useRouteLoaderData } from 'react-router';
import {
  useConfirm,
  useModal,
  ErrorDisplay,
  BootstrapFormTextarea,
  LoadingIndicator,
} from '@neinteractiveliterature/litform';
import upperFirst from 'lodash/upperFirst';

import FormItemDisplay from '../FormPresenter/ItemDisplays/FormItemDisplay';
import TicketAdminSection from './TicketAdminSection';
import UserConProfileSignupsCard from '../EventsApp/SignupAdmin/UserConProfileSignupsCard';
import usePageTitle from '../usePageTitle';
import Gravatar from '../Gravatar';
import { UserConProfileAdminQueryData } from './queries.generated';
import deserializeFormResponse from '../Models/deserializeFormResponse';
import { getSortedParsedFormItems } from '../Models/Form';
import humanize from '../humanize';
import Modal from 'react-bootstrap4-modal';
import useAsyncFunction from '../useAsyncFunction';
import { Trans, useTranslation } from 'react-i18next';
import { NamedRoute } from '../routes';
import { client } from 'useIntercodeApolloClient';
import { DeleteUserConProfileDocument } from './mutations.generated';
import invariant from 'tiny-invariant';
import { UserConProfile } from 'graphqlTypes.generated';

export const action: ActionFunction = async ({ request, params: { id } }) => {
  invariant(id != null);
  try {
    if (request.method === 'DELETE') {
      await client.mutate({
        mutation: DeleteUserConProfileDocument,
        variables: { userConProfileId: id },
        update: (cache) => {
          cache.modify<UserConProfile>({
            id: cache.identify({ __typename: 'UserConProfile', id }),
            fields: (value, { DELETE }) => DELETE,
          });
        },
      });
      return replace('/user_con_profiles');
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

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
  const { t } = useTranslation();
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
      <div className="modal-header">{t('admin.userConProfiles.becomeUser.title')}</div>
      <div className="modal-body">
        <p>
          <Trans i18nKey="admin.userConProfiles.becomeUser.prompt" values={{ name: userConProfileName }} />
        </p>

        <BootstrapFormTextarea
          label={t('admin.userConProfiles.becomeUser.justificationLabel')}
          helpText={t('admin.userConProfiles.becomeUser.justificationHelpText')}
          value={justification}
          onTextChange={setJustification}
        />

        <ErrorDisplay stringError={error?.message} />
      </div>
      <div className="modal-footer">
        <button disabled={inProgress} onClick={close} type="button" className="btn btn-secondary">
          {t('buttons.cancel')}
        </button>
        {userConProfileId && (
          <button disabled={inProgress} onClick={becomeClicked} type="button" className="btn btn-primary">
            {t('admin.userConProfiles.becomeUser.buttonText')}
          </button>
        )}
      </div>
    </Modal>
  );
}

function UserConProfileAdminDisplay(): JSX.Element {
  const { t } = useTranslation();
  const userConProfileId = useParams<{ id: string }>().id;
  if (userConProfileId == null) {
    throw new Error('userConProfileId not found in params');
  }
  const data = useRouteLoaderData(NamedRoute.AdminUserConProfile) as UserConProfileAdminQueryData;
  const formItems = useMemo(() => getSortedParsedFormItems(data.convention.user_con_profile_form), [data]);
  const formResponse = useMemo(() => deserializeFormResponse(data.convention.user_con_profile), [data]);
  const confirm = useConfirm();
  const becomeUserModal = useModal<{ userConProfileId: string; userConProfileName: string }>();
  const fetcher = useFetcher();

  usePageTitle(data.convention.user_con_profile.name);

  const deleteConfirmed = () => {
    fetcher.submit(null, { method: 'DELETE' });
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
        <div className="card-header">{t('admin.userConProfiles.adminSection.title')}</div>
        <ul className="list-group list-group-flush">
          {ability?.can_update_user_con_profile ? (
            <li className="list-group-item">
              <Link to={`/user_con_profiles/${userConProfileId}/edit`}>
                {t('admin.userConProfiles.adminSection.editProfile')}
              </Link>
            </li>
          ) : null}
          <li className="list-group-item">
            <a href={`/reports/user_con_profiles/${userConProfileId}`} target="_blank" rel="noopener noreferrer">
              {t('admin.userConProfiles.adminSection.printableReport')}
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
                {t('admin.userConProfiles.adminSection.becomeUser')}
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
                    prompt: t('admin.userConProfiles.deleteConfirmation', {
                      name: data?.convention.user_con_profile.name,
                      convention: data?.convention.name,
                    }),
                    action: deleteConfirmed,
                    renderError: (deleteError) => <ErrorDisplay graphQLError={deleteError} />,
                  })
                }
              >
                {t('buttons.delete')}
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

  if (!data) {
    return <ErrorDisplay stringError={t('errors.noData')} />;
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
                {t('admin.userConProfiles.email')}
              </th>
              <td className="col-md-9">{data.convention.user_con_profile.email}</td>
            </tr>

            {renderFormItems()}

            {/* TODO maybe add staff positions and/or permissions here */}
          </tbody>
        </table>

        {data.convention.ticket_mode !== 'disabled' && (
          <Suspense fallback={<LoadingIndicator />}>
            <TicketAdminSection userConProfile={data.convention.user_con_profile} convention={data.convention} />
          </Suspense>
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
