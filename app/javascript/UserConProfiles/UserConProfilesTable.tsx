import { useContext, useMemo } from 'react';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import { Column, CellProps, FilterProps } from 'react-table';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { DateTime } from 'luxon';

import AddAttendeeModal from './AddAttendeeModal';
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
  UserConProfilesTableUserConProfilesQueryData,
  useUserConProfilesTableUserConProfilesQuery,
  UserConProfilesTableUserConProfilesQueryVariables,
} from './queries.generated';
import { FormItemValueType, TypedFormItem } from '../FormAdmin/FormItemUtils';
import { getSortedParsedFormItems } from '../Models/Form';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';
import { formatLCM, getDateTimeFormat } from '../TimeUtils';
import AppRootContext from '../AppRootContext';
import humanize from '../humanize';

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

type TicketStatusCellProps = {
  value: UserConProfilesTableRow['ticket'];
};

function TicketStatusCell({ value }: TicketStatusCellProps): JSX.Element {
  const { t } = useTranslation();

  if (!value) {
    return <>{t('tables.ticketStatus.unpaid')}</>;
  }

  return <>{humanize(value.ticket_type.name)}</>;
}

type TicketPaymentAmountCellProps = {
  value: UserConProfilesTableRow['ticket'];
};

function TicketPaymentAmountCell({ value }: TicketPaymentAmountCellProps): JSX.Element {
  return <>{formatMoney(value?.order_entry?.price_per_item)}</>;
}

type TicketStatusWithPaymentAmountCellProps = {
  value: UserConProfilesTableRow['ticket'];
};

function TicketStatusWithPaymentAmountCell({ value }: TicketStatusWithPaymentAmountCellProps): JSX.Element {
  return (
    <>
      <TicketStatusCell value={value} /> <TicketPaymentAmountCell value={value} />
    </>
  );
}

function TicketStatusChangeCell({ value }: { value: DateTime | null }): JSX.Element {
  const { t } = useTranslation();
  return <>{value ? formatLCM(value, getDateTimeFormat('shortDateTime', t)) : null}</>;
}

