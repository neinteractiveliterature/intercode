import { useContext, useMemo } from 'react';
import { CellContext, Column, createColumnHelper } from '@tanstack/react-table';
import { useNavigate, useParams, useRouteLoaderData, useRevalidator } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import { ageAsOf } from '../../TimeUtils';
import ChoiceSetFilter from '../../Tables/ChoiceSetFilter';
import EmailCell from '../../Tables/EmailCell';
import { buildFieldFilterCodecs, FilterCodecs } from '../../Tables/FilterUtils';
import { formatBucket } from './SignupUtils';
import FreeTextFilter from '../../Tables/FreeTextFilter';
import { getSignupStateLabel } from '../../Tables/SignupStateCell';
import TableHeader from '../../Tables/TableHeader';
import ReactTableWithTheWorks from '../../Tables/ReactTableWithTheWorks';
import useReactTableWithTheWorks, { QueryDataContext } from '../../Tables/useReactTableWithTheWorks';
import usePageTitle from '../../usePageTitle';
import UserConProfileWithGravatarCell from '../../Tables/UserConProfileWithGravatarCell';
import {
  RunSignupsTableSignupsQueryData,
  RunSignupsTableSignupsQueryDocument,
  RunSignupsTableSignupsQueryVariables,
  SignupAdminEventQueryData,
} from './queries.generated';
import buildEventUrl from '../buildEventUrl';
import { SignupState } from '../../graphqlTypes.generated';
import EnumTypes from '../../enumTypes.json';
import AppRootContext from '../../AppRootContext';
import { useGraphQLConfirm } from '@neinteractiveliterature/litform';
import { useApolloClient } from '@apollo/client';
import { FreezeBucketAssignmentsDocument } from './mutations.generated';
import SignupStateCell from '../../Tables/SignupStateCell';
import { NamedRoute } from '../../appRoutes';

const { encodeFilterValue, decodeFilterValue } = buildFieldFilterCodecs({
  state: FilterCodecs.stringArray,
  bucket: FilterCodecs.stringArray,
});

type SignupType = RunSignupsTableSignupsQueryData['convention']['event']['run']['signups_paginated']['entries'][0];

function SignupStateFilter<TData extends SignupType, TValue>({ column }: { column: Column<TData, TValue> }) {
  const { t } = useTranslation();
  const { ticketName } = useContext(AppRootContext);
  const choices = useMemo(
    () =>
      EnumTypes.SignupState.enumValues.map((value) => ({
        value: value.name,
        label: getSignupStateLabel(value.name as SignupState, t, ticketName),
      })),
    [ticketName, t],
  );

  return <ChoiceSetFilter column={column} multiple choices={choices} />;
}

function AgeRestrictionsCheckCell({ getValue }: CellContext<SignupType, string>) {
  const value = getValue();
  const { t } = useTranslation();
  // eslint-disable-next-line i18next/no-literal-string
  let badgeClass = 'bg-danger';
  let text = value;
  if (value === 'OK') {
    // eslint-disable-next-line i18next/no-literal-string
    badgeClass = 'bg-success';
    text = t('tables.ageRestrictionsCheck.ok');
  } else if (value === 'Unknown age') {
    // eslint-disable-next-line i18next/no-literal-string
    badgeClass = 'bg-warning';
    text = t('tables.ageRestrictionsCheck.unknown');
  } else if (value === 'N/A') {
    // eslint-disable-next-line i18next/no-literal-string
    badgeClass = 'bg-secondary';
    text = t('tables.ageRestrictionsCheck.notApplicable');
  }

  return <span className={`badge ${badgeClass}`}>{text}</span>;
}

function BucketCell<TData extends SignupType, TValue>({ row: { original } }: CellContext<TData, TValue>) {
  const { t } = useTranslation();
  const data = useContext(QueryDataContext) as Partial<RunSignupsTableSignupsQueryData>;
  return <>{data.convention && formatBucket(original, data.convention.event, t)}</>;
}

function BucketFilter<TData extends SignupType, TValue>({ column }: { column: Column<TData, TValue> }) {
  const data = useContext(QueryDataContext) as Partial<RunSignupsTableSignupsQueryData>;
  const choices = useMemo(
    () =>
      (data.convention?.event.registration_policy?.buckets ?? []).map((bucket) => ({
        label: bucket.name ?? bucket.key,
        value: bucket.key,
      })) ?? [],
    [data],
  );

  return <ChoiceSetFilter column={column} multiple choices={choices} />;
}

// eslint-disable-next-line i18next/no-literal-string
const defaultVisibleColumns = ['id', 'state', 'name', 'bucket', 'age_restrictions_check', 'email'];

