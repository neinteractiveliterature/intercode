import { useState, useEffect } from 'react';
import * as React from 'react';
import { Modal } from 'react-bootstrap4-modal';

import EnumTypes from '../../enumTypes.json';
import MoneyInput from '../MoneyInput';
import { Money } from '../../graphqlTypes.generated';
import PricingStructureForm, { PricingStructureFormProps } from './PricingStructureForm';
import { useTranslation } from 'react-i18next';
import { ModalData } from '@neinteractiveliterature/litform';

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

  open: () => {},

  close: () => {},

  setState: () => {},
});

export const buildScheduledMoneyValueInput = (value: Money | null | undefined, onChange: React.Dispatch<Money>) => (
  <MoneyInput value={value} onChange={onChange} />
);

export type EditPricingStructureModalProps = Pick<PricingStructureModalContextValue, 'visible' | 'state' | 'close'>;

function EditPricingStructureModal({ visible, state, close }: EditPricingStructureModalProps): React.JSX.Element {
  const { t } = useTranslation();
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
      <div className="modal-header">{t('admin.store.pricingStructure.title')}</div>

      <div className="modal-body">
        <PricingStructureForm pricingStructure={pricingStructure} setPricingStructure={setPricingStructure} />
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" type="button" onClick={close}>
          {t('buttons.cancel')}
        </button>

        <button className="btn btn-primary" type="button" onClick={okClicked}>
          {t('buttons.ok')}
        </button>
      </div>
    </Modal>
  );
}

export default EditPricingStructureModal;
