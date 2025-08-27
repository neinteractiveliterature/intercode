import { Fragment, ReactNode } from 'react';
import uniq from 'lodash/uniq';

import TextDiffDisplay from './TextDiffDisplay';

export type ObjectDiffRenderFunction<T> = <Key extends keyof T = keyof T>(
  key: Key,
  beforeValue: T[Key] | undefined,
  afterValue: T[Key] | undefined,
) => ReactNode;

export type ObjectDiffDisplayProps<T> = {
  before?: T;
  after?: T;
  renderKey?: ObjectDiffRenderFunction<T>;
  renderValue?: ObjectDiffRenderFunction<T>;
  showUnchanged?: boolean;
};

function ObjectDiffDisplay<T extends Record<string, { toString(): string } | undefined | null>>({
  before,
  after,
  renderKey,
  renderValue,
  showUnchanged,
}: ObjectDiffDisplayProps<T>): React.JSX.Element {
  const combinedKeys = uniq([...Object.keys(before || {}), ...Object.keys(after || {})]).sort();

  const keyRenderer = renderKey ?? ((key: ReactNode) => key);
  const valueRenderer: ObjectDiffRenderFunction<T> =
    renderValue ??
    ((key, beforeValue, afterValue) => (
      <TextDiffDisplay before={(beforeValue ?? '').toString()} after={(afterValue ?? '').toString()} />
    ));

  return (
    <dl className="row mb-0">
      {combinedKeys.map((key: keyof T) => {
        const beforeValue = before ? before[key] : undefined;
        const afterValue = after ? after[key] : undefined;

        if (!showUnchanged && JSON.stringify(beforeValue) === JSON.stringify(afterValue)) {
          return null;
        }

        return (
          <Fragment key={key.toString()}>
            <dt className="col-sm-3">{keyRenderer(key.toString(), beforeValue, afterValue)}</dt>
            <dd className="col-sm-9">{valueRenderer(key, beforeValue, afterValue)}</dd>
          </Fragment>
        );
      })}
    </dl>
  );
}

export default ObjectDiffDisplay;
