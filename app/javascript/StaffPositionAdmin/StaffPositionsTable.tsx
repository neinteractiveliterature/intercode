import { Fragment, useContext, useMemo, useState } from 'react';
import { Link, LoaderFunction, useFetcher, useLoaderData } from 'react-router';
import groupBy from 'lodash/groupBy';
import flatMap from 'lodash/flatMap';
import { assertNever } from 'assert-never';
import { useConfirm, ErrorDisplay, sortByLocaleString, DisclosureTriangle } from '@neinteractiveliterature/litform';

import PermissionNames from '../../../config/permission_names.json';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import usePageTitle from '../usePageTitle';
import { joinReact } from '../RenderingUtils';
import Gravatar from '../Gravatar';
import AppRootContext from '../AppRootContext';
import { DropdownMenu } from '../UIComponents/DropdownMenu';
import { StaffPositionsQueryData, StaffPositionsQueryDocument } from './queries.generated';
import { PolymorphicPermission } from '../Permissions/PermissionUtils';
import { client } from '../useIntercodeApolloClient';

type UserConProfilesListProps = {
  userConProfiles: StaffPositionsQueryData['convention']['staff_positions'][0]['user_con_profiles'];
};

function UserConProfilesList({ userConProfiles }: UserConProfilesListProps) {
  const [expanded, setExpanded] = useState(false);
  const userConProfilesSorted = useMemo(
    () => sortByLocaleString(userConProfiles, (ucp) => ucp.name_without_nickname),
    [userConProfiles],
  );

  const fullList = userConProfilesSorted.map((ucp) => (
    <span key={ucp.id} className="text-nowrap">
      <Gravatar enabled={ucp.gravatar_enabled} url={ucp.gravatar_url} imgClassName="align-baseline" pixelSize={16} />{' '}
      {ucp.name_without_nickname}
    </span>
  ));

  if (userConProfiles.length < 3) {
    return <>{joinReact(fullList, ', ')}</>;
  }

  return (
    <>
      <button
        className="hidden-button text-start"
        type="button"
        onClick={() => setExpanded((prevExpanded) => !prevExpanded)}
      >
        <DisclosureTriangle expanded={expanded} /> {joinReact(fullList.slice(0, 2), ', ')}
        {expanded ? ', ' : <>&hellip;</>}
      </button>
      {expanded && joinReact(fullList.slice(2), ', ')}
    </>
  );
}

function describePermissionAbilities(modelPermissions: Pick<PolymorphicPermission, 'model' | 'permission'>[]) {
  const typename = modelPermissions[0].model.__typename;
  const permissionNameGroups = PermissionNames.filter((group) => group.model_type === typename);
  const permissionNamesForType = flatMap(permissionNameGroups, (group) => group.permissions);
  const abilities = permissionNamesForType.reduce((acc, { permission, name }) => {
    if (modelPermissions.some((modelPermission) => modelPermission.permission === permission)) {
      return [...acc, name];
    }

    return acc;
  }, []);

  if (abilities.length === permissionNamesForType.length) {
    return 'full admin';
  }

  return abilities.join(', ');
}

function describePermissionModel(
  model: StaffPositionsQueryData['convention']['staff_positions'][0]['permissions'][0]['model'],
) {
  switch (model.__typename) {
    case 'CmsContentGroup':
      return (
        <span className="text-nowrap">
          <span className="badge bg-secondary">CMS content</span>
          &nbsp;
          {model.name}
        </span>
      );
    case 'Convention':
      return <strong className="text-nowrap">{model.name}</strong>;
    case 'EventCategory':
      return (
        <span className="px-1 rounded" style={getEventCategoryStyles({ eventCategory: model, variant: 'default' })}>
          {model.name}
        </span>
      );
    default:
      assertNever(model, true);
      return `${model.__typename} ${model.id}`;
  }
}

type PermissionsDescriptionProps = {
  permissions: StaffPositionsQueryData['convention']['staff_positions'][0]['permissions'];
};

