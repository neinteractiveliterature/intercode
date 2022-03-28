import { LoadQueryWrapper } from '@neinteractiveliterature/litform';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AppRootContext from '../AppRootContext';
import useLoginRequired from '../Authentication/useLoginRequired';
import usePageTitle from '../usePageTitle';
import { useTicketPurchaseFormQuery } from './queries.generated';
import TicketPurchaseForm from './TicketPurchaseForm';

export default LoadQueryWrapper(useTicketPurchaseFormQuery, function TicketPurchasePage({ data }) {
  const { ticketName } = useContext(AppRootContext);

  usePageTitle(`Buy a ${ticketName}`);

  const loginRequired = useLoginRequired();

  if (loginRequired) {
    return <></>;
  }

  if (data.convention.my_profile?.ticket) {
    return <Navigate to="/ticket" replace />;
  }

  return (
    <div className="container-max-md mt-4">
      <div className="card-body">
        <h1 className="mb-4">
          Buy a {ticketName} for {data.convention.name}
        </h1>

        <TicketPurchaseForm availableProducts={data.convention.products} />
      </div>
    </div>
  );
});
