import { LoaderFunction, useLoaderData, RouterContextProvider } from 'react-router';

import usePageTitle from '../usePageTitle';
import { NewAndReturningAttendeesQueryData, NewAndReturningAttendeesQueryDocument } from './queries.generated';
import { apolloClientContext } from 'AppContexts';

export const loader: LoaderFunction<RouterContextProvider> = async ({ context }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<NewAndReturningAttendeesQueryData>({
    query: NewAndReturningAttendeesQueryDocument,
  });
  return data;
};

type AttendeeProfile =
  NewAndReturningAttendeesQueryData['convention']['reports']['new_and_returning_attendees']['new_attendees'][number];

function AttendeeTable({ attendees, title }: { attendees: AttendeeProfile[]; title: string }) {
  return (
    <>
      <h2 className="mt-4">
        {title} ({attendees.length})
      </h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {[...attendees]
            .sort((a, b) => a.name_inverted.localeCompare(b.name_inverted, undefined, { sensitivity: 'base' }))
            .map((attendee) => (
              <tr key={attendee.id}>
                <td>{attendee.name_inverted}</td>
                <td>{attendee.email}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

function NewAndReturningAttendees() {
  const data = useLoaderData() as NewAndReturningAttendeesQueryData;
  usePageTitle('New and returning attendees');

  const { new_attendees, returning_attendees } = data.convention.reports.new_and_returning_attendees;

  return (
    <>
      <h1 className="mb-4">New and returning attendees</h1>

      <div className="card">
        <div className="card-body">
          <dl className="row mb-0">
            <dt className="col-sm-6">New attendees</dt>
            <dd className="col-sm-6">{new_attendees.length}</dd>
            <dt className="col-sm-6">Returning attendees</dt>
            <dd className="col-sm-6">{returning_attendees.length}</dd>
            <dt className="col-sm-6">Total</dt>
            <dd className="col-sm-6">{new_attendees.length + returning_attendees.length}</dd>
          </dl>
        </div>
      </div>

      <AttendeeTable attendees={new_attendees} title="New attendees" />
      <AttendeeTable attendees={returning_attendees} title="Returning attendees" />
    </>
  );
}

export const Component = NewAndReturningAttendees;
