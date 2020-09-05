import React, { ReactNode } from 'react';
import uniq from 'lodash/uniq';

import TextDiffDisplay from './TextDiffDisplay';

export type ObjectDiffRenderFunction<T> = (
  key: string,
  beforeValue: T | undefined,
  afterValue: T | undefined,
) => ReactNode;

export type ObjectDiffDisplayProps<T> = {
  before?: T;
  after?: T;
  renderKey?: ObjectDiffRenderFunction<any>;
  renderValue?: ObjectDiffRenderFunction<any>;
  showUnchanged?: boolean;
};

function ObjectDiffDisplay<T>({
  before,
  after,
  renderKey,
  renderValue,
  showUnchanged,
}: ObjectDiffDisplayProps<T>) {
  const combinedKeys = uniq([...Object.keys(before || {}), ...Object.keys(after || {})]).sort();

  const keyRenderer = renderKey ?? ((key) => key);
  const valueRenderer =
    renderValue ??
    ((key, beforeValue, afterValue) => (
      <TextDiffDisplay
        before={(beforeValue ?? '').toString()}
        after={(afterValue ?? '').toString()}
      />
    ));

  return (
    <dl className="row mb-0">
      {combinedKeys.map((key) => {
        const beforeValue = before ? (before as any)[key] : undefined;
        const afterValue = after ? (after as any)[key] : undefined;

        if (!showUnchanged && JSON.stringify(beforeValue) === JSON.stringify(afterValue)) {
          return null;
        }

        return (
          <React.Fragment key={key}>
            <dt className="col-sm-3">{keyRenderer(key, beforeValue, afterValue)}</dt>
            <dd className="col-sm-9">{valueRenderer(key, beforeValue, afterValue)}</dd>
          </React.Fragment>
        );
      })}
    </dl>
  );
}

export default ObjectDiffDisplay;
