import React from 'react';

import NavigationItem from './NavigationItem';
import NavigationSection from './NavigationSection';
import SignOutNavigationItem from './SignOutNavigationItem';
import TicketPurchaseNavigationItem from './TicketPurchaseNavigationItem';

let renderNavigationItems;

export function renderNavigationItem(item, key, inSection) {
  switch (item.__typename) {
    case 'NavigationItem':
      return <NavigationItem item={item} key={key} inSection={inSection} />;
    case 'NavigationSection':
      return (
        <NavigationSection label={item.label} key={key}>
          {renderNavigationItems(item.items, true)}
        </NavigationSection>
      );
    case 'SignOutNavigationItem':
      return <SignOutNavigationItem item={item} key={key} />;
    case 'TicketPurchaseNavigationItem':
      return <TicketPurchaseNavigationItem key={key} />;
    default:
      return <code key={key}>{item.__typename}</code>;
  }
}

renderNavigationItems = (items, inSection) => items.map(
  (item, key) => renderNavigationItem(item, key, inSection),
);
const exportableRenderNavigationItems = renderNavigationItems;

export default exportableRenderNavigationItems;
