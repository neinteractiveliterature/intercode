import { useCallback, useContext } from 'react';
import * as React from 'react';
import { MultipleChoiceInput, FormGroupWithLabel } from '@neinteractiveliterature/litform';
import MoneyInput from '../MoneyInput';
import ScheduledValueEditor, { scheduledValueReducer } from '../../BuiltInFormControls/ScheduledValueEditor';
import AppRootContext from '../../AppRootContext';
import {
  Money,
  PayWhatYouWantValue,
  PricingStrategy,
  PricingStructure,
  ScheduledMoneyValue,
} from '../../graphqlTypes.generated';
import assertNever from 'assert-never';
import { PRICING_STRATEGIES, buildScheduledMoneyValueInput } from './EditPricingStructureModal';

type EditingPricingStructure = Partial<PricingStructure>;

export type PricingStructureFormProps = {
  pricingStructure: EditingPricingStructure | null | undefined;
  setPricingStructure: React.Dispatch<React.SetStateAction<EditingPricingStructure | undefined>>;
};

export default function PricingStructureForm({ pricingStructure, setPricingStructure }: PricingStructureFormProps) {
  const { timezoneName } = useContext(AppRootContext);

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
    [pricingStructure, setPricingStructure],
  );

  return (
    <>
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

      {!pricingStructure?.pricing_strategy ? (
        <></>
      ) : pricingStructure.pricing_strategy === PricingStrategy.Fixed ? (
        <FormGroupWithLabel label="Price">
          {(id) => (
            <MoneyInput
              id={id}
              value={pricingStructure.value as Money | undefined}
              onChange={(price) => setPricingStructure((prev) => ({ ...prev, value: price }))}
            />
          )}
        </FormGroupWithLabel>
      ) : pricingStructure.pricing_strategy === PricingStrategy.ScheduledValue ? (
        <fieldset>
          <legend className="col-form-label">Pricing schedule</legend>
          <ScheduledValueEditor
            timezone={timezoneName}
            scheduledValue={(pricingStructure.value as ScheduledMoneyValue | undefined) ?? { timespans: [] }}
            dispatch={dispatchScheduledValue}
            buildValueInput={buildScheduledMoneyValueInput}
          />
        </fieldset>
      ) : pricingStructure.pricing_strategy === PricingStrategy.PayWhatYouWant ? (
        <div className="d-flex flex-column flex-md-row">
          {(
            [
              ['minimum_amount', { label: 'Minimum amount', helpText: 'Optional, will default to $0' }],
              ['suggested_amount', { label: 'Suggested amount', helpText: 'Optional' }],
              ['maximum_amount', { label: 'Maximum amount', helpText: 'Optional' }],
            ] as const
          ).map(([fieldName, formGroupProps]) => (
            <FormGroupWithLabel
              key={fieldName}
              wrapperDivClassName="me-0 me-md-2 mb-3 mb-md-0 flex-grow-1"
              {...formGroupProps}
            >
              {(id) => (
                <MoneyInput
                  id={id}
                  value={((pricingStructure.value as PayWhatYouWantValue | undefined) ?? {})[fieldName]}
                  onChange={(newValue) =>
                    setPricingStructure((prev) => ({
                      ...prev,
                      value: { ...prev?.value, __typename: 'PayWhatYouWantValue', [fieldName]: newValue },
                    }))
                  }
                />
              )}
            </FormGroupWithLabel>
          ))}
        </div>
      ) : (
        assertNever(pricingStructure.pricing_strategy)
      )}
    </>
  );
}
