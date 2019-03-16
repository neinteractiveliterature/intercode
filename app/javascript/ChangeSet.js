import { useState } from 'react';

class ChangeSet {
  constructor(changes = []) {
    this.changes = changes;
  }

  add(value, originalValues, comparisonFunction) {
    if (originalValues && comparisonFunction) {
      const removedValue = originalValues
        .find(originalValue => comparisonFunction(value, originalValue));
      if (removedValue) {
        return new ChangeSet(this.changes.filter(({ changeType, id }) => (
          !(changeType === 'remove' && id === removedValue.id)
        )));
      }
    }

    return new ChangeSet([
      ...this.changes,
      {
        changeType: 'add',
        generatedId: new Date().getTime(),
        value,
      },
    ]);
  }

  remove(id) {
    let newChanges;
    if (this.changes.some(change => change.generatedId === id)) {
      newChanges = this.changes.filter(change => change.generatedId !== id);
    } else {
      newChanges = [
        ...this.changes,
        { changeType: 'remove', id },
      ];
    }

    return new ChangeSet(newChanges);
  }

  apply(array) {
    return this.changes.reduce((workingArray, change) => {
      if (change.changeType === 'add') {
        return [...workingArray, { ...change.value, id: change.generatedId }];
      }

      if (change.changeType === 'remove') {
        return workingArray.filter(value => value.id !== change.id);
      }

      return workingArray;
    }, array);
  }

  getAddValues() {
    return this.changes.filter(change => change.changeType === 'add').map(change => change.value);
  }

  getRemoveIds() {
    return this.changes.filter(change => change.changeType === 'remove').map(change => change.id);
  }
}

export default ChangeSet;

export function useChangeSet() {
  const [changeSet, setChangeSet] = useState(new ChangeSet());

  const add = (...addArgs) => { setChangeSet(changeSet.add(...addArgs)); };
  const remove = (...removeArgs) => { setChangeSet(changeSet.remove(...removeArgs)); };

  return [changeSet, add, remove];
}

export function useChangeSetWithSelect() {
  const [changeSet, add, remove] = useChangeSet();

  const onChange = (newValue, { action, option, removedValue }) => {
    if (action === 'select-option') {
      add(option);
    } else if (action === 'remove-value') {
      remove(removedValue.id);
    }
  };

  return [changeSet, onChange];
}
