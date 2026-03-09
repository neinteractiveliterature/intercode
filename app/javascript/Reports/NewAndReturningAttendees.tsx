import { LoaderFunction, useLoaderData, RouterContextProvider, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { stringify as csvStringify } from 'csv-stringify/browser/esm/sync';
import { saveAs } from 'file-saver';

import usePageTitle from '../usePageTitle';
import { NewAndReturningAttendeesQueryData, NewAndReturningAttendeesQueryDocument } from './queries.generated';
import { apolloClientContext } from 'AppContexts';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { joinReact } from 'RenderingUtils';
import { Convention } from 'graphqlTypes.generated';
import classNames from 'classnames';

export const loader: LoaderFunction<RouterContextProvider> = async ({ context }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<NewAndReturningAttendeesQueryData>({
    query: NewAndReturningAttendeesQueryDocument,
  });
  return data;
};

type AttendeeProfile =
  NewAndReturningAttendeesQueryData['convention']['reports']['new_and_returning_attendees']['organization_attendance_counts'][number];

function ConventionLink({ convention }: { convention: Pick<Convention, 'domain' | 'name'> }) {
  return (
    <a href={new URL(`//${convention.domain}`, window.location.href).toString()} target="_blank" rel="noreferrer">
      {convention.name}
    </a>
  );
}

function AttendeeRow({ attendee }: { attendee: AttendeeProfile }) {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const attendedConventions = useMemo(
    () =>
      sortBy([...attendee.attended_conventions], (convention) =>
        convention.starts_at ? new Date(convention.starts_at).getTime() : 0,
      ),
    [attendee.attended_conventions],
  );

  return (
    <tr>
      <td>
        <Link to={`/user_con_profiles/${attendee.current_convention_user_con_profile.id}`}>
          {attendee.current_convention_user_con_profile.name_inverted}
        </Link>
      </td>
      <td>
        <a href={`mailto:${attendee.current_convention_user_con_profile.email}`}>
          {attendee.current_convention_user_con_profile.email}
        </a>
      </td>
      <td>
        {attendedConventions.length <= 3 || showAll ? (
          joinReact(
            attendedConventions.map((convention) => <ConventionLink key={convention.id} convention={convention} />),
            ', ',
          )
        ) : (
          <>
            {joinReact(
              attendedConventions
                .slice(0, 3)
                .map((convention) => <ConventionLink key={convention.id} convention={convention} />),
              ', ',
            )}
            ,{' '}
            <a
              onClick={(event) => {
                event.preventDefault();
                setShowAll(true);
              }}
              href="#"
            >
              {t('admin.reports.newAndReturningAttendees.moreConventions', { count: attendedConventions.length - 3 })}
            </a>
          </>
        )}
      </td>
    </tr>
  );
}

function SortableHeader<ColumnName extends string>({
  columnName,
  sortColumn,
  reverse,
  children,
  setSortColumn,
  setReverse,
}: {
  columnName: ColumnName;
  sortColumn: ColumnName;
  reverse: boolean;
  children: ReactNode;
  setSortColumn: React.Dispatch<React.SetStateAction<ColumnName>>;
  setReverse: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <th
      className={classNames('cursor-pointer', {
        'fw-bold': sortColumn === columnName,
        'fw-normal': sortColumn !== columnName,
      })}
      onClick={() => {
        if (sortColumn === columnName) {
          setReverse((prevReverse) => !prevReverse);
        } else {
          setSortColumn(columnName);
          setReverse(false);
        }
      }}
    >
      {children}
      {/* eslint-disable-next-line i18next/no-literal-string */}
      {sortColumn === columnName && (reverse ? ' ▼' : ' ▲')}
    </th>
  );
}

function AttendeeTable({ attendees }: { attendees: AttendeeProfile[] }) {
  const { t } = useTranslation();
  const [sortColumn, setSortColumn] = useState<'name' | 'email' | 'conventions'>('name');
  const [reverse, setReverse] = useState(false);

  const attendeesSorted = useMemo(() => {
    const attendeesAsc = [...attendees].sort((a, b) => {
      if (sortColumn === 'name') {
        return a.current_convention_user_con_profile.name_inverted.localeCompare(
          b.current_convention_user_con_profile.name_inverted,
          undefined,
          { sensitivity: 'base' },
        );
      } else if (sortColumn === 'email') {
        return (a.current_convention_user_con_profile.email ?? '').localeCompare(
          b.current_convention_user_con_profile.email ?? '',
          undefined,
          { sensitivity: 'base' },
        );
      } else {
        return a.attended_conventions.length - b.attended_conventions.length;
      }
    });

    if (reverse) {
      return attendeesAsc.reverse();
    } else {
      return attendeesAsc;
    }
  }, [attendees, reverse, sortColumn]);

  const exportCSV = useCallback(() => {
    const rows = [
      [
        t('admin.reports.newAndReturningAttendees.nameHeader'),
        t('admin.reports.newAndReturningAttendees.emailHeader'),
        t('admin.reports.newAndReturningAttendees.conventionsHeader'),
      ],
      ...attendeesSorted.map((attendee) => [
        attendee.current_convention_user_con_profile.name_inverted,
        attendee.current_convention_user_con_profile.email,
        attendee.attended_conventions.length,
      ]),
    ];
    const blob = new Blob([csvStringify(rows)], { type: 'text/csv; charset=utf-8' });
    saveAs(blob, 'attendance_history.csv');
  }, [attendeesSorted, t]);

  return (
    <>
      <div className="mb-2">
        <button type="button" className="btn btn-outline-primary" onClick={exportCSV}>
          <i className="bi-file-earmark-spreadsheet" /> {t('admin.reports.newAndReturningAttendees.exportCsvButton')}
        </button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <SortableHeader
              columnName="name"
              sortColumn={sortColumn}
              reverse={reverse}
              setSortColumn={setSortColumn}
              setReverse={setReverse}
            >
              {t('admin.reports.newAndReturningAttendees.nameHeader')}
            </SortableHeader>
            <SortableHeader
              columnName="email"
              sortColumn={sortColumn}
              reverse={reverse}
              setSortColumn={setSortColumn}
              setReverse={setReverse}
            >
              {t('admin.reports.newAndReturningAttendees.emailHeader')}
            </SortableHeader>
            <SortableHeader
              columnName="conventions"
              sortColumn={sortColumn}
              reverse={reverse}
              setSortColumn={setSortColumn}
              setReverse={setReverse}
            >
              {t('admin.reports.newAndReturningAttendees.conventionsHeader')}
            </SortableHeader>
          </tr>
        </thead>
        <tbody>
          {attendeesSorted.map((attendee) => (
            <AttendeeRow key={attendee.user_id} attendee={attendee} />
          ))}
        </tbody>
      </table>
    </>
  );
}

function NewAndReturningAttendees() {
  const { t } = useTranslation();
  const data = useLoaderData() as NewAndReturningAttendeesQueryData;
  usePageTitle(t('admin.reports.newAndReturningAttendees.title'));

  const { organization_attendance_counts } = data.convention.reports.new_and_returning_attendees;
  const newAttendeeCount = useMemo(
    () => organization_attendance_counts.filter((oac) => oac.attended_conventions.length < 2).length,
    [organization_attendance_counts],
  );
  const returningAttendeeCount = useMemo(
    () => organization_attendance_counts.filter((oac) => oac.attended_conventions.length >= 2).length,
    [organization_attendance_counts],
  );

  return (
    <>
      <h1 className="mb-4">{t('admin.reports.newAndReturningAttendees.title')}</h1>

      <div className="card mb-4">
        <div className="card-body">
          <dl className="row mb-0">
            <dt className="col-sm-6">{t('admin.reports.newAndReturningAttendees.newAttendeesLabel')}</dt>
            <dd className="col-sm-6">{newAttendeeCount}</dd>
            <dt className="col-sm-6">{t('admin.reports.newAndReturningAttendees.returningAttendeesLabel')}</dt>
            <dd className="col-sm-6">{returningAttendeeCount}</dd>
            <dt className="col-sm-6">{t('admin.reports.newAndReturningAttendees.totalLabel')}</dt>
            <dd className="col-sm-6">{organization_attendance_counts.length}</dd>
          </dl>
        </div>
      </div>

      <AttendeeTable attendees={organization_attendance_counts} />
    </>
  );
}

export const Component = NewAndReturningAttendees;
