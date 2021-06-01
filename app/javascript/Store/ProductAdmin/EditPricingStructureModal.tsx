import { useState, useEffect, useCallback, useContext } from 'react';
import * as React from 'react';
import Modal from 'react-bootstrap4-modal';
import { MultipleChoiceInput, FormGroupWithLabel } from '@neinteractiveliterature/litform';
import { ModalData } from '@neinteractiveliterature/litform/lib/useModal';

import EnumTypes from '../../enumTypes.json';
import MoneyInput from '../MoneyInput';
import ScheduledValueEditor, {
  scheduledValueReducer,
} from '../../BuiltInFormControls/ScheduledValueEditor';
import AppRootContext from '../../AppRootContext';
import {
  Money,
  PricingStrategy,
  PricingStructure,
  ScheduledMoneyValue,
} from '../../graphqlTypes.generated';

const PRICING_STRATEGIES = EnumTypes.PricingStrategy.enumValues.map(({ name, description }) => ({
  value: name,
  label: description,
}));

type EditingPricingStructure = Omit<Partial<PricingStructure>, '__typename'>;

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

const buildScheduledMoneyValueInput = (
  value: Money | null | undefined,
  onChange: React.Dispatch<Money>,
) => <MoneyInput value={value} onChange={onChange} />;

export type EditPricingStructureModalProps = Pick<
  PricingStructureModalContextValue,
  'visible' | 'state' | 'close'
>;

function EditPricingStructureModal({ visible, state, close }: EditPricingStructureModalProps) {
  const { timezoneName } = useContext(AppRootContext);
  const [pricingStructure, setPricingStructure] = useState(state?.value);

  useEffect(() => {
    setPricingStructure(state?.value);
  }, [state?.value]);

  const dispatchScheduledValue = useCallback(
    (action) => {
      if (!pricingStructure) {
        return;
      }

      setPricingStructure({
        ...pricingStructure,
        value: scheduledValueReducer(
          (pricingStructure.value as ScheduledMoneyValue | undefined) ?? {
            timespans: [],
            __typename: 'ScheduledMoneyValue' as const,
          },
          action,
        ),
      });
    },
    [pricingStructure],
  );

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
        <MultipleChoiceInput
          caption="Pricing strategy"
          choices={PRICING_STRATEGIES}
          value={pricingStructure?.pricing_strategy}
          onChange={(strategy: PricingStrategy) =>
            setPricingStructure((prev) => ({
              ...prev,
              pricing_strategy: strategy,
            }))
          }
        />

        {pricingStructure?.pricing_strategy === 'fixed' && (
          <FormGroupWithLabel label="Price">
            {(id) => (
              <MoneyInput
                id={id}
                value={pricingStructure.value as Money | undefined}
                onChange={(price) => setPricingStructure((prev) => ({ ...prev, value: price }))}
              />
            )}
          </FormGroupWithLabel>
        )}

        {pricingStructure?.pricing_strategy === 'scheduled_value' && (
          <ScheduledValueEditor
            timezone={timezoneName}
            scheduledValue={
              (pricingStructure.value as ScheduledMoneyValue | undefined) ?? { timespans: [] }
            }
            dispatch={dispatchScheduledValue}
            buildValueInput={buildScheduledMoneyValueInput}
          />
        )}
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
