import React, {
  useState, useEffect, useCallback, useContext,
} from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';

import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import EnumTypes from '../enumTypes.json';
import FormGroupWithLabel from '../BuiltInFormControls/FormGroupWithLabel';
import MoneyInput from './MoneyInput';
import ScheduledValueEditor, { scheduledValueReducer } from '../BuiltInFormControls/ScheduledValueEditor';
import AppRootContext from '../AppRootContext';

const PRICING_STRATEGIES = EnumTypes.PricingStrategy.enumValues
  .map(({ name, description }) => ({ value: name, label: description }));

export const PricingStructureModalContext = React.createContext({
  visible: false,
  value: null,
  onChange: () => {},
  close: () => {},
});

const buildScheduledMoneyValueInput = (value, onChange) => (
  <MoneyInput
    value={value}
    onChange={onChange}
  />
);

function EditPricingStructureModal({
  visible, value, onChange, close,
}) {
  const { timezoneName } = useContext(AppRootContext);
  const [pricingStructure, setPricingStructure] = useState(value);

  useEffect(
    () => { setPricingStructure(value); },
    [value],
  );

  const dispatchScheduledValue = useCallback(
    (action) => {
      setPricingStructure((prev) => ({
        ...prev,
        value: scheduledValueReducer(pricingStructure.value, action),
      }));
    },
    [pricingStructure],
  );

  const okClicked = () => {
    onChange(pricingStructure);
    close();
  };

  return (
    <Modal dialogClassName="modal-xl" visible={visible}>
      <div className="modal-header">Pricing structure</div>

      <div className="modal-body">
        {pricingStructure && (
          <>
            <MultipleChoiceInput
              caption="Pricing strategy"
              choices={PRICING_STRATEGIES}
              value={pricingStructure.pricing_strategy}
              onChange={(strategy) => setPricingStructure((prev) => ({
                ...prev, pricing_strategy: strategy,
              }))}
            />

            {pricingStructure.pricing_strategy === 'fixed' && (
              <FormGroupWithLabel label="Price">
                {(id) => (
                  <MoneyInput
                    id={id}
                    value={pricingStructure.value}
                    onChange={(price) => setPricingStructure((prev) => ({ ...prev, value: price }))}
                  />
                )}
              </FormGroupWithLabel>
            )}

            {pricingStructure.pricing_strategy === 'scheduled_value' && (
              <ScheduledValueEditor
                timezone={timezoneName}
                scheduledValue={pricingStructure.value}
                dispatch={dispatchScheduledValue}
                buildValueInput={buildScheduledMoneyValueInput}
              />
            )}
          </>
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

EditPricingStructureModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.shape({}),
};

EditPricingStructureModal.defaultProps = {
  onChange: null,
  value: null,
};

export default EditPricingStructureModal;
