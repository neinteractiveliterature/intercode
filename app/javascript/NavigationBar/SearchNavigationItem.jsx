import React from 'react';

function SearchNavigationItem() {
  return (
    <li className="nav-item">
      <button className="btn btn-link nav-link" type="button">
        <i className="fa fa-search" />
        <span className="sr-only">Search</span>
      </button>
    </li>
  );
}

export default SearchNavigationItem;
