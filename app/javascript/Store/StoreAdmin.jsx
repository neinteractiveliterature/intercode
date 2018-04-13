import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, NavLink, Redirect, Route, Switch } from 'react-router-dom';
import OrderAdmin from './OrderAdmin';
import OrderSummary from './OrderSummary';
import ProductAdmin from './ProductAdmin';

const StoreAdmin = props => (
  <BrowserRouter basename={props.basename}>
    <div>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <NavLink className="nav-link" to="/products">Products</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/orders">Orders</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/order_summary">Order summary</NavLink>
        </li>
      </ul>

      <Switch>
        <Route path="/products" component={ProductAdmin} />
        <Route path="/orders" render={() => <OrderAdmin exportUrl={props.exportOrdersUrl} />} />
        <Route path="/order_summary" component={OrderSummary} />
        <Redirect to="/products" />
      </Switch>
    </div>
  </BrowserRouter>
);

StoreAdmin.propTypes = {
  basename: PropTypes.string.isRequired,
  exportOrdersUrl: PropTypes.string.isRequired,
};

export default StoreAdmin;
