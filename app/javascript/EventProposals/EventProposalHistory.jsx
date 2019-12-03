import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  NavLink, Route, Switch, Redirect, useRouteMatch,
} from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';

import { EventProposalHistoryQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';
import AppRootContext from '../AppRootContext';
import Form from '../Models/Form';
import FormItemChangeDisplay from '../FormPresenter/ItemChangeDisplays/FormItemChangeDisplay';
import TextDiffDisplay from '../FormPresenter/ItemChangeDisplays/TextDiffDisplay';
import { buildChangeGroups } from '../FormPresenter/ItemChangeDisplays/FormItemChangeUtils';
import { TimespanPropType } from '../ScheduledValuePropTypes';

function describeFormItem(item, itemIdentifier) {
  if (!item) {
    return itemIdentifier;
  }

  return item.admin_description || (item.properties || {}).caption || itemIdentifier;
}

function EventProposalHistoryChangeGroup({ convention, changeGroup }) {
  const { timezoneName } = useContext(AppRootContext);

  return (
    <section key={changeGroup.id}>
      <h3>
        {changeGroup.changes[0].user_con_profile.name_without_nickname}
        {': '}
        {changeGroup.timespan.humanizeInTimezone(timezoneName, 'MMMM DD, YYYY - h:mma', 'h:mma')}
      </h3>
      <dl>
        {changeGroup.changes.map((change) => (
          <React.Fragment key={change.id}>
            <dt>
              {describeFormItem(change.formItem, change.field_identifier)}
            </dt>
            <dd>
              {change.formItem
                ? (
                  <FormItemChangeDisplay
                    formItem={change.formItem}
                    change={change}
                    convention={convention}
                  />
                )
                : (
                  <TextDiffDisplay
                    before={(change.previous_value || '').toString()}
                    after={(change.new_value || '').toString()}
                  />
                )}
            </dd>
          </React.Fragment>
        ))}
      </dl>
    </section>
  );
}

EventProposalHistoryChangeGroup.propTypes = {
  changeGroup: PropTypes.shape({
    id: PropTypes.string.isRequired,
    changes: PropTypes.arrayOf(PropTypes.shape({
      user_con_profile: PropTypes.shape({
        name_without_nickname: PropTypes.string.isRequired,
      }).isRequired,
    })).isRequired,
    timespan: TimespanPropType.isRequired,
  }).isRequired,
  convention: PropTypes.shape({}).isRequired,
};

const EXCLUDE_FIELDS = new Set([
  'minimum_age', 'age_restrictions_description',
  'con_mail_destination', 'email', 'team_mailing_list_name',
]);

function EventProposalHistory() {
  const { timezoneName } = useContext(AppRootContext);
  const match = useRouteMatch();
  const { data, loading, error } = useQuery(EventProposalHistoryQuery, {
    variables: { id: Number.parseInt(match.params.id, 10) },
  });

  const changes = useMemo(
    () => ((loading || error)
      ? []
      : data.eventProposal.form_response_changes.filter((change) => (
        !EXCLUDE_FIELDS.has(change.field_identifier)
      ))
    ),
    [data, error, loading],
  );

  const form = useMemo(
    () => (
      loading || error
        ? null
        : Form.fromApiResponse(
          JSON.parse(data.eventProposal.event_category.event_proposal_form.form_api_json),
        )
    ),
    [data, error, loading],
  );

  const changeGroups = useMemo(
    () => buildChangeGroups(changes, form),
    [changes, form],
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (changes.length === 0) {
    return 'No changes.';
  }

  return (
    <div className="row">
      <nav className="col-md-3">
        <ul className="nav flex-column nav-pills">
          {changeGroups.map((changeGroup) => (
            <li className="nav-item" key={changeGroup.id}>
              <NavLink
                to={`/admin_event_proposals/${match.params.id}/history/${changeGroup.id}`}
                className="nav-link"
              >
                <strong>{changeGroup.changes[0].user_con_profile.name_without_nickname}</strong>
                <br />
                <small>
                  {changeGroup.timespan
                    .humanizeInTimezone(timezoneName, 'MMMM DD, YYYY - h:mma', 'h:mma')}
                </small>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="col-md-9">
        <Switch>
          {changeGroups.map((changeGroup) => (
            <Route
              key={changeGroup.id}
              path={`/admin_event_proposals/${match.params.id}/history/${changeGroup.id}`}
              render={() => (
                <EventProposalHistoryChangeGroup
                  convention={data.convention}
                  changeGroup={changeGroup}
                />
              )}
            />
          ))}
          <Redirect to={`/admin_event_proposals/${match.params.id}/history/${changeGroups[0].id}`} />
        </Switch>
      </div>
    </div>
  );
}

export default EventProposalHistory;
