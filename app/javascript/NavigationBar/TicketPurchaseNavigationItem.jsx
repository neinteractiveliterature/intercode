import React, { useContext } from 'react';
import { humanize } from 'inflected';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import AppRootContext from '../AppRootContext';

function TicketPurchaseNavigationItem() {
  const { t } = useTranslation();
  const { myProfile, ticketName, ticketTypes } = useContext(AppRootContext);

  if (!ticketTypes) {
    return null;
  }

  if (!myProfile || myProfile.ticket) {
    return null;
  }

  if (!ticketTypes.some((ticketType) => ticketType.publicly_available)) {
    return null;
  }

  return (
    <li className="nav-item my-auto">
      <Link to="/ticket/new" className="btn btn-sm btn-primary">
        <span className="d-inline d-md-none d-lg-inline">
          {t('navigation.ticketPurchase.ctaLong', 'Buy a {{ ticketName }}!', { ticketName })}
        </span>
        <span className="d-none d-md-inline d-lg-none">
          {t('navigation.ticketPurchase.ctaShort', '{{ ticketName }}!', { ticketName: humanize(ticketName) })}
        </span>
      </Link>
    </li>
  );
}

export default TicketPurchaseNavigationItem;
