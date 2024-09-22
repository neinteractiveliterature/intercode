import { useMemo } from 'react';

import AdminCaption from '../FormPresenter/ItemDisplays/AdminCaption';
import FormItemDisplay from '../FormPresenter/ItemDisplays/FormItemDisplay';
import Gravatar from '../Gravatar';
import { getSortedFormItems } from '../Models/Form';
import { parseTypedFormItemArray } from '../FormAdmin/FormItemUtils';
import { useSuspenseQuery } from '@apollo/client';
import { EventProposalQueryWithOwnerDocument } from './queries.generated';

export type EventProposalDisplayProps = {
  eventProposalId: string;
};

export default function EventProposalDisplay({ eventProposalId }: EventProposalDisplayProps) {
  const { data } = useSuspenseQuery(EventProposalQueryWithOwnerDocument, { variables: { eventProposalId } });
  const formItems = useMemo(() => {
    const form = data.convention.event_proposal.event_category.event_proposal_form;
    if (!form) {
      throw new Error(`Event category ${data.convention.event_proposal.event_category.name} has no proposal form`);
    }
    return parseTypedFormItemArray(getSortedFormItems(form));
  }, [data]);

  const formResponse = useMemo(
    () => JSON.parse(data.convention.event_proposal.form_response_attrs_json_with_rendered_markdown ?? '{}'),
    [data.convention.event_proposal.form_response_attrs_json_with_rendered_markdown],
  );

  const renderFormItems = () => {
    if (formResponse == null) {
      return null;
    }

    return formItems.map((item) => {
      if (item.item_type === 'static_text') {
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
                convention={data.convention}
                value={formResponse[item.identifier]}
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
              <div className="me-2">
                <Gravatar
                  url={data.convention.event_proposal.owner.gravatar_url}
                  enabled={data.convention.event_proposal.owner.gravatar_enabled}
                  pixelSize={32}
                />
              </div>
              <div>
                {data.convention.event_proposal.owner.name} (
                <a href={`mailto:${data.convention.event_proposal.owner.email}`}>
                  {data.convention.event_proposal.owner.email}
                </a>
                )
              </div>
            </div>
          </div>
        </div>
      </li>

      {renderFormItems()}
    </ul>
  );
}
