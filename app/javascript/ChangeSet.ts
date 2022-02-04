import { useCallback, useState } from 'react';
import { ActionMeta } from 'react-select';
import { v4 as uuidv4 } from 'uuid';

type ChangeTrackable = {
  id: string;
};

type AddChange<T extends ChangeTrackable> = {
  changeType: 'add';
  generatedId: string;
  value: T;
};

type RemoveChange = {
  changeType: 'remove';
  id: string;
};

export type Change<T extends ChangeTrackable> = AddChange<T> | RemoveChange;

class ChangeSet<T extends ChangeTrackable> {
  changes: Change<T>[];

  constructor(changes: Change<T>[] = []) {
    this.changes = changes;
  }

  add(value: T, originalValues?: T[], comparisonFunction?: (a: T, b: T) => boolean): ChangeSet<T> {
    if (originalValues && comparisonFunction) {
      const removedValue = originalValues.find((originalValue) => comparisonFunction(value, originalValue));
      if (removedValue) {
        return new ChangeSet(
          this.changes.filter((change) => !(change.changeType === 'remove' && change.id === removedValue.id)),
        );
      }
    }

    return new ChangeSet([
      ...this.changes,
      {
        changeType: 'add',
        generatedId: uuidv4(),
        value,
      },
    ]);
  }

  remove(id: string): ChangeSet<T> {
    let newChanges: Change<T>[];
    if (this.changes.some((change) => change.changeType === 'add' && change.generatedId === id)) {
      newChanges = this.changes.filter((change) => !(change.changeType === 'add' && change.generatedId === id));
    } else {
      newChanges = [...this.changes, { changeType: 'remove', id }];
    }

    return new ChangeSet(newChanges);
  }

  apply(array: T[]): T[] {
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

  getAddValues(): T[] {
    return this.changes
      .filter((change): change is AddChange<T> => change.changeType === 'add')
      .map((change) => change.value);
  }

  getRemoveIds(): string[] {
    return this.changes
      .filter((change): change is RemoveChange => change.changeType === 'remove')
      .map((change) => change.id);
  }
}

export default ChangeSet;

export function useChangeSet<T extends ChangeTrackable>(): readonly [
  changeSet: ChangeSet<T>,
  add: (...addArgs: Parameters<ChangeSet<T>['add']>) => void,
  remove: (...removeArgs: Parameters<ChangeSet<T>['remove']>) => void,
  reset: () => void,
] {
  const [changeSet, setChangeSet] = useState(new ChangeSet<T>());

  const add = useCallback((...addArgs: Parameters<ChangeSet<T>['add']>) => {
    setChangeSet((prevChangeSet) => prevChangeSet.add(...addArgs));
  }, []);
  const remove = useCallback((...removeArgs: Parameters<ChangeSet<T>['remove']>) => {
    setChangeSet((prevChangeSet) => prevChangeSet.remove(...removeArgs));
  }, []);
  const reset = useCallback(() => setChangeSet(new ChangeSet<T>()), []);

  return [changeSet, add, remove, reset] as const;
}

export function useChangeSetWithSelect<T extends ChangeTrackable>(): [
  changeSet: ChangeSet<T>,
  onChange: (newValue: unknown, meta: ActionMeta<T>) => void,
] {
  const [changeSet, add, remove] = useChangeSet<T>();

  const onChange = (newValue: unknown, meta: ActionMeta<T>) => {
    if (meta.action === 'select-option' && meta.option) {
      add(meta.option);
    } else if (meta.action === 'remove-value') {
      remove(meta.removedValue.id);
    }
  };

  return [changeSet, onChange];
}
