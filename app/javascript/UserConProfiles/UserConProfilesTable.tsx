import { useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import { CellContext, Column, ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import BooleanCell from '../Tables/BooleanCell';
import BooleanChoiceSetFilter from '../Tables/BooleanChoiceSetFilter';
import { buildFieldFilterCodecs, FilterCodecs } from '../Tables/FilterUtils';
import ChoiceSetFilter from '../Tables/ChoiceSetFilter';
import EmailCell from '../Tables/EmailCell';
import formatMoney from '../formatMoney';
import FormItemDisplay from '../FormPresenter/ItemDisplays/FormItemDisplay';
import FreeTextFilter from '../Tables/FreeTextFilter';
import useReactTableWithTheWorks, { createQueryDataContext } from '../Tables/useReactTableWithTheWorks';
import TableHeader from '../Tables/TableHeader';
import UserConProfileWithGravatarCell from '../Tables/UserConProfileWithGravatarCell';
import {
  AttendeesPageQueryData,
  UserConProfilesTableUserConProfilesQueryData,
  UserConProfilesTableUserConProfilesQueryDocument,
  UserConProfilesTableUserConProfilesQueryVariables,
} from './queries.generated';
import { FormItemValueType, TypedFormItem } from '../FormAdmin/FormItemUtils';
import { getSortedParsedFormItems } from '../Models/Form';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';
import { formatLCM, getDateTimeFormat } from '../TimeUtils';
import AppRootContext from '../AppRootContext';
import humanize from '../humanize';
import { TicketMode } from 'graphqlTypes.generated';

type UserConProfilesTableRow = NonNullable<
  UserConProfilesTableUserConProfilesQueryData['convention']
>['user_con_profiles_paginated']['entries'][0];

const UserConProfilesTableQueryDataContext = createQueryDataContext<UserConProfilesTableUserConProfilesQueryData>();

const { encodeFilterValue, decodeFilterValue } = buildFieldFilterCodecs({
  ticket: FilterCodecs.stringArray,
  ticket_type: FilterCodecs.stringArray,
  privileges: FilterCodecs.stringArray,
  attending: FilterCodecs.boolean,
  is_team_member: FilterCodecs.boolean,
  payment_amount: FilterCodecs.float,
});

function TicketStatusCell<TData, TValue extends UserConProfilesTableRow['ticket']>({
  getValue,
}: CellContext<TData, TValue>): JSX.Element {
  const { t } = useTranslation();
  const value = getValue();

  if (!value) {
    return <>{t('tables.ticketStatus.unpaid')}</>;
  }

  return <>{humanize(value.ticket_type.name)}</>;
}

function TicketPaymentAmountCell<TData, TValue extends UserConProfilesTableRow['ticket']>({
  getValue,
}: CellContext<TData, TValue>): JSX.Element {
  return <>{formatMoney(getValue()?.order_entry?.price_per_item)}</>;
}

function TicketStatusWithPaymentAmountCell<TData, TValue extends UserConProfilesTableRow['ticket']>(
  props: CellContext<TData, TValue>,
): JSX.Element {
  return (
    <>
      <TicketStatusCell {...props} /> <TicketPaymentAmountCell {...props} />
    </>
  );
}

function TicketStatusChangeCell<TData, TValue extends DateTime | null | undefined>({
  getValue,
}: CellContext<TData, TValue>): JSX.Element {
  const { t } = useTranslation();
  const value = getValue();

  return <>{value ? formatLCM(value, getDateTimeFormat('shortDateTime', t)) : null}</>;
}

function TicketTypeFilter<TData extends UserConProfilesTableRow, TValue>({
  column,
  ticketTypes,
}: {
  column: Column<TData, TValue>;
  ticketTypes: AttendeesPageQueryData['convention']['ticket_types'];
}): JSX.Element {
  const { t } = useTranslation();
  const choices = useMemo(
    () => [
      { label: t('tables.ticketStatus.unpaid'), value: 'none' },
      ...ticketTypes.map((ticketType) => ({
        label: humanize(ticketType.name),
        value: ticketType.id.toString(),
      })),
    ],
    [t, ticketTypes],
  );

  return <ChoiceSetFilter column={column} choices={choices} multiple />;
}

function PrivilegesCell<TData extends UserConProfilesTableRow, TValue>({
  row: { original },
}: CellContext<TData, TValue>) {
  const { t } = useTranslation();
  if (original.site_admin) {
    return <>{t('tables.privileges.siteAdmin')}</>;
  }

  return <></>;
}

function PrivilegesFilter<TData extends UserConProfilesTableRow, TValue>({
  column,
}: {
  column: Column<TData, TValue>;
}) {
  const { t } = useTranslation();
  return (
    <ChoiceSetFilter
      column={column}
      choices={[{ label: t('tables.privileges.siteAdmin'), value: 'site_admin' }]}
      multiple
    />
  );
}

export type UserConProfilesTableProps = {
  defaultVisibleColumns?: string[];
  attendeesPageQueryData: AttendeesPageQueryData;
  canReadTickets: boolean;
};

function UserConProfilesTable({
  defaultVisibleColumns,
  attendeesPageQueryData,
  canReadTickets,
}: UserConProfilesTableProps): JSX.Element {
  const { timezoneName } = useContext(AppRootContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns = useMemo(() => {
    const formItems = getSortedParsedFormItems(attendeesPageQueryData.convention.user_con_profile_form);
    const columnHelper = createColumnHelper<UserConProfilesTableRow>();

    const columns: ColumnDef<UserConProfilesTableRow>[] = [
      columnHelper.accessor('id', {
        header: t('admin.userConProfiles.id'),
        id: 'id',
        size: 70,
      }),
      columnHelper.accessor('user_id', {
        header: t('admin.userConProfiles.userId'),
        id: 'user_id',
        size: 70,
      }),
      columnHelper.accessor((userConProfile) => userConProfile, {
        header: t('admin.userConProfiles.name'),
        id: 'name',
        enableColumnFilter: true,
        enableSorting: true,
        cell: UserConProfileWithGravatarCell,
      }),
      columnHelper.accessor('first_name', {
        header: t('admin.userConProfiles.firstName'),
        id: 'first_name',
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor('last_name', {
        header: t('admin.userConProfiles.lastName'),
        id: 'last_name',
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor('email', {
        header: t('admin.userConProfiles.email'),
        id: 'email',
        enableColumnFilter: true,
        enableSorting: true,
        cell: EmailCell,
      }),
    ];

    if (attendeesPageQueryData.convention.ticket_mode !== TicketMode.Disabled && canReadTickets) {
      columns.push(
        columnHelper.accessor('ticket', {
          header: humanize(attendeesPageQueryData.convention.ticket_name || 'ticket'),
          id: 'ticket',
          size: 150,
          enableColumnFilter: true,
          enableSorting: true,
          cell: TicketStatusWithPaymentAmountCell,
        }),
        columnHelper.accessor('ticket', {
          header: t('admin.userConProfiles.ticketType', {
            ticketName: humanize(attendeesPageQueryData.convention.ticket_name || 'ticket'),
          }),
          id: 'ticket_type',
          size: 150,
          enableColumnFilter: true,
          enableSorting: true,
          cell: TicketStatusCell,
        }),
        columnHelper.accessor('ticket', {
          header: t('admin.userConProfiles.paymentAmount'),
          id: 'payment_amount',
          size: 150,
          enableColumnFilter: true,
          enableSorting: true,
          cell: TicketPaymentAmountCell,
        }),
      );
    }

    columns.push(
      columnHelper.accessor((userConProfile) => userConProfile.team_members.length > 0, {
        header: t('admin.userConProfiles.isTeamMember'),
        id: 'is_team_member',
        size: 150,
        enableColumnFilter: true,
        cell: BooleanCell,
      }),
    );

    if (canReadTickets) {
      columns.push(
        columnHelper.accessor((userConProfile) => userConProfile.ticket != null, {
          header: t('admin.userConProfiles.isAttending'),
          id: 'attending',
          size: 150,
          enableColumnFilter: true,
          cell: BooleanCell,
        }),
      );
    }

    if (attendeesPageQueryData.convention.ticket_mode !== TicketMode.Disabled && canReadTickets) {
      columns.push(
        columnHelper.accessor(
          (userConProfile) =>
            userConProfile.ticket ? DateTime.fromISO(userConProfile.ticket.updated_at, { zone: timezoneName }) : null,
          {
            header: t('admin.userConProfiles.ticketStatusChangedAt', {
              ticketName: humanize(attendeesPageQueryData.convention.ticket_name || 'ticket'),
            }),
            id: 'ticket_updated_at',
            enableSorting: true,
            cell: TicketStatusChangeCell,
          },
        ),
      );
    }

    columns.push(
      columnHelper.accessor((row) => row, {
        header: t('admin.userConProfiles.privileges'),
        id: 'privileges',
        enableColumnFilter: true,
        enableSorting: true,
        cell: PrivilegesCell,
      }),
      columnHelper.accessor('order_summary', {
        header: t('admin.userConProfiles.orderSummary'),
        id: 'order_summary',
      }),
    );

    const existingColumnIds = new Set(columns.map((column) => column.id));
    formItems.forEach((formItem) => {
      const { identifier } = formItem;
      if (!identifier || existingColumnIds.has(identifier)) {
        return;
      }

      const FormItemCell = <TData, TValue extends FormItemValueType<TypedFormItem>>({
        getValue,
      }: CellContext<TData, TValue>) => (
        <FormItemDisplay
          formItem={formItem}
          value={getValue()}
          convention={attendeesPageQueryData.convention}
          displayMode="admin"
        />
      );

      columns.push(
        columnHelper.accessor(
          (userConProfile) => JSON.parse(userConProfile.form_response_attrs_json ?? '{}')[identifier],
          {
            header: formItem.admin_description || humanize(identifier),
            id: identifier,
            cell: FormItemCell,
          },
        ),
      );
    });

    return columns;
  }, [t, timezoneName, attendeesPageQueryData, canReadTickets]);

  const {
    table: tableInstance,
    loading,
    tableHeaderProps,
    queryData,
  } = useReactTableWithTheWorks<
    UserConProfilesTableUserConProfilesQueryData,
    UserConProfilesTableRow,
    UserConProfilesTableUserConProfilesQueryVariables
  >({
    decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue,
    getData: ({ data }) => data?.convention.user_con_profiles_paginated.entries,
    getPages: ({ data }) => data?.convention.user_con_profiles_paginated.total_pages,
    columns,
    query: UserConProfilesTableUserConProfilesQueryDocument,
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
              <Link to="/user_con_profiles/new" className="btn btn-primary ms-2 mb-2">
                <>
                  <i className="bi-plus" /> {t('admin.userConProfiles.addAttendee.buttonText')}
                </>
              </Link>
            ) : null
          }
        />

        <ReactTableWithTheWorks
          table={tableInstance}
          loading={loading}
          onClickRow={(row) => {
            navigate(`/user_con_profiles/${row.original.id}`);
          }}
          renderFilter={({ column }) => {
            if (
              column.id === 'name' ||
              column.id === 'first_name' ||
              column.id === 'last_name' ||
              column.id === 'email' ||
              column.id === 'payment_amount'
            ) {
              return <FreeTextFilter column={column} />;
            } else if (column.id === 'is_team_member' || column.id === 'attending') {
              return <BooleanChoiceSetFilter column={column} />;
            } else if (column.id === 'privileges') {
              return <PrivilegesFilter column={column} />;
            } else if (column.id === 'ticket' || column.id === 'ticket_type') {
              return <TicketTypeFilter column={column} ticketTypes={attendeesPageQueryData.convention.ticket_types} />;
            }
          }}
        />
      </div>
    </UserConProfilesTableQueryDataContext.Provider>
  );
}

export default UserConProfilesTable;
