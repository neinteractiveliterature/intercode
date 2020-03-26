import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { describeAdminPricingStructure } from './describePricingStructure';
import { PricingStructureModalContext } from './EditPricingStructureModal';

function PricingStructureInput({ value, onChange }) {
  const pricingStructureModal = useContext(PricingStructureModalContext);

  return (
    <>
      {describeAdminPricingStructure(value)}
      <button
        type="button"
        className="btn btn-link py-0"
        onClick={() => pricingStructureModal.open({ value, onChange })}
      >
        <i className="fa fa-pencil" />
        <span className="sr-only">Edit</span>
      </button>
    </>
  );
}

PricingStructureInput.propTypes = {
  value: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
};

PricingStructureInput.defaultProps = {
  value: null,
};

export default PricingStructureInput;
