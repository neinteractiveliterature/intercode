import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import AppRootContext from '../../AppRootContext';
import FormItemChangeDisplay from './FormItemChangeDisplay';
import TextDiffDisplay from './TextDiffDisplay';
import { TimespanPropType } from '../../ScheduledValuePropTypes';
import { getTimespanForChangeGroup } from './FormItemChangeUtils';

function describeFormItem(item, itemIdentifier) {
  if (!item) {
    return itemIdentifier;
  }

  return item.admin_description || (item.properties || {}).caption || itemIdentifier;
}

function FormItemChangeGroup({ convention, changeGroup }) {
  const { timezoneName } = useContext(AppRootContext);
  const timespan = useMemo(
    () => getTimespanForChangeGroup(changeGroup),
    [changeGroup],
  );

  return (
    <section key={changeGroup.id}>
      <h3>
        {changeGroup.changes[0].user_con_profile.name_without_nickname}
        {': '}
        {timespan.humanizeInTimezone(timezoneName, 'MMMM DD, YYYY - h:mma', 'h:mma')}
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

FormItemChangeGroup.propTypes = {
  changeGroup: PropTypes.shape({
    id: PropTypes.string.isRequired,
    changes: PropTypes.arrayOf(PropTypes.shape({
      user_con_profile: PropTypes.shape({
        name_without_nickname: PropTypes.string.isRequired,
      }).isRequired,
    })).isRequired,
  }).isRequired,
  convention: PropTypes.shape({}).isRequired,
};

export default FormItemChangeGroup;
