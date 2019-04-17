import React, { useReducer, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Transforms, transformsReducer } from '../ComposableFormUtils';
import ConventionFormGeneralSection from './ConventionFormGeneralSection';
import ConventionFormWebsiteSection from './ConventionFormWebsiteSection';
import ConventionFormBillingSection from './ConventionFormBillingSection';
import ConventionFormEventsSection from './ConventionFormEventsSection';

const conventionFormTransforms = {
  starts_at: Transforms.datetime,
  ends_at: Transforms.datetime,
  maximum_tickets: Transforms.integer,
};

const conventionFormReducer = transformsReducer(conventionFormTransforms);

function ConventionForm({
  initialConvention, cmsLayouts, pages, saveConvention,
}) {
  const [convention, dispatch] = useReducer(conventionFormReducer, initialConvention);

  const onClickSave = useCallback(
    (event) => {
      event.preventDefault();
      saveConvention(convention);
    },
    [convention, saveConvention],
  );

  const tabs = [
    {
      id: 'general',
      name: 'General',
      renderContent: () => (
        <ConventionFormGeneralSection convention={convention} dispatch={dispatch} />
      ),
    },
    {
      id: 'website',
      name: 'Website',
      renderContent: () => (
        <ConventionFormWebsiteSection
          convention={convention}
          dispatch={dispatch}
          cmsLayouts={cmsLayouts}
          pages={pages}
        />
      ),
    },
    {
      id: 'billing',
      name: 'Billing',
      renderContent: () => (
        <ConventionFormBillingSection
          convention={convention}
          dispatch={dispatch}
          maskedStripeSecretKey={initialConvention.masked_stripe_secret_key}
        />
      ),
    },
    {
      id: 'events',
      name: 'Events',
      renderContent: () => (
        <ConventionFormEventsSection convention={convention} dispatch={dispatch} />
      ),
    },
  ];

  const [selectedTab, setSelectedTab] = useState('general');

  return (
    <form>
      <ul className="nav nav-tabs">
        {
          tabs.map(({ id, name }) => (
            <li key={id} className="nav-item">
              <a
                className={classNames('nav-link', { active: id === selectedTab })}
                href={`#${id}`}
                onClick={(event) => {
                  event.preventDefault();
                  setSelectedTab(id);
                }}
              >
                {name}
              </a>
            </li>
          ))
        }
      </ul>

      <div className="pt-3 pb-2 px-3 border border-top-0 mb-4">
        {
          tabs.map(({ id, renderContent }) => (
            <div id={id} key={id} className={classNames({ 'd-none': id !== selectedTab })}>
              {renderContent()}
            </div>
          ))
        }
      </div>

      <button className="btn btn-primary" onClick={onClickSave} type="button">
        Save settings
      </button>
    </form>
  );
}

ConventionForm.propTypes = {
  initialConvention: PropTypes.shape({}).isRequired,
  cmsLayouts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  pages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  saveConvention: PropTypes.func.isRequired,
};

export default ConventionForm;
