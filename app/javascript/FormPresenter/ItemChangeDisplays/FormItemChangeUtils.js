import MD5 from 'md5.js';
import moment from 'moment-timezone';

import Timespan from '../../Timespan';

export function sortChanges(changes) {
  return [...changes].sort((a, b) => (
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ));
}

export function getChangeId(change) {
  return new MD5()
    .update(`${change.field_identifier}-${change.previous_value}-${change.new_value}`)
    .digest('hex');
}

export function processChanges(changes, form) {
  return changes.map((change) => ({
    ...change,
    id: getChangeId(change),
    previous_value: JSON.parse(change.previous_value),
    new_value: JSON.parse(change.new_value),
    formItem: form.getItemWithIdentifier(change.field_identifier),
  }));
}

export function buildChangeGroups(changes, form) {
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
        moment(lastChange.created_at).diff(change.created_at, 'minutes') >= 60
        || change.user_con_profile.id !== lastChange.user_con_profile.id
      )
    ) {
      return [...workingSet, [change]];
    }

    return [...workingSet.slice(0, workingSet.length - 1), [...lastChangeGroup, change]];
  }, [[]]);

  return groupedChanges.map((changesInGroup) => ({
    changes: changesInGroup,
    id: new MD5().update(changesInGroup.map((c) => c.id).join(',')).digest('hex'),
  }));
}

export function getTimespanForChangeGroup(changeGroup) {
  const allTimestamps = [
    ...changeGroup.changes.map((c) => moment(c.created_at)),
    ...changeGroup.changes.map((c) => moment(c.updated_at)),
  ];

  allTimestamps.sort((a, b) => a.diff(b));

  return new Timespan(allTimestamps[0], allTimestamps[allTimestamps.length - 1]);
}
