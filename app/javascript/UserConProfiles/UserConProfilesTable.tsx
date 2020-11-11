import { useContext, useMemo } from 'react';
import { Link, Route, useHistory } from 'react-router-dom';
import { humanize } from 'inflected';
import moment, { Moment } from 'moment-timezone';
import { Column, CellProps, FilterProps } from 'react-table';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import AddAttendeeModal from './AddAttendeeModal';
import BooleanCell from '../Tables/BooleanCell';
import BooleanChoiceSetFilter from '../Tables/BooleanChoiceSetFilter';
import { buildFieldFilterCodecs, FilterCodecs } from '../Tables/FilterUtils';
import ChoiceSetFilter from '../Tables/ChoiceSetFilter';
import EmailCell from '../Tables/EmailCell';
import formatMoney from '../formatMoney';
import FormItemDisplay from '../FormPresenter/ItemDisplays/FormItemDisplay';
import FreeTextFilter from '../Tables/FreeTextFilter';
import useReactTableWithTheWorks, {
  createQueryDataContext,
} from '../Tables/useReactTableWithTheWorks';
import TableHeader from '../Tables/TableHeader';
import UserConProfileWithGravatarCell from '../Tables/UserConProfileWithGravatarCell';
import {
  UserConProfilesTableUserConProfilesQueryQuery,
  useUserConProfilesTableUserConProfilesQueryQuery,
  UserConProfilesTableUserConProfilesQueryQueryVariables,
} from './queries.generated';
import { FormItemValueType, TypedFormItem } from '../FormAdmin/FormItemUtils';
import { getSortedParsedFormItems } from '../Models/Form';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';

type UserConProfilesTableRow = NonNullable<
  UserConProfilesTableUserConProfilesQueryQuery['convention']
>['user_con_profiles_paginated']['entries'][0];

type UserConProfilesTableFormItem = NonNullable<
  UserConProfilesTableUserConProfilesQueryQuery['convention']
>['user_con_profile_form']['form_sections'][0]['form_items'][0];

const UserConProfilesTableQueryDataContext = createQueryDataContext<
  UserConProfilesTableUserConProfilesQueryQuery
>();

const { encodeFilterValue, decodeFilterValue } = buildFieldFilterCodecs({
  ticket: FilterCodecs.stringArray,
  ticket_type: FilterCodecs.stringArray,
  privileges: FilterCodecs.stringArray,
  attending: FilterCodecs.boolean,
  is_team_member: FilterCodecs.boolean,
  payment_amount: FilterCodecs.float,
});

type TicketStatusCellProps = {
  value: UserConProfilesTableRow['ticket'];
};

function TicketStatusCell({ value }: TicketStatusCellProps) {
  const { t } = useTranslation();

  if (!value) {
    return <>{t('tables.ticketStatus.unpaid', 'Unpaid')}</>;
  }

  return <>{humanize(value.ticket_type.name)}</>;
}

type TicketPaymentAmountCellProps = {
  value: UserConProfilesTableRow['ticket'];
};

function TicketPaymentAmountCell({ value }: TicketPaymentAmountCellProps) {
  return <>{formatMoney(value?.order_entry?.price_per_item)}</>;
}

type TicketStatusWithPaymentAmountCellProps = {
  value: UserConProfilesTableRow['ticket'];
};

function TicketStatusWithPaymentAmountCell({ value }: TicketStatusWithPaymentAmountCellProps) {
  return (
    <>
      <TicketStatusCell value={value} /> <TicketPaymentAmountCell value={value} />
    </>
  );
}

const TicketTypeFilter = (props: FilterProps<UserConProfilesTableRow>) => {
  const { t } = useTranslation();
  const data = useContext(UserConProfilesTableQueryDataContext);
  const choices = useMemo(
    () =>
      data
        ? [
            { label: t('tables.ticketStatus.unpaid', 'Unpaid'), value: 'none' },
            ...data.convention!.ticket_types.map((ticketType) => ({
              label: humanize(ticketType.name),
              value: ticketType.id.toString(),
            })),
          ]
        : [],
    [data, t],
  );

  return <ChoiceSetFilter {...props} choices={choices} multiple />;
};

