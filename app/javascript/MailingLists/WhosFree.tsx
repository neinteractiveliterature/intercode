import TabbedMailingList from './TabbedMailingList';
import Timespan, { FiniteTimespan } from '../Timespan';
import WhosFreeForm from './WhosFreeForm';
import usePageTitle from '../usePageTitle';
import { WhosFreeQueryData, WhosFreeQueryDocument } from './queries.generated';
import { useLoaderData } from 'react-router';
import { apolloClientContext } from 'AppContexts';
import { useSearchParams } from 'react-router';
import type { Route } from './+types/WhosFree';

export const clientLoader = async ({ context, request }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const url = new URL(request.url);
  const start = url.searchParams.get('start');
  const finish = url.searchParams.get('finish');

  if (start && finish) {
    let timespan: FiniteTimespan;
    try {
      timespan = Timespan.finiteFromStrings(start, finish);
    } catch {
      return {};
    }

    const { data } = await client.query({
      query: WhosFreeQueryDocument,
      variables: { start: timespan.start.toISO() ?? '', finish: timespan.finish.toISO() ?? '' },
      errorPolicy: 'none',
    });
    return { timespan, data };
  }

  return {};
};

function WhosFreeResults({ data }: { data: WhosFreeQueryData }) {
  return (
    <TabbedMailingList
      emails={data.convention.mailing_lists.whos_free.emails}
      metadataFields={data.convention.mailing_lists.whos_free.metadata_fields}
      csvFilename={`Who's free - ${data.convention.name}.csv`}
    />
  );
}

function WhosFree(): React.JSX.Element {
  const { data } = useLoaderData<typeof clientLoader>();
  const [, setSearchParams] = useSearchParams();

  usePageTitle('Who’s free');

  return (
    <>
      <h1 className="mb-4">Who’s free?</h1>
      <WhosFreeForm
        onSubmit={({ start, finish }) => setSearchParams({ start: start.toISO() ?? '', finish: finish.toISO() ?? '' })}
      />
      {data && <WhosFreeResults data={data} />}
    </>
  );
}

export default WhosFree;
