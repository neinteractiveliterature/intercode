import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import AdminCaption from '../FormPresenter/ItemDisplays/AdminCaption';
import FormItemDisplay from '../FormPresenter/ItemDisplays/FormItemDisplay';
import ErrorDisplay from '../ErrorDisplay';
import Gravatar from '../Gravatar';
import LoadingIndicator from '../LoadingIndicator';
import { useEventProposalQueryWithOwnerQuery } from './queries.generated';
import { getSortedFormItems } from '../Models/Form';
import { TypedFormItem, parseFormItemObject } from '../FormAdmin/FormItemUtils';
import deserializeFormResponse from '../Models/deserializeFormResponse';

function EventProposalDisplay({ eventProposalId }) {
  const { data, loading, error } = useEventProposalQueryWithOwnerQuery({
    variables: { eventProposalId },
  });

  const formItems = useMemo(
    () =>
      loading || error || !data
        ? []
        : (getSortedFormItems(data.eventProposal.event_category.event_proposal_form!).map(
            parseFormItemObject,
          ) as TypedFormItem[]),
    [loading, error, data],
  );

  const formResponse = useMemo(
    () => (loading || error || !data ? undefined : deserializeFormResponse(data.eventProposal)),
    [loading, error, data],
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const renderFormItems = ({ convention }) => {
    if (formResponse == null) {
      return null;
    }

    return formItems.map((item) => {
      if (item.item_type === 'static_text') {
        return null;
      }

      return (
        <li
          className="p-3 border border-left-0 border-right-0 border-bottom-0 border-secondary"
          key={item.identifier}
        >
          <div className="row">
            <div className="col-md-2">
              <strong>
                <AdminCaption formItem={item} />
              </strong>
            </div>
            <div className="col-md-10">
              <FormItemDisplay
                formItem={item}
                convention={convention}
                value={formResponse.form_response_attrs[item.identifier]}
                displayMode="admin"
              />
            </div>
          </div>
        </li>
      );
    });
  };

  return (
    <ul className="list-unstyled my-4">
      <li className="p-3">
        <div className="row">
          <div className="col-md-2">
            <strong>Submitted by</strong>
          </div>
          <div className="col-md-10">
            <div className="d-flex align-items-center">
              <div className="mr-2">
                <Gravatar
                  url={data!.eventProposal.owner.gravatar_url}
                  enabled={data!.eventProposal.owner.gravatar_enabled}
                  pixelSize={32}
                />
              </div>
              <div>
                {data!.eventProposal.owner.name} (
                <a href={`mailto:${data!.eventProposal.owner.email}`}>
                  {data!.eventProposal.owner.email}
                </a>
                )
              </div>
            </div>
          </div>
        </div>
      </li>

      {renderFormItems({ convention: data!.convention! })}
    </ul>
  );
}

EventProposalDisplay.propTypes = {
  eventProposalId: PropTypes.number.isRequired,
};

export default EventProposalDisplay;
