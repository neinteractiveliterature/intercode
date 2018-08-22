import React from 'react';
import PropTypes from 'prop-types';

import AdminCaption from '../FormPresenter/ItemDisplays/AdminCaption';
import { deserializeForm, deserializeFormResponseModel } from '../FormPresenter/GraphQLFormDeserialization';
import { eventProposalQueryWithOwner } from './queries';
import FormItemDisplay from '../FormPresenter/ItemDisplays/FormItemDisplay';
import QueryWithStateDisplay from '../QueryWithStateDisplay';

class EventProposalDisplay extends React.Component {
  static propTypes = {
    eventProposalId: PropTypes.number.isRequired,
  };

  renderFormItems = ({ convention, eventProposal }) => {
    const form = deserializeForm(convention.event_proposal_form);
    const formResponse = deserializeFormResponseModel(eventProposal);

    return form.getAllItems().map((item) => {
      if (item.itemType === 'static_text') {
        return null;
      }

      return (
        <li className="p-3 border border-left-0 border-right-0 border-bottom-0 border-secondary" key={item.identifier}>
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
                value={formResponse.formResponseAttrs[item.identifier]}
              />
            </div>
          </div>
        </li>
      );
    });
  }

  render = () => (
    <QueryWithStateDisplay
      query={eventProposalQueryWithOwner}
      variables={{ eventProposalId: this.props.eventProposalId }}
    >
      {({ data }) => (
        <ul className="list-unstyled my-4">
          <li className="p-3">
            <div className="row">
              <div className="col-md-2">
                <strong>Submitted by</strong>
              </div>
              <div className="col-md-10">
                {data.eventProposal.owner.name}
              </div>
            </div>
          </li>

          {this.renderFormItems(data)}
        </ul>
      )}
    </QueryWithStateDisplay>
  )
}

export default EventProposalDisplay;
