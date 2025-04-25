import { useContext } from 'react';
import { replace, useNavigate } from 'react-router';
import AppRootContext from '../AppRootContext';
import useLoginRequired from '../Authentication/useLoginRequired';
import usePageTitle from '../usePageTitle';
import { TicketPurchaseFormQueryDocument } from './queries.generated';
import TicketPurchaseForm from './TicketPurchaseForm';
import { Route } from './+types/TicketPurchasePage';
import { apolloClientContext } from 'AppContexts';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.get(apolloClientContext).query({ query: TicketPurchaseFormQueryDocument });
  if (data.convention.my_profile?.ticket) {
    throw replace('/ticket');
  }
  return data;
}

function TicketPurchasePage({ loaderData: data }: Route.ComponentProps) {
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

export default TicketPurchasePage;
