import React from 'react';

import NavigationItem from './NavigationItem';
import NavigationBrand from './NavigationBrand';
import NavigationCollapse from './NavigationCollapse';
import NavigationSection from './NavigationSection';
import SignOutNavigationItem from './SignOutNavigationItem';
import TicketPurchaseNavigationItem from './TicketPurchaseNavigationItem';
import UserNavigationSection from './UserNavigationSection';

let renderNavigationItems;

export function renderNavigationItem(item, key) {
  switch (item.__typename) {
    case 'NavigationBrand':
      return <NavigationBrand item={item} key={key} />;
    case 'NavigationCollapse':
      return (
        <NavigationCollapse
          item={item}
          key={key}
          renderNavigationItems={renderNavigationItems}
        />
      );
    case 'NavigationItem':
      return <NavigationItem item={item} key={key} />;
    case 'NavigationSection':
      return (
        <NavigationSection
          item={item}
          key={key}
          renderNavigationItems={renderNavigationItems}
        />
      );
    case 'SignOutNavigationItem':
      return <SignOutNavigationItem item={item} key={key} />;
    case 'TicketPurchaseNavigationItem':
      return <TicketPurchaseNavigationItem key={key} />;
    case 'UserNavigationSection':
      return (
        <UserNavigationSection
          item={item}
          key={key}
          renderNavigationItems={renderNavigationItems}
        />
      );
    default:
      return <code key={key}>{item.__typename}</code>;
  }
}

renderNavigationItems = items => items.map(renderNavigationItem);
const exportableRenderNavigationItems = renderNavigationItems;

export default exportableRenderNavigationItems;