const PrivilegesCell = ({ row: { original } }: CellProps<UserConProfilesTableRow>) => {
  const { t } = useTranslation();
  if (original.site_admin) {
    return <>{t('tables.privileges.siteAdmin', 'Global admin')}</>;
  }

  return <></>;
};

const PrivilegesFilter = (props: FilterProps<UserConProfilesTableRow>) => {
  const { t } = useTranslation();
  return (
    <ChoiceSetFilter
      {...props}
      choices={[{ label: t('tables.privileges.siteAdmin', 'Global admin'), value: 'site_admin' }]}
      multiple
    />
  );
};

function getPossibleColumns(
  data: UserConProfilesTableUserConProfilesQueryQuery,
  t: TFunction,
  formItems: TypedFormItem[],
): Column<UserConProfilesTableRow>[] {
  const columns: Column<UserConProfilesTableRow>[] = [
    {
      Header: <>{t('admin.userConProfiles.id', 'ID')}</>,
      id: 'id',
      accessor: 'id',
      width: 70,
    },
    {
      Header: <>{t('admin.userConProfiles.userId', 'User ID')}</>,
      id: 'user_id',
      accessor: (userConProfile) => userConProfile.user_id,
      width: 70,
    },
    {
      Header: <>{t('admin.userConProfiles.name', 'Name')}</>,
      id: 'name',
      accessor: (userConProfile) => userConProfile,
      disableFilters: false,
      disableSortBy: false,
      Filter: FreeTextFilter,
      Cell: UserConProfileWithGravatarCell,
    },
    {
      Header: <>{t('admin.userConProfiles.firstName', 'First name')}</>,
      id: 'first_name',
      accessor: 'first_name',
      disableFilters: false,
      disableSortBy: false,
      Filter: FreeTextFilter,
    },
    {
      Header: <>{t('admin.userConProfiles.lastName', 'Last name')}</>,
      id: 'last_name',
      accessor: 'last_name',
      disableFilters: false,
      disableSortBy: false,
      Filter: FreeTextFilter,
    },
    {
      Header: <>{t('admin.userConProfiles.email', 'Email')}</>,
      id: 'email',
      accessor: 'email',
      disableFilters: false,
      disableSortBy: false,
      Cell: EmailCell,
      Filter: FreeTextFilter,
    },
    ...(data.convention!.ticket_mode === 'disabled'
      ? []
      : [
          {
            Header: <>{humanize(data.convention!.ticket_name || 'ticket')}</>,
            id: 'ticket',
            accessor: 'ticket' as const,
            width: 150,
            disableFilters: false,
            disableSortBy: false,
            Cell: TicketStatusWithPaymentAmountCell,
            Filter: TicketTypeFilter,
          },
          {
            Header: (
              <>
                {t('admin.userConProfiles.ticketType', '{{ ticketName }} type', {
                  ticketName: humanize(data.convention!.ticket_name || 'ticket'),
                })}
              </>
            ),
            id: 'ticket_type',
            accessor: 'ticket' as const,
            width: 150,
            disableFilters: false,
            disableSortBy: false,
            Cell: TicketStatusCell,
            Filter: TicketTypeFilter,
          },
          {
            Header: <>{t('admin.userConProfiles.paymentAmount', 'Payment amount')}</>,
            id: 'payment_amount',
            accessor: 'ticket' as const,
            width: 150,
            disableFilters: false,
            disableSortBy: false,
            Cell: TicketPaymentAmountCell,
            Filter: FreeTextFilter,
          },
        ]),
    {
      Header: <>{t('admin.userConProfiles.isTeamMember', 'Event team member?')}</>,
      id: 'is_team_member',
      accessor: (userConProfile: UserConProfilesTableRow) => userConProfile.team_members.length > 0,
      width: 150,
      disableFilters: false,
      Cell: BooleanCell,
      Filter: BooleanChoiceSetFilter,
    },
    {
      Header: <>{t('admin.userConProfiles.isAttending', 'Attending?')}</>,
      id: 'attending',
      accessor: 'ticket',
      width: 150,
      disableFilters: false,
      Cell: BooleanCell,
      Filter: BooleanChoiceSetFilter,
    },
    ...(data.convention!.ticket_mode === 'disabled'
      ? []
      : [
          {
            Header: (
              <>
                {t(
                  'admin.userConProfiles.ticketStatusChangedAt',
                  '{{ ticketName }} status changed',
                  { ticketName: humanize(data.convention!.ticket_name || 'ticket') },
                )}
              </>
            ),
            id: 'ticket_updated_at',
            accessor: (userConProfile: UserConProfilesTableRow) =>
              userConProfile.ticket ? moment(userConProfile.ticket.updated_at) : null,
            disableSortBy: false,
            Cell: ({ value }: { value: Moment | null }) =>
              value ? value.format('MMM D, YYYY H:mma') : null,
          },
        ]),
    {
      Header: <>{t('admin.userConProfiles.privileges', 'Privileges')}</>,
      id: 'privileges',
      accessor: (row: UserConProfilesTableRow) => row,
      disableFilters: false,
      disableSortBy: false,
      Cell: PrivilegesCell,
      Filter: PrivilegesFilter,
    },
    {
      Header: <>{t('admin.userConProfiles.orderSummary', 'Order summary')}</>,
      id: 'order_summary',
      accessor: 'order_summary',
    },
  ];

  formItems.forEach((formItem) => {
    const { identifier } = formItem;
    if (
      !identifier ||
      identifier === 'first_name' ||
      identifier === 'last_name' ||
      columns.some((column) => column.id === identifier)
    ) {
      return;
    }

    const FormItemCell = ({ value }: { value: FormItemValueType<TypedFormItem> }) => (
      <FormItemDisplay
        formItem={formItem}
        value={value}
        convention={data.convention!}
        displayMode="admin"
      />
    );

    columns.push({
      Header: formItem.admin_description || humanize(identifier),
      id: identifier,
      accessor: (userConProfile) =>
        JSON.parse(userConProfile.form_response_attrs_json ?? '{}')[identifier],
      Cell: FormItemCell,
    });
  });

  return columns;
}

