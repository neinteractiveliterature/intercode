import TabbedMailingList from './TabbedMailingList';
import Timespan, { FiniteTimespan } from '../Timespan';
import WhosFreeForm from './WhosFreeForm';
import usePageTitle from '../usePageTitle';
import { WhosFreeQueryData, WhosFreeQueryDocument } from './queries.generated';
import { useSearchParams } from 'react-router';
import { Route } from './+types/WhosFree';
import { apolloClientContext } from 'AppContexts';

export async function loader({ context, request }: Route.LoaderArgs) {
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

    const { data } = await context.get(apolloClientContext).query({
      query: WhosFreeQueryDocument,
      variables: { start: timespan.start.toISO(), finish: timespan.finish.toISO() },
    });
    return { timespan, data };
  }

  return {};
}

function WhosFreeResults({ data }: { data: WhosFreeQueryData }) {
  return (
    <TabbedMailingList
      emails={data.convention.mailing_lists.whos_free.emails}
      metadataFields={data.convention.mailing_lists.whos_free.metadata_fields}
      csvFilename={`Who's free - ${data.convention.name}.csv`}
    />
  );
}

function WhosFree({ loaderData: data }: Route.ComponentProps): JSX.Element {
  const [, setSearchParams] = useSearchParams();

  usePageTitle('Who’s free');

  return (
    <>
      <h1 className="mb-4">Who’s free?</h1>
      <WhosFreeForm
        onSubmit={({ start, finish }) => setSearchParams({ start: start.toISO() ?? '', finish: finish.toISO() ?? '' })}
      />
      {data.data && <WhosFreeResults data={data.data} />}
    </>
  );
}

export default WhosFree;
