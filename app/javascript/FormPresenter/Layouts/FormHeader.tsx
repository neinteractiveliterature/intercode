import { forwardRef, useContext } from 'react';
import classNames from 'classnames';

import { SectionTraversalContext } from '../SectionTraversalContext';

export type FormHeaderProps = {
  isUpdatingResponse: boolean;
  isSubmittingResponse: boolean;
};

export default forwardRef<HTMLDivElement, FormHeaderProps>(function FormHeader(
  { isUpdatingResponse, isSubmittingResponse },
  ref,
) {
  const { currentSection } = useContext(SectionTraversalContext);

  return (
    <div className="card-header" ref={ref}>
      <div className="d-flex justify-content-between">
        <h4 className="mb-0">{currentSection?.title}</h4>
        <div
          className={classNames('spinner-border', {
            invisible: !(isUpdatingResponse || isSubmittingResponse),
          })}
          role="status"
        >
          {(isUpdatingResponse || isSubmittingResponse) && (
            <span className="visually-hidden">Saving...</span>
          )}
        </div>
      </div>
    </div>
  );
});
