import React from 'react';
import { useLocation } from 'react-router-dom';

export default function FourOhFourPage() {
  const location = useLocation();

  return (
    <div className="alert alert-warning">
      <h1>Oops!</h1>

      <p className="mb-0">
        We couldn&rsquo;t find a page at the location
        {' '}
        {location.pathname}
        .
      </p>
    </div>
  );
}
