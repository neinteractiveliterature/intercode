import { useCallback, useContext } from 'react';
import * as React from 'react';
import { MultipleChoiceInput, FormGroupWithLabel } from '@neinteractiveliterature/litform';
import MoneyInput from '../MoneyInput';
import ScheduledValueEditor, {
  ScheduledValueReducerAction,
  scheduledValueReducer,
} from '../../BuiltInFormControls/ScheduledValueEditor';
import AppRootContext from '../../AppRootContext';
import {
  Money,
  PayWhatYouWantValue,
  PricingStrategy,
  PricingStructure,
  ScheduledMoneyValue,
} from '../../graphqlTypes.generated';
import assertNever from 'assert-never';
import currencyCodes from '@breezehr/currency-codes';
import { PRICING_STRATEGIES, buildScheduledMoneyValueInput } from './EditPricingStructureModal';
import SelectWithLabel from '../../BuiltInFormControls/SelectWithLabel';
import { useAllowedCurrencies } from '../CurrencySelect';

type EditingPricingStructure = Partial<PricingStructure>;

export type PricingStructureFormProps = {
  pricingStructure: EditingPricingStructure | null | undefined;
  setPricingStructure: React.Dispatch<React.SetStateAction<EditingPricingStructure | undefined>>;
};

export default function PricingStructureForm({ pricingStructure, setPricingStructure }: PricingStructureFormProps) {
  const { timezoneName, defaultCurrencyCode } = useContext(AppRootContext);
  const allowedCurrencies = useAllowedCurrencies();

  const dispatchScheduledValue = useCallback(
    (action: ScheduledValueReducerAction<unknown>) => {
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
          setPricingStructure((prev) => {
            const newPricingStructure = {
              ...prev,
              pricing_strategy: strategy,
            };
            if (strategy === PricingStrategy.PayWhatYouWant) {
              const prevValue = prev?.value ?? {};
              newPricingStructure.value = {
                __typename: 'PayWhatYouWantValue',
                allowed_currency_codes: [defaultCurrencyCode],
                ...prevValue,
              };
            }
            return newPricingStructure;
          })
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
              onChange={(price) => {
                if (typeof price === 'function') {
                  setPricingStructure((prev) => ({ ...prev, value: price(prev?.price ?? undefined) }));
                } else {
                  setPricingStructure((prev) => ({ ...prev, value: price }));
                }
              }}
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
        <>
          <SelectWithLabel
            label="Allowed currencies"
            isMulti
            options={allowedCurrencies}
            getOptionLabel={(currency) => currency.code}
            getOptionValue={(currency) => currency.code}
            value={((pricingStructure.value as PayWhatYouWantValue | undefined)?.allowed_currency_codes ?? []).map(
              (code) => currencyCodes.code(code)!,
            )}
            onChange={(newValue) =>
              setPricingStructure((prev) => ({
                ...prev,
                value: {
                  ...prev?.value,
                  __typename: 'PayWhatYouWantValue',
                  allowed_currency_codes: newValue.map((currency) => currency.code),
                },
              }))
            }
          />
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
                    allowedCurrencyCodes={
                      (pricingStructure.value as PayWhatYouWantValue | undefined)?.allowed_currency_codes ?? undefined
                    }
                    onChange={(newValue) =>
                      setPricingStructure((prev) => ({
                        ...prev,
                        value: {
                          __typename: 'PayWhatYouWantValue',
                          allowed_currency_codes: allowedCurrencies.map((currency) => currency.code),
                          ...prev?.value,
                          [fieldName]: newValue,
                        },
                      }))
                    }
                  />
                )}
              </FormGroupWithLabel>
            ))}
          </div>
        </>
      ) : (
        assertNever(pricingStructure.pricing_strategy)
      )}
    </>
  );
}
