import React from 'react';
import { humanize } from 'inflected';
import { Link } from 'react-router-dom';

import { NavigationConsumer } from './NavigationContext';

const TicketPurchaseNavigationItem = () => (
  <NavigationConsumer>
    {({ convention, myProfile }) => {
      if (!convention) {
        return null;
      }

      if (!myProfile || myProfile.ticket) {
        return null;
      }

      if (!convention.ticket_types.some(ticketType => ticketType.publicly_available)) {
        return null;
      }

      return (
        <li className="nav-item my-auto">
          <Link to="/ticket/new" className="btn btn-sm btn-primary">
            <span className="d-inline d-md-none d-lg-inline">
              Buy a
              {' '}
              {convention.ticket_name}
              !
            </span>
            <span className="d-none d-md-inline d-lg-none">
              {humanize(convention.ticket_name)}
              !
            </span>
          </Link>
        </li>
      );
    }}
  </NavigationConsumer>
);

export default TicketPurchaseNavigationItem;
