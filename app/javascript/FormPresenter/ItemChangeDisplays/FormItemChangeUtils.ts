// @ts-expect-error md5.js has no type definitions
import MD5 from 'md5.js';
import { DateTime } from 'luxon';
import sortBy from 'lodash/sortBy';

import Timespan, { FiniteTimespan } from '../../Timespan';
import { FormResponseChange, UserConProfile } from '../../graphqlTypes.generated';
import { CommonFormFieldsFragment } from '../../Models/commonFormFragments.generated';
import { getFormItemsByIdentifier } from '../../Models/Form';
import {
  ParsedFormItem,
  FormItemValueType,
  TypedFormItem,
  parseTypedFormItemObject,
  valueIsValidForFormItemType,
} from '../../FormAdmin/FormItemUtils';

export function sortChanges<T extends Pick<FormResponseChange, 'created_at'>>(changes: T[]): T[] {
  return [...changes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getChangeId(
  change: Pick<FormResponseChange, 'field_identifier' | 'previous_value' | 'new_value'>,
): string {
  return new MD5().update(`${change.field_identifier}-${change.previous_value}-${change.new_value}`).digest('hex');
}

export type UnknownFormItemType = ParsedFormItem<unknown, { toString(): string }, string>;

export type ParsedFormResponseChange<FormItemType extends TypedFormItem> = Omit<
  FormResponseChange,
  'previous_value' | 'new_value' | 'user_con_profile'
> & {
  id: string;
  previous_value: FormItemValueType<FormItemType> | undefined;
  new_value: FormItemValueType<FormItemType> | undefined;
  user_con_profile: Partial<Omit<UserConProfile, 'id'> & { id: string }>;
  formItem: FormItemType;
};

export type ParseableFormResponseChange = Pick<
  FormResponseChange,
  '__typename' | 'field_identifier' | 'previous_value' | 'new_value' | 'created_at' | 'updated_at'
> & {
  user_con_profile: Partial<Omit<UserConProfile, 'id'> & { id: string }>;
};

export function processChanges<T extends ParseableFormResponseChange>(
  changes: T[],
  form: CommonFormFieldsFragment,
): ParsedFormResponseChange<TypedFormItem>[] {
  const formItemsByIdentifier = getFormItemsByIdentifier(form);
  return changes.map((change) => {
    const formItem = parseTypedFormItemObject(formItemsByIdentifier[change.field_identifier]);
    if (!formItem) {
      throw new Error(`Invalid form item type: ${formItemsByIdentifier[change.field_identifier].identifier}`);
    }
    const previousValue = change.previous_value ? JSON.parse(change.previous_value) : undefined;
    const newValue = change.new_value ? JSON.parse(change.new_value) : undefined;

    if (previousValue && !valueIsValidForFormItemType(formItem, previousValue)) {
      throw new Error(`Invalid previous_value for ${formItem.item_type} item: ${change.previous_value}`);
    }

    if (newValue && !valueIsValidForFormItemType(formItem, newValue)) {
      throw new Error(`Invalid new_value for ${formItem.item_type} item: ${change.new_value}`);
    }

    return {
      compacted: false,
      ...change,
      id: getChangeId(change),
      previous_value: previousValue,
      new_value: newValue,
      formItem,
    };
  });
}

export type FormResponseChangeGroup = {
  id: string;
  changes: ParsedFormResponseChange<TypedFormItem>[];
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
      const lastChange = lastChangeGroup.length > 0 ? lastChangeGroup[lastChangeGroup.length - 1] : null;
      if (
        lastChange &&
        (DateTime.fromISO(lastChange.created_at).diff(DateTime.fromISO(change.created_at), 'minutes').minutes >= 60 ||
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

export function getTimespanForChangeGroup(changeGroup: FormResponseChangeGroup): FiniteTimespan {
  const allTimestamps = [
    ...changeGroup.changes.map((c) => DateTime.fromISO(c.created_at)),
    ...changeGroup.changes.map((c) => DateTime.fromISO(c.updated_at)),
  ];

  const sortedTimestamps = sortBy(allTimestamps, (timestamp) => timestamp.toMillis());

  return Timespan.finiteFromDateTimes(sortedTimestamps[0], sortedTimestamps[sortedTimestamps.length - 1]);
}