function PermissionsDescription({ permissions }: PermissionsDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const descriptions = useMemo(() => {
    const permissionsByModel = groupBy(permissions, ({ model }) => [model.__typename, model.id]);
    return Object.entries(permissionsByModel).map(([, modelPermissions]) => {
      const { model } = modelPermissions[0];
      return {
        key: `${model.__typename}-${model.id}`,
        model: describePermissionModel(model),
        abilities: describePermissionAbilities(modelPermissions),
      };
    });
  }, [permissions]);

  if (permissions.length === 0) {
    return <></>;
  }

  return (
    <>
      <button
        className="hidden-button text-start"
        type="button"
        onClick={() => setExpanded((prevExpanded) => !prevExpanded)}
      >
        <DisclosureTriangle expanded={expanded} />{' '}
        {joinReact(
          descriptions.map(({ key, model }) => <Fragment key={key}>{model}</Fragment>),
          ', ',
        )}
      </button>
      {expanded && (
        <ul className="list-unstyled">
          {descriptions.map(({ key, model, abilities }) => (
            <li key={key}>
              {model}
              {': '}
              {abilities}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export async function loader() {
  const { data } = await client.query<StaffPositionsQueryData>({ query: StaffPositionsQueryDocument });
  return data;
}

function StaffPositionsTable() {
  const data = useLoaderData() as StaffPositionsQueryData;
  const { conventionDomain } = useContext(AppRootContext);
  const confirm = useConfirm();
  const fetcher = useFetcher();

  usePageTitle('Staff positions');

  const renderRow = (staffPosition: StaffPositionsQueryData['convention']['staff_positions'][0]) => (
    <tr key={staffPosition.id}>
      <td>{staffPosition.name}</td>
      <td>{staffPosition.visible ? <i className="bi-check" /> : null}</td>
      <td>
        <UserConProfilesList userConProfiles={staffPosition.user_con_profiles} />
      </td>
      <td>
        <PermissionsDescription permissions={staffPosition.permissions} />
      </td>
      <td>
        {staffPosition.email}
        <ul className="list-unstyled">
          {staffPosition.email_aliases.map((alias) => (
            <li key={alias} className="text-nowrap">
              <strong>Alias:</strong> {alias}@{conventionDomain}
            </li>
          ))}
          {staffPosition.cc_addresses.map((ccAddress) => (
            <li key={ccAddress} className="text-nowrap">
              <strong>CC:</strong> {ccAddress}
            </li>
          ))}
        </ul>
      </td>
      <td>
        <DropdownMenu
          buttonClassName="btn btn-sm btn-primary"
          buttonContent={
            <>
              <i className="bi-three-dots" />
              <span className="visually-hidden">Options</span>
            </>
          }
          popperOptions={{ placement: 'bottom-end' }}
        >
          <Link to={`/staff_positions/${staffPosition.id}/edit`} className="dropdown-item">
            Edit settings
          </Link>
          <Link to={`/staff_positions/${staffPosition.id}/edit_permissions`} className="dropdown-item">
            Edit permissions
          </Link>
          <button
            className="dropdown-item cursor-pointer text-danger"
            type="button"
            onClick={() =>
              confirm({
                prompt: `Are you sure you want to delete the staff position ${staffPosition.name}?`,
                action: () => fetcher.submit({}, { action: `/staff_positions/${staffPosition.id}`, method: 'DELETE' }),
                renderError: (e) => <ErrorDisplay graphQLError={e} />,
              })
            }
          >
            Delete
          </button>
        </DropdownMenu>
      </td>
    </tr>
  );

  const staffPositions = data?.convention.staff_positions ?? [];
  const sortedStaffPositions = sortByLocaleString(staffPositions, (position) => position.name);

  return (
    <div>
      <h1 className="mb-4">Staff positions</h1>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Visible</th>
            <th>People</th>
            <th>Permissions</th>
            <th>Email</th>
            <th />
          </tr>
        </thead>

        <tbody>{sortedStaffPositions.map(renderRow)}</tbody>
      </table>

      <Link to="/staff_positions/new" className="btn btn-primary">
        New Staff Position
      </Link>
    </div>
  );
}

export default StaffPositionsTable;
