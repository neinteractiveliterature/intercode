import { forwardRef, useContext, ReactNode } from 'react';
import { LoadingIndicator } from '@neinteractiveliterature/litform';

import { SectionTraversalContext } from '../SectionTraversalContext';

export type FormHeaderProps = {
  isUpdatingResponse: boolean;
  isSubmittingResponse: boolean;
};

const FormHeader = forwardRef<HTMLDivElement, FormHeaderProps>(
  ({ isUpdatingResponse, isSubmittingResponse }, ref) => {
    const { currentSection } = useContext(SectionTraversalContext);

    let loadingIndicator: ReactNode = null;
    if (isUpdatingResponse || isSubmittingResponse) {
      loadingIndicator = <LoadingIndicator />;
    }

    return (
      <div className="card-header" ref={ref}>
        <div className="d-flex justify-content-between">
          <h4 className="mb-0">{currentSection?.title}</h4>
          {loadingIndicator}
        </div>
      </div>
    );
  },
);

export default FormHeader;
