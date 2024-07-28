import { useContext } from 'react';
import * as React from 'react';

import { describeAdminPricingStructure } from '../describePricingStructure';
import { PricingStructureModalContext } from './EditPricingStructureModal';
import { EditingPricingStructure } from './EditingProductTypes';
import { useTranslation } from 'react-i18next';

export type PricingStructureInputProps = {
  value?: EditingPricingStructure | null;
  onChange: React.Dispatch<EditingPricingStructure>;
};

function PricingStructureInput({ value, onChange }: PricingStructureInputProps): JSX.Element {
  const pricingStructureModal = useContext(PricingStructureModalContext);
  const { t } = useTranslation();

  return (
    <>
      {describeAdminPricingStructure(value, t)}
      <button
        type="button"
        className="btn btn-link py-0"
        onClick={() => pricingStructureModal.open({ value, onChange })}
      >
        <i className="bi-pencil-fill" />
        <span className="visually-hidden">{t('buttons.edit')}</span>
      </button>
    </>
  );
}

export default PricingStructureInput;
