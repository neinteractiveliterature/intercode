import { useContext } from 'react';
import { LoaderFunction, RouterContextProvider, replace, useLoaderData, useNavigate } from 'react-router';
import AppRootContext from '../AppRootContext';
import useLoginRequired from '../Authentication/useLoginRequired';
import usePageTitle from '../usePageTitle';
import { TicketPurchaseFormQueryData, TicketPurchaseFormQueryDocument } from './queries.generated';
import TicketPurchaseForm from './TicketPurchaseForm';
import { apolloClientContext } from '~/AppContexts';

export const loader: LoaderFunction<RouterContextProvider> = async ({ context }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<TicketPurchaseFormQueryData>({ query: TicketPurchaseFormQueryDocument });
  if (!data) {
    return new Response(null, { status: 404 });
  }
  if (data.convention.my_profile?.ticket) {
    return replace('/ticket');
  }
  return data;
};

function TicketPurchasePage() {
  const data = useLoaderData() as TicketPurchaseFormQueryData;
  const { ticketName } = useContext(AppRootContext);
  const navigate = useNavigate();

  usePageTitle(`Buy a ${ticketName}`);

  const loginRequired = useLoginRequired();

  if (loginRequired) {
    return <></>;
  }

  return (
    <div className="container-max-md mt-4">
      <div className="card-body">
        <h1 className="mb-4">
          Buy a {ticketName} for {data.convention.name}
        </h1>

        <TicketPurchaseForm availableProducts={data.convention.products} onAddedToCart={() => navigate('/cart')} />
      </div>
    </div>
  );
}

export const Component = TicketPurchasePage;
