import { Fragment, useMemo } from 'react';

import FormItemChangeDisplay, { ConventionForFormItemChangeDisplay } from './FormItemChangeDisplay';
import TextDiffDisplay from './TextDiffDisplay';
import { getTimespanForChangeGroup, FormResponseChangeGroup } from './FormItemChangeUtils';
import { TypedFormItem } from '../../FormAdmin/FormItemUtils';
import { useAppDateTimeFormat } from '../../TimeUtils';

function describeFormItem(item: TypedFormItem | undefined | null, itemIdentifier: string) {
  if (!item) {
    return itemIdentifier;
  }

  if (item.admin_description) {
    return item.admin_description;
  }

  if (item.rendered_properties && Object.prototype.hasOwnProperty.call(item.rendered_properties, 'caption')) {
    return (item.rendered_properties as { caption: string }).caption;
  }

  return itemIdentifier;
}

export type FormItemChangeGroupProps = {
  convention: ConventionForFormItemChangeDisplay;
  changeGroup: FormResponseChangeGroup;
};

function FormItemChangeGroup({ convention, changeGroup }: FormItemChangeGroupProps): React.JSX.Element {
  const timespan = useMemo(() => getTimespanForChangeGroup(changeGroup), [changeGroup]);
  const format = useAppDateTimeFormat();

  return (
    <section key={changeGroup.id}>
      <h3>
        {changeGroup.changes[0].user_con_profile.name_without_nickname}
        {': '}
        {format(timespan.start, 'shortDateTime')} - {format(timespan.finish, 'shortTime')}
      </h3>
      <dl>
        {changeGroup.changes.map((change) => (
          <Fragment key={change.id}>
            <dt>{describeFormItem(change.formItem, change.field_identifier)}</dt>
            <dd>
              {change.formItem && change.formItem ? (
                <FormItemChangeDisplay formItem={change.formItem} change={change} convention={convention} />
              ) : (
                <TextDiffDisplay
                  before={(change.previous_value ?? '').toString()}
                  after={(change.new_value ?? '').toString()}
                />
              )}
            </dd>
          </Fragment>
        ))}
      </dl>
    </section>
  );
}

export default FormItemChangeGroup;