export type UserConProfilesTableProps = {
  defaultVisibleColumns?: string[];
};

function UserConProfilesTable({ defaultVisibleColumns }: UserConProfilesTableProps) {
  const { t } = useTranslation();
  const history = useHistory();
  const getPossibleColumnsWithTranslation = useMemo(
    () => (data: UserConProfilesTableUserConProfilesQueryQuery) =>
      getPossibleColumns(data, t, getSortedParsedFormItems(data.convention!.user_con_profile_form)),
    [t],
  );
  const { tableInstance, loading, tableHeaderProps, queryData } = useReactTableWithTheWorks<
    UserConProfilesTableUserConProfilesQueryQuery,
    UserConProfilesTableRow,
    UserConProfilesTableUserConProfilesQueryQueryVariables
  >({
    decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue,
    getData: ({ data }) => data!.convention!.user_con_profiles_paginated.entries,
    getPages: ({ data }) => data!.convention!.user_con_profiles_paginated.total_pages,
    getPossibleColumns: getPossibleColumnsWithTranslation,
    useQuery: useUserConProfilesTableUserConProfilesQueryQuery,
    storageKeyPrefix: 'userConProfiles',
  });

  return (
    <UserConProfilesTableQueryDataContext.Provider value={queryData}>
      <div className="mb-4">
        <TableHeader
          {...tableHeaderProps}
          exportUrl="/csv_exports/user_con_profiles"
          renderLeftContent={() =>
            queryData && (queryData.currentAbility || {}).can_create_user_con_profiles ? (
              <Link to="/user_con_profiles/new" className="btn btn-primary ml-2 mb-2">
                <i className="fa fa-plus" />{' '}
                {t('admin.userConProfiles.addAttendee.buttonText', 'Add attendee')}
              </Link>
            ) : null
          }
        />

        <ReactTableWithTheWorks
          tableInstance={tableInstance}
          loading={loading}
          onClickRow={(row) => {
            history.push(`/user_con_profiles/${row.original.id}`);
          }}
        />

        <Route path="/user_con_profiles/new">
          {({ match }) => (
            <AddAttendeeModal
              conventionName={(queryData && (queryData.convention || {}).name) || ''}
              visible={match != null}
            />
          )}
        </Route>
      </div>
    </UserConProfilesTableQueryDataContext.Provider>
  );
}

export default UserConProfilesTable;
