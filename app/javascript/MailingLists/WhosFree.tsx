import TabbedMailingList from './TabbedMailingList';
import Timespan, { FiniteTimespan } from '../Timespan';
import WhosFreeForm from './WhosFreeForm';
import usePageTitle from '../usePageTitle';
import { WhosFreeQueryData, WhosFreeQueryDocument } from './queries.generated';
import { LoaderFunction, useLoaderData } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { useSearchParams } from 'react-router-dom';

type LoaderResult = {
  timespan?: FiniteTimespan;
  data?: WhosFreeQueryData;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const start = url.searchParams.get('start');
  const finish = url.searchParams.get('finish');

  if (start && finish) {
    let timespan: FiniteTimespan;
    try {
      timespan = Timespan.finiteFromStrings(start, finish);
    } catch {
      return {} satisfies LoaderResult;
    }

    const { data } = await client.query({
      query: WhosFreeQueryDocument,
      variables: { start: timespan.start.toISO(), finish: timespan.finish.toISO() },
    });
    return { timespan, data } satisfies LoaderResult;
  }

  return {} satisfies LoaderResult;
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

function WhosFree(): JSX.Element {
  const { data } = useLoaderData() as LoaderResult;
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

export const Component = WhosFree;
