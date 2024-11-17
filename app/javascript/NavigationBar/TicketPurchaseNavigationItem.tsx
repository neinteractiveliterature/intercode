import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import AppRootContext from '../AppRootContext';
import humanize from '../humanize';

function TicketPurchaseNavigationItem(): JSX.Element {
  const { t } = useTranslation();
  const { myProfile, ticketName, ticketTypes, ticketsAvailableForPurchase } = useContext(AppRootContext);

  if (!ticketTypes) {
    return <></>;
  }

  if (!myProfile || myProfile.ticket) {
    return <></>;
  }

  if (!ticketsAvailableForPurchase) {
    return <></>;
  }

  if (!ticketTypes.some((ticketType) => ticketType.providing_products.some((product) => product.available))) {
    return <></>;
  }

  return (
    <li className="nav-item my-auto">
      <Link to="/ticket/new" className="btn btn-sm btn-primary">
        <span className="d-inline d-md-none d-lg-inline">{t('navigation.ticketPurchase.ctaLong', { ticketName })}</span>
        <span className="d-none d-md-inline d-lg-none">
          {t('navigation.ticketPurchase.ctaShort', {
            ticketName: humanize(ticketName ?? 'ticket'),
          })}
        </span>
      </Link>
    </li>
  );
}

export default TicketPurchaseNavigationItem;
