import { useContext } from 'react';
import * as React from 'react';

import { describeAdminPricingStructure } from '../describePricingStructure';
import { PricingStructureModalContext } from './EditPricingStructureModal';
import { EditingPricingStructure } from './EditingProductTypes';

export type PricingStructureInputProps = {
  value?: EditingPricingStructure | null;
  onChange: React.Dispatch<EditingPricingStructure>;
};

function PricingStructureInput({ value, onChange }: PricingStructureInputProps): JSX.Element {
  const pricingStructureModal = useContext(PricingStructureModalContext);

  return (
    <>
      {describeAdminPricingStructure(value)}
      <button
        type="button"
        className="btn btn-link py-0"
        onClick={() => pricingStructureModal.open({ value, onChange })}
      >
        <i className="bi-pencil-fill" />
        <span className="visually-hidden">Edit</span>
      </button>
    </>
  );
}

export default PricingStructureInput;
