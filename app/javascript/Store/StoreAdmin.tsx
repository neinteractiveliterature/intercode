import { NavLink, Outlet } from 'react-router';

import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { useTranslation } from 'react-i18next';

function StoreAdmin(): JSX.Element {
  const { t } = useTranslation();
  const authorizationWarning = useAuthorizationRequired('can_read_orders');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <h1 className="mb-4">{t('admin.store.header')}</h1>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin_store/products">
            {t('admin.store.products.title')}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin_store/coupons">
            {t('admin.store.coupons.title')}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin_store/orders">
            {t('admin.store.orders.title')}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin_store/order_summary">
            {t('admin.store.orderSummary.title')}
          </NavLink>
        </li>
      </ul>

      <Outlet />
    </>
  );
}

export const Component = StoreAdmin;
