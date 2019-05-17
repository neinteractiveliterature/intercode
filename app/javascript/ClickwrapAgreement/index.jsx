import React from 'react';

import { ClickwrapAgreementQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import parsePageContent from '../parsePageContent';

function ClickwrapAgreement() {
  const { data, error } = useQuerySuspended(ClickwrapAgreementQuery);

  if (error) {
    return <ErrorDisplay graphqlError={error} />;
  }

  const { convention } = data;

  return (
    <>
      <p className="my-4">
        In order to use the
        {' '}
        {convention.name}
        {' '}
        web site, you must agree to the following terms of service.  If you do not agree, please
        close this browser window.
      </p>

      <div className="px-4">
        <div className="card">
          <div className="card-header">
            {convention.name}
            {' terms of service'}
          </div>
          <div className="card-body">
            {parsePageContent(convention.clickwrap_agreement_html).bodyComponents}
          </div>
          <div className="card-footer text-right">
            <button className="btn btn-primary" type="button">
              I agree
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClickwrapAgreement;
