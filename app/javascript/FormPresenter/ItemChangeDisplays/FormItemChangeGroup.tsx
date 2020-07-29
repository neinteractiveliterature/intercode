import React, { useContext, useMemo } from 'react';

import AppRootContext from '../../AppRootContext';
import FormItemChangeDisplay, { ConventionForFormItemChangeDisplay } from './FormItemChangeDisplay';
import TextDiffDisplay from './TextDiffDisplay';
import { getTimespanForChangeGroup, FormResponseChangeGroup } from './FormItemChangeUtils';
import { TypedFormItem } from '../../FormAdmin/FormItemUtils';

function describeFormItem(item: TypedFormItem | undefined | null, itemIdentifier: string) {
  if (!item) {
    return itemIdentifier;
  }

  if (item.admin_description) {
    return item.admin_description;
  }

  if (
    item.rendered_properties
    && Object.prototype.hasOwnProperty.call(item.rendered_properties, 'caption')
  ) {
    return (item.rendered_properties as { caption: string }).caption;
  }

  return itemIdentifier;
}

export type FormItemChangeGroupProps = {
  convention: ConventionForFormItemChangeDisplay,
  changeGroup: FormResponseChangeGroup,
};

function FormItemChangeGroup({ convention, changeGroup }: FormItemChangeGroupProps) {
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
                    before={(change.previous_value ?? '').toString()}
                    after={(change.new_value ?? '').toString()}
                  />
                )}
            </dd>
          </React.Fragment>
        ))}
      </dl>
    </section>
  );
}

export default FormItemChangeGroup;
