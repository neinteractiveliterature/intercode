// @ts-expect-error
import MD5 from 'md5.js';
import { parseISO, compareAsc, differenceInMinutes } from 'date-fns';

import Timespan from '../../Timespan';
import { FormResponseChange, UserConProfile } from '../../graphqlTypes.generated';
import { CommonFormFieldsFragment } from '../../Models/commonFormFragments.generated';
import { getFormItemsByIdentifier } from '../../Models/Form';
import {
  ParsedFormItem,
  parseFormItemObject,
  FormItemValueType,
} from '../../FormAdmin/FormItemUtils';

export function sortChanges<T extends Pick<FormResponseChange, 'created_at'>>(changes: T[]) {
  return [...changes].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function getChangeId(
  change: Pick<FormResponseChange, 'field_identifier' | 'previous_value' | 'new_value'>,
) {
  return new MD5()
    .update(`${change.field_identifier}-${change.previous_value}-${change.new_value}`)
    .digest('hex');
}

export type ParsedFormResponseChange<
  FormItemType extends ParsedFormItem<any, any, any> = ParsedFormItem<any, any, any>
> = Omit<FormResponseChange, 'previous_value' | 'new_value' | 'user_con_profile'> & {
  id: string;
  previous_value: FormItemValueType<FormItemType>;
  new_value: FormItemValueType<FormItemType>;
  user_con_profile: Partial<UserConProfile>;
  formItem: FormItemType;
};

export type ParseableFormResponseChange = Pick<
  FormResponseChange,
  '__typename' | 'field_identifier' | 'previous_value' | 'new_value' | 'created_at' | 'updated_at'
> & {
  user_con_profile: Partial<UserConProfile>;
};

export function processChanges<T extends ParseableFormResponseChange>(
  changes: T[],
  form: CommonFormFieldsFragment,
): ParsedFormResponseChange[] {
  const formItemsByIdentifier = getFormItemsByIdentifier(form);
  return changes.map((change) => ({
    compacted: false,
    ...change,
    id: getChangeId(change),
    previous_value: JSON.parse(change.previous_value),
    new_value: JSON.parse(change.new_value),
    formItem: parseFormItemObject(formItemsByIdentifier[change.field_identifier]),
  }));
}

export type FormResponseChangeGroup = {
  id: string;
  changes: ParsedFormResponseChange[];
};

export function buildChangeGroups(
  changes: ParseableFormResponseChange[],
  form: CommonFormFieldsFragment,
): FormResponseChangeGroup[] {
  const sortedProcessedChanges = processChanges(sortChanges(changes), form);

  if (sortedProcessedChanges.length === 0) {
    return [];
  }

  const groupedChanges = sortedProcessedChanges.reduce<typeof sortedProcessedChanges[]>(
    (workingSet, change) => {
      const lastChangeGroup = workingSet[workingSet.length - 1];
      const lastChange =
        lastChangeGroup.length > 0 ? lastChangeGroup[lastChangeGroup.length - 1] : null;
      if (
        lastChange &&
        (differenceInMinutes(parseISO(lastChange.created_at), parseISO(change.created_at)) >= 60 ||
          change.user_con_profile.id !== lastChange.user_con_profile.id)
      ) {
        return [...workingSet, [change]];
      }

      return [...workingSet.slice(0, workingSet.length - 1), [...lastChangeGroup, change]];
    },
    [[]],
  );

  return groupedChanges.map((changesInGroup) => ({
    changes: changesInGroup,
    id: new MD5().update(changesInGroup.map((c) => c.id).join(',')).digest('hex'),
  }));
}

export function getTimespanForChangeGroup(
  changeGroup: FormResponseChangeGroup,
  timezoneName: string,
) {
  const allTimestamps = [
    ...changeGroup.changes.map((c) => parseISO(c.created_at)),
    ...changeGroup.changes.map((c) => parseISO(c.updated_at)),
  ];

  allTimestamps.sort(compareAsc);

  return Timespan.finiteFromDates(
    allTimestamps[0],
    allTimestamps[allTimestamps.length - 1],
    timezoneName,
  );
}
