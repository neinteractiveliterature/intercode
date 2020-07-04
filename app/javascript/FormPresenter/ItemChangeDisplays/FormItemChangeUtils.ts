import MD5 from 'md5.js';
import { DateTime } from 'luxon';

import Timespan from '../../Timespan';
import { FormResponseChange, Scalars } from '../../graphqlTypes.generated';
import Form from '../../Models/Form';
import { ParsedFormItem } from '../../FormAdmin/FormItemUtils';

export type ParsedFormResponseChange<
ValueType,
FormItemType extends ParsedFormItem<ValueType, any>
> = {
  id: string,
  created_at: Scalars['Date'],
  updated_at: Scalars['Date'],
  field_identifier: string,
  previous_value: ValueType,
  new_value: ValueType,
  formItem: FormItemType,
  user_con_profile: FormResponseChange['user_con_profile']
};

export function sortChanges(changes: FormResponseChange[]) {
  return [...changes].sort((a, b) => (
    DateTime.fromISO(b.created_at).valueOf() - DateTime.fromISO(a.created_at).valueOf()
  ));
}

export function getChangeId(
  change: Pick<FormResponseChange, 'field_identifier' | 'previous_value' | 'new_value'>,
): string {
  return new MD5()
    .update(`${change.field_identifier}-${change.previous_value}-${change.new_value}`)
    .digest('hex');
}

export function processChanges(changes: FormResponseChange[], form: Form) {
  return changes.map((change) => {
    const parsedChange: ParsedFormResponseChange<any, any> = ({
      ...change,
      created_at: change.created_at,
      id: getChangeId(change),
      previous_value: JSON.parse(change.previous_value),
      new_value: JSON.parse(change.new_value),
      formItem: form.getItemWithIdentifier(change.field_identifier),
    });
    return parsedChange;
  });
}

export type ChangeGroup = {
  changes: ParsedFormResponseChange<any, any>[],
  id: string,
};

export function buildChangeGroups(changes: FormResponseChange[], form: Form): ChangeGroup[] {
  const sortedProcessedChanges = processChanges(sortChanges(changes), form);

  if (sortedProcessedChanges.length === 0) {
    return [];
  }

  const groupedChanges = sortedProcessedChanges.reduce((workingSet, change) => {
    const lastChangeGroup = workingSet[workingSet.length - 1];
    const lastChange = (
      lastChangeGroup.length > 0 ? lastChangeGroup[lastChangeGroup.length - 1] : null
    );
    if (
      lastChange && (
        DateTime.fromISO(lastChange.created_at)
          .diff(DateTime.fromISO(change.created_at), 'minutes').minutes >= 60
        || change.user_con_profile.id !== lastChange.user_con_profile.id
      )
    ) {
      return [...workingSet, [change]];
    }

    return [...workingSet.slice(0, workingSet.length - 1), [...lastChangeGroup, change]];
  }, [[]] as ParsedFormResponseChange<any, any>[][]);

  return groupedChanges.map((changesInGroup) => ({
    changes: changesInGroup,
    id: new MD5().update(changesInGroup.map((c) => c.id).join(',')).digest('hex'),
  }));
}

export function getTimespanForChangeGroup(changeGroup: ChangeGroup) {
  const allTimestamps = [
    ...changeGroup.changes.map((c) => DateTime.fromISO(c.created_at)),
    ...changeGroup.changes.map((c) => DateTime.fromISO(c.updated_at)),
  ];

  allTimestamps.sort((a, b) => a.diff(b).valueOf());

  return Timespan.fromDateTimes(allTimestamps[0], allTimestamps[allTimestamps.length - 1]);
}