const TicketTypeFilter = (props: FilterProps<UserConProfilesTableRow>): JSX.Element => {
  const { t } = useTranslation();
  const data = useContext(UserConProfilesTableQueryDataContext);
  const choices = useMemo(
    () =>
      data
        ? [
            { label: t('tables.ticketStatus.unpaid'), value: 'none' },
            ...data.convention.ticket_types.map((ticketType) => ({
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
    return <>{t('tables.privileges.siteAdmin')}</>;
  }

  return <></>;
};

const PrivilegesFilter = (props: FilterProps<UserConProfilesTableRow>) => {
  const { t } = useTranslation();
  return (
    <ChoiceSetFilter {...props} choices={[{ label: t('tables.privileges.siteAdmin'), value: 'site_admin' }]} multiple />
  );
};

function getPossibleColumns(
  data: UserConProfilesTableUserConProfilesQueryData,
  t: TFunction,
  formItems: TypedFormItem[],
  timezoneName: string,
): Column<UserConProfilesTableRow>[] {
  const columns: Column<UserConProfilesTableRow>[] = [
    {
      Header: <>{t('admin.userConProfiles.id')}</>,
      id: 'id',
      accessor: (userConProfile) => userConProfile.id,
      width: 70,
    },
    {
      Header: <>{t('admin.userConProfiles.userId')}</>,
      id: 'user_id',
      accessor: (userConProfile) => userConProfile.user_id,
      width: 70,
    },
    {
      Header: <>{t('admin.userConProfiles.name')}</>,
      id: 'name',
      accessor: (userConProfile) => userConProfile,
      disableFilters: false,
      disableSortBy: false,
      Filter: FreeTextFilter,
      Cell: UserConProfileWithGravatarCell,
    },
    {
      Header: <>{t('admin.userConProfiles.firstName')}</>,
      id: 'first_name',
      accessor: (userConProfile) => userConProfile.first_name,
      disableFilters: false,
      disableSortBy: false,
      Filter: FreeTextFilter,
    },
    {
      Header: <>{t('admin.userConProfiles.lastName')}</>,
      id: 'last_name',
      accessor: (userConProfile) => userConProfile.last_name,
      disableFilters: false,
      disableSortBy: false,
      Filter: FreeTextFilter,
    },
    {
      Header: <>{t('admin.userConProfiles.email')}</>,
      id: 'email',
      accessor: (userConProfile) => userConProfile.email,
      disableFilters: false,
      disableSortBy: false,
      Cell: EmailCell,
      Filter: FreeTextFilter,
    },
  ];

  if (data.convention.ticket_mode !== 'disabled') {
    columns.push(
      {
        Header: <>{humanize(data.convention.ticket_name || 'ticket')}</>,
        id: 'ticket',
        accessor: (userConProfile) => userConProfile.ticket,
        width: 150,
        disableFilters: false,
        disableSortBy: false,
        Cell: TicketStatusWithPaymentAmountCell,
        Filter: TicketTypeFilter,
      },
      {
        Header: (
          <>
            {t('admin.userConProfiles.ticketType', {
              ticketName: humanize(data.convention.ticket_name || 'ticket'),
            })}
          </>
        ),
        id: 'ticket_type',
        accessor: (userConProfile) => userConProfile.ticket,
        width: 150,
        disableFilters: false,
        disableSortBy: false,
        Cell: TicketStatusCell,
        Filter: TicketTypeFilter,
      },
      {
        Header: <>{t('admin.userConProfiles.paymentAmount')}</>,
        id: 'payment_amount',
        accessor: (userConProfile) => userConProfile.ticket,
        width: 150,
        disableFilters: false,
        disableSortBy: false,
        Cell: TicketPaymentAmountCell,
        Filter: FreeTextFilter,
      },
    );
  }

  columns.push(
    {
      Header: <>{t('admin.userConProfiles.isTeamMember')}</>,
      id: 'is_team_member',
      accessor: (userConProfile) => userConProfile.team_members.length > 0,
      width: 150,
      disableFilters: false,
      Cell: BooleanCell,
      Filter: BooleanChoiceSetFilter,
    },
    {
      Header: <>{t('admin.userConProfiles.isAttending')}</>,
      id: 'attending',
      accessor: (userConProfile) => userConProfile.ticket != null,
      width: 150,
      disableFilters: false,
      Cell: BooleanCell,
      Filter: BooleanChoiceSetFilter,
    },
  );

  if (data.convention.ticket_mode !== 'disabled') {
    columns.push({
      Header: (
        <>
          {t('admin.userConProfiles.ticketStatusChangedAt', {
            ticketName: humanize(data.convention.ticket_name || 'ticket'),
          })}
        </>
      ),
      id: 'ticket_updated_at',
      accessor: (userConProfile) =>
        userConProfile.ticket ? DateTime.fromISO(userConProfile.ticket.updated_at, { zone: timezoneName }) : null,
      disableSortBy: false,
      Cell: TicketStatusChangeCell,
    });
  }

  columns.push(
    {
      Header: <>{t('admin.userConProfiles.privileges')}</>,
      id: 'privileges',
      accessor: (row) => row,
      disableFilters: false,
      disableSortBy: false,
      Cell: PrivilegesCell,
      Filter: PrivilegesFilter,
    },
    {
      Header: <>{t('admin.userConProfiles.orderSummary')}</>,
      id: 'order_summary',
      accessor: 'order_summary',
    },
  );

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
      <FormItemDisplay formItem={formItem} value={value} convention={data.convention} displayMode="admin" />
    );

    columns.push({
      Header: formItem.admin_description || humanize(identifier),
      id: identifier,
      accessor: (userConProfile) => JSON.parse(userConProfile.form_response_attrs_json ?? '{}')[identifier],
      Cell: FormItemCell,
    });
  });

  return columns;
}

export type UserConProfilesTableProps = {
  defaultVisibleColumns?: string[];
};

function UserConProfilesTable({ defaultVisibleColumns }: UserConProfilesTableProps): JSX.Element {
  const { timezoneName } = useContext(AppRootContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const newProfileMatch = useMatch('/user_con_profiles/new');
  const getPossibleColumnsWithTranslation = useMemo(
    () => (data: UserConProfilesTableUserConProfilesQueryData) =>
      getPossibleColumns(data, t, getSortedParsedFormItems(data.convention.user_con_profile_form), timezoneName),
    [t, timezoneName],
  );
  const { tableInstance, loading, tableHeaderProps, queryData } = useReactTableWithTheWorks<
    UserConProfilesTableUserConProfilesQueryData,
    UserConProfilesTableRow,
    UserConProfilesTableUserConProfilesQueryVariables
  >({
    decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue,
    getData: ({ data }) => data?.convention.user_con_profiles_paginated.entries,
    getPages: ({ data }) => data?.convention.user_con_profiles_paginated.total_pages,
    getPossibleColumns: getPossibleColumnsWithTranslation,
    useQuery: useUserConProfilesTableUserConProfilesQuery,
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
          tableInstance={tableInstance}
          loading={loading}
          onClickRow={(row) => {
            navigate(`/user_con_profiles/${row.original.id}`);
          }}
        />

        <AddAttendeeModal conventionName={queryData?.convention.name ?? ''} visible={newProfileMatch != null} />
      </div>
    </UserConProfilesTableQueryDataContext.Provider>
  );
}

export default UserConProfilesTable;
