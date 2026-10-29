import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { replace, useLoaderData, useNavigate } from 'react-router';
import AppRootContext from '../AppRootContext';
import useLoginRequired from '../Authentication/useLoginRequired';
import usePageTitle from '../usePageTitle';
import { TicketPurchaseFormQueryDocument } from './queries.generated';
import TicketPurchaseForm from './TicketPurchaseForm';
import { apolloClientContext } from 'AppContexts';
import type { Route } from './+types/TicketPurchasePage';

export const clientLoader = async ({ context }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: TicketPurchaseFormQueryDocument, errorPolicy: 'none' });
  if (!data) {
    return new Response(null, { status: 404 });
  }
  if (data.convention.my_profile?.ticket) {
    return replace('/ticket');
  }
  return data;
};

function TicketPurchasePage() {
  const data = useLoaderData<typeof clientLoader>();
  const { ticketName, ticketNamePlural } = useContext(AppRootContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  usePageTitle(`Buy a ${ticketName}`);

  const loginRequired = useLoginRequired();

  if (loginRequired) {
    return loginRequired;
  }

  return (
    <div className="container-max-md mt-4">
      <div className="card-body">
        <h1 className="mb-4">
          Buy a {ticketName} for {data.convention.name}
        </h1>

        {data.convention.tickets_available_for_purchase ? (
          <TicketPurchaseForm availableProducts={data.convention.products} onAddedToCart={() => navigate('/cart')} />
        ) : (
          <p className="lead">{t('store.soldOut', { conventionName: data.convention.name, ticketNamePlural })}</p>
        )}
      </div>
    </div>
  );
}

export default TicketPurchasePage;
