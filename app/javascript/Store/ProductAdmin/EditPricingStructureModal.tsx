import { useState, useEffect } from 'react';
import * as React from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ModalData } from '@neinteractiveliterature/litform/lib/useModal';

import EnumTypes from '../../enumTypes.json';
import MoneyInput from '../MoneyInput';
import { Money } from '../../graphqlTypes.generated';
import PricingStructureForm, { PricingStructureFormProps } from './PricingStructureForm';

type EditingPricingStructure = PricingStructureFormProps['pricingStructure'];

export const PRICING_STRATEGIES = EnumTypes.PricingStrategy.enumValues.map(({ name, description }) => ({
  value: name,
  label: description,
}));

export type PricingStructureModalState = {
  value: EditingPricingStructure | null | undefined;
  onChange: React.Dispatch<EditingPricingStructure | undefined>;
};

export type PricingStructureModalContextValue = ModalData<PricingStructureModalState>;

export const PricingStructureModalContext = React.createContext<PricingStructureModalContextValue>({
  visible: false,
  state: undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  open: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setState: () => {},
});

export const buildScheduledMoneyValueInput = (value: Money | null | undefined, onChange: React.Dispatch<Money>) => (
  <MoneyInput value={value} onChange={onChange} />
);

export type EditPricingStructureModalProps = Pick<PricingStructureModalContextValue, 'visible' | 'state' | 'close'>;

function EditPricingStructureModal({ visible, state, close }: EditPricingStructureModalProps): JSX.Element {
  const [pricingStructure, setPricingStructure] = useState(state?.value);

  useEffect(() => {
    setPricingStructure(state?.value);
  }, [state?.value]);

  const okClicked = () => {
    if (pricingStructure && state?.onChange) {
      state.onChange(pricingStructure);
    }
    close();
  };

  return (
    <Modal dialogClassName="modal-xl" visible={visible}>
      <div className="modal-header">Pricing structure</div>

      <div className="modal-body">
        <PricingStructureForm pricingStructure={pricingStructure} setPricingStructure={setPricingStructure} />
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" type="button" onClick={close}>
          Cancel
        </button>

        <button className="btn btn-primary" type="button" onClick={okClicked}>
          OK
        </button>
      </div>
    </Modal>
  );
}

export default EditPricingStructureModal;
