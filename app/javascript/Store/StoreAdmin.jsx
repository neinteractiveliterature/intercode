import React from 'react';
import {
  NavLink, Redirect, Route, Switch,
} from 'react-router-dom';
import OrderAdmin from './OrderAdmin';
import OrderSummary from './OrderSummary';
import ProductAdmin from './ProductAdmin';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';

function StoreAdmin() {
  const authorizationWarning = useAuthorizationRequired('can_read_orders');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <h1 className="mb-4">Store administration</h1>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin_store/products">Products</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin_store/orders">Orders</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin_store/order_summary">Order summary</NavLink>
        </li>
      </ul>

      <Switch>
        <Route path="/admin_store/products"><ProductAdmin /></Route>
        <Route path="/admin_store/orders"><OrderAdmin exportUrl="/admin_store/orders/export.csv" /></Route>
        <Route path="/admin_store/order_summary"><OrderSummary /></Route>
        <Redirect to="/admin_store/products" />
      </Switch>
    </>
  );
}

export default StoreAdmin;
