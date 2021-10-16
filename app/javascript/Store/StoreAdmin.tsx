import { NavLink, Redirect, Route, Switch } from 'react-router-dom';

import CouponAdminTable from './CouponAdmin/CouponAdminTable';
import OrderAdmin from './OrderAdmin';
import OrderSummary from './OrderSummary';
import ProductAdmin from './ProductAdmin';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';

function StoreAdmin(): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_read_orders');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <h1 className="mb-4">Store administration</h1>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin_store/products">
            Products
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin_store/coupons">
            Coupons
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin_store/orders">
            Orders
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin_store/order_summary">
            Order summary
          </NavLink>
        </li>
      </ul>

      <Switch>
        <Route path="/admin_store/products">
          <ProductAdmin />
        </Route>
        <Route path="/admin_store/coupons">
          <CouponAdminTable />
        </Route>
        <Route path="/admin_store/orders">
          <OrderAdmin />
        </Route>
        <Route path="/admin_store/order_summary">
          <OrderSummary />
        </Route>
        <Redirect to="/admin_store/products" />
      </Switch>
    </>
  );
}

export default StoreAdmin;
