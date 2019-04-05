import React, { forwardRef, useContext } from 'react';
import PropTypes from 'prop-types';

import LoadingIndicator from '../../LoadingIndicator';
import { SectionTraversalContext } from '../SectionTraversalContext';

const FormHeader = forwardRef(({ isUpdatingResponse, isSubmittingResponse }, ref) => {
  const { currentSection } = useContext(SectionTraversalContext);

  let loadingIndicator = null;
  if (isUpdatingResponse || isSubmittingResponse) {
    loadingIndicator = <LoadingIndicator />;
  }

  return (
    <div className="card-header" ref={ref}>
      <div className="d-flex justify-content-between">
        <h4 className="mb-0">{currentSection.title}</h4>
        {loadingIndicator}
      </div>
    </div>
  );
});

FormHeader.propTypes = {
  isUpdatingResponse: PropTypes.bool.isRequired,
  isSubmittingResponse: PropTypes.bool.isRequired,
};

export default FormHeader;