function RunSignupsTable(): JSX.Element {
  const data = useRouteLoaderData(NamedRoute.SignupAdmin) as SignupAdminEventQueryData;
  const { runId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const confirm = useGraphQLConfirm();
  const client = useApolloClient();
  const revalidator = useRevalidator();

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<SignupType>();
    return [
      columnHelper.accessor('id', {
        header: t('events.signupAdmin.sequenceHeader'),
        id: 'id',
        enableSorting: true,
        size: 65,
      }),
      columnHelper.accessor('state', {
        header: t('events.signupAdmin.stateHeader'),
        id: 'state',
        size: 130,
        enableColumnFilter: true,
        enableSorting: true,
        cell: SignupStateCell,
      }),
      columnHelper.accessor('user_con_profile', {
        header: t('events.signupAdmin.nameHeader'),
        id: 'name',
        enableColumnFilter: true,
        enableSorting: true,
        cell: UserConProfileWithGravatarCell,
      }),
      columnHelper.accessor('bucket_key', {
        header: t('events.signupAdmin.bucketHeader'),
        id: 'bucket',
        cell: BucketCell,
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor('age_restrictions_check', {
        header: t('events.signupAdmin.ageCheckHeader'),
        id: 'age_restrictions_check',
        size: 100,
        enableSorting: true,
        cell: AgeRestrictionsCheckCell,
      }),
      columnHelper.accessor(
        (signup: SignupType) =>
          ageAsOf(
            signup.user_con_profile.birth_date ? DateTime.fromISO(signup.user_con_profile.birth_date) : undefined,
            DateTime.fromISO(signup.run.starts_at),
          ),
        {
          header: t('events.signupAdmin.ageTableHeader'),
          id: 'age',
          size: 40,
          enableSorting: true,
        },
      ),
      columnHelper.accessor('user_con_profile.email', {
        header: t('events.signupAdmin.emailTableHeader'),
        id: 'email',
        cell: EmailCell,
        enableColumnFilter: true,
        enableSorting: true,
      }),
    ];
  }, [t]);

  const {
    table: tableInstance,
    loading: tableLoading,
    tableHeaderProps,
    queryData,
  } = useReactTableWithTheWorks<
    RunSignupsTableSignupsQueryData,
    RunSignupsTableSignupsQueryData['convention']['event']['run']['signups_paginated']['entries'][number],
    RunSignupsTableSignupsQueryVariables
  >({
    decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue,
    getData: ({ data: tableData }) => tableData.convention.event.run.signups_paginated.entries,
    getPages: ({ data: tableData }) => tableData.convention.event.run.signups_paginated.total_pages,
    columns,
    query: RunSignupsTableSignupsQueryDocument,
    storageKeyPrefix: 'adminSignups',
    variables: { eventId: data.convention.event.id, runId: runId ?? '' },
  });

  usePageTitle(
    t('events.signupAdmin.indexPageTitle', {
      eventTitle: data?.convention.event.title,
    }),
  );

  return (
    <QueryDataContext.Provider value={queryData ?? {}}>
      <div className="mb-4">
        <TableHeader
          {...tableHeaderProps}
          exportUrl={`/csv_exports/run_signups?run_id=${runId}`}
          renderLeftContent={() => (
            <span className="ms-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() =>
                  confirm({
                    prompt: (
                      <Trans
                        i18nKey="events.signupAdmin.freezeBucketAssignments.prompt"
                        values={{ eventTitle: data.convention.event.title }}
                        components={{
                          ul: <ul />,
                          li: <li />,
                        }}
                      />
                    ),
                    action: async () => {
                      await client.mutate({
                        mutation: FreezeBucketAssignmentsDocument,
                        variables: { eventId: data.convention.event.id },
                      });
                      await client.resetStore();
                      revalidator.revalidate();
                    },
                  })
                }
              >
                <i className="bi bi-snow" /> {t('events.signupAdmin.freezeBucketAssignments.button')}
              </button>
            </span>
          )}
        />
        <ReactTableWithTheWorks
          table={tableInstance}
          loading={tableLoading}
          onClickRow={(row) =>
            navigate(`${buildEventUrl(data.convention.event)}/runs/${runId}/admin_signups/${row.original.id}`)
          }
          renderFilter={({ column }) => {
            if (column.id === 'state') {
              return <SignupStateFilter column={column} />;
            } else if (column.id === 'name' || column.id === 'email') {
              return <FreeTextFilter column={column} />;
            } else if (column.id === 'bucket') {
              return <BucketFilter column={column} />;
            }
          }}
        />
      </div>
    </QueryDataContext.Provider>
  );
}

export const Component = RunSignupsTable;
