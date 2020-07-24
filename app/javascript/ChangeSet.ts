import { useState } from 'react';
import { ActionMeta } from 'react-select';

type ChangeTrackable = {
  id: number,
};

type AddChange<T extends ChangeTrackable> = {
  changeType: 'add',
  generatedId: number,
  value: T,
};

type RemoveChange = {
  changeType: 'remove',
  id: number,
};

export type Change<T extends ChangeTrackable> = AddChange<T> | RemoveChange;

class ChangeSet<T extends ChangeTrackable> {
  changes: Change<T>[];

  constructor(changes: Change<T>[] = []) {
    this.changes = changes;
  }

  add(value: T, originalValues?: T[], comparisonFunction?: (a: T, b: T) => boolean) {
    if (originalValues && comparisonFunction) {
      const removedValue = originalValues
        .find((originalValue) => comparisonFunction(value, originalValue));
      if (removedValue) {
        return new ChangeSet(this.changes.filter((change) => (
          !(change.changeType === 'remove' && change.id === removedValue.id)
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

  remove(id: number) {
    let newChanges: Change<T>[];
    if (this.changes.some((change) => change.changeType === 'add' && change.generatedId === id)) {
      newChanges = this.changes.filter((change) => !(change.changeType === 'add' && change.generatedId === id));
    } else {
      newChanges = [
        ...this.changes,
        { changeType: 'remove', id },
      ];
    }

    return new ChangeSet(newChanges);
  }

  apply(array: T[]) {
    return this.changes.reduce((workingArray, change) => {
      if (change.changeType === 'add') {
        return [...workingArray, { ...change.value, id: change.generatedId }];
      }

      if (change.changeType === 'remove') {
        return workingArray.filter((value) => value.id !== change.id);
      }

      return workingArray;
    }, array);
  }

  getAddValues() {
    return this.changes.filter((change): change is AddChange<T> => change.changeType === 'add')
      .map((change) => change.value);
  }

  getRemoveIds() {
    return this.changes.filter((change): change is RemoveChange => change.changeType === 'remove')
      .map((change) => change.id);
  }
}

export default ChangeSet;

export function useChangeSet<T extends ChangeTrackable>() {
  const [changeSet, setChangeSet] = useState(new ChangeSet<T>());

  const add = (...addArgs: Parameters<ChangeSet<T>['add']>) => {
    setChangeSet(changeSet.add(...addArgs));
  };
  const remove = (...removeArgs: Parameters<ChangeSet<T>['remove']>) => {
    setChangeSet(changeSet.remove(...removeArgs));
  };

  return [changeSet, add, remove] as const;
}

export function useChangeSetWithSelect<T extends ChangeTrackable>() {
  const [changeSet, add, remove] = useChangeSet<T>();

  const onChange = (newValue: any, meta: ActionMeta<T>) => {
    if (meta.action === 'select-option') {
      add(meta.option!);
    } else if (meta.action === 'remove-value') {
      remove(meta.removedValue!.id);
    }
  };

  return [changeSet, onChange];
}
