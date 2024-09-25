import { useState, useContext } from 'react';
import { useFetcher } from 'react-router';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import buildTicketTypeInput from './buildTicketTypeInput';
import TicketTypeForm from './TicketTypeForm';
import usePageTitle from '../usePageTitle';
import AppRootContext from '../AppRootContext';
import { SingleTicketTypeLoaderResult } from './loaders';

function EditTicketTypeForm({ initialTicketType }: { initialTicketType: SingleTicketTypeLoaderResult }) {
  const { ticketName } = useContext(AppRootContext);
  usePageTitle(`Editing “${initialTicketType.name}”`);
  const [ticketType, setTicketType] = useState(initialTicketType);
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const inProgress = fetcher.state !== 'idle';

  const saveClicked = () => {
    fetcher.submit(buildTicketTypeInput(ticketType), { method: 'PATCH', encType: 'application/json' });
  };

  return (
    <div>
      <h1 className="mb-4">
        Editing {ticketName} type “{initialTicketType.name}”
      </h1>
      <TicketTypeForm ticketType={ticketType} onChange={setTicketType} />
      <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={inProgress}>
        Save changes
      </button>
      <ErrorDisplay graphQLError={error as ApolloError} />
    </div>
  );
}

export default EditTicketTypeForm;
