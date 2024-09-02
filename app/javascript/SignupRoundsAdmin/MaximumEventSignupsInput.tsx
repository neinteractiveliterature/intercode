import { parseIntOrNull } from '@neinteractiveliterature/litform';
import { MaximumEventSignupsValue } from '../SignupRoundUtils';
import { useTranslation } from 'react-i18next';
import React, { HTMLProps, useRef } from 'react';
import isEqual from 'lodash/isEqual';

type LimitedMaximumEventSignupsInputState = {
  valueType: 'limited';
  limitedCount: number | undefined;
};

type NonLimitedMaximumEventSignupsInputState = {
  valueType: Exclude<MaximumEventSignupsValue, number> | undefined;
  limitedCount: undefined;
};

type MaximumEventSignupsInputState = LimitedMaximumEventSignupsInputState | NonLimitedMaximumEventSignupsInputState;

function maximumEventSignupsValueToInputState(
  value: MaximumEventSignupsValue | undefined,
): MaximumEventSignupsInputState {
  if (value == null) {
    return {
      valueType: undefined,
      limitedCount: undefined,
    };
  }

  if (typeof value === 'number') {
    return {
      valueType: 'limited',
      limitedCount: value,
    };
  }

  return {
    valueType: value,
    limitedCount: undefined,
  };
}

type MaximumEventSignupsInputProps = Omit<HTMLProps<HTMLSelectElement>, 'value' | 'onChange' | 'id' | 'name'> & {
  value: MaximumEventSignupsValue | undefined;
  onChange: React.Dispatch<MaximumEventSignupsValue | undefined>;
  id?: string;
  name?: string;
};

function MaximumEventSignupsInput({ value, onChange, id, name, ...selectProps }: MaximumEventSignupsInputProps) {
  const { t } = useTranslation();
  const [inputState, setInputState] = React.useState<MaximumEventSignupsInputState>(() =>
    maximumEventSignupsValueToInputState(value),
  );
  const limitedCountId = React.useId();
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const valueTypeChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValueType = event.target.value;

    if (newValueType === 'not_yet' || newValueType === 'unlimited' || newValueType === 'not_now') {
      setInputState({ limitedCount: undefined, valueType: newValueType });
    } else if (newValueType === 'limited') {
      setInputState((prevInputState) => ({ valueType: 'limited', limitedCount: prevInputState.limitedCount }));
    } else {
      setInputState({ valueType: undefined, limitedCount: undefined });
    }
  };

  React.useEffect(() => {
    if (inputState.valueType === 'limited') {
      onChangeRef.current(inputState.limitedCount);
    } else if (inputState.valueType == null) {
      onChangeRef.current(undefined);
    } else {
      onChangeRef.current(inputState.valueType);
    }
  }, [inputState]);

  React.useEffect(() => {
    if (value == null) {
      return;
    }

    const valueAsInputState = maximumEventSignupsValueToInputState(value);
    setInputState((prevInputState) => {
      if (!isEqual(valueAsInputState, prevInputState)) {
        return valueAsInputState;
      } else {
        return prevInputState;
      }
    });
  }, [value]);

  return (
    <div className="input-group">
      <select className="form-select" value={inputState.valueType} onChange={valueTypeChanged} id={id} {...selectProps}>
        <option aria-label="Blank placeholder option" />
        <option value="not_yet">{t('signups.maximumSignups.notYet')}</option>
        <option value="limited">{t('signups.maximumSignups.limitedUnspecified')}</option>
        <option value="unlimited">{t('signups.maximumSignups.unlimited')}</option>
        <option value="not_now">{t('signups.maximumSignups.notNow')}</option>
      </select>
      {inputState.valueType === 'limited' && (
        <>
          <label className="input-group-text" htmlFor={limitedCountId} id={`${limitedCountId}-label`}>
            {t('signups.maximumSignups.limitedCountLabel')}
          </label>
          <input
            id={limitedCountId}
            aria-labelledby={`${limitedCountId}-label`}
            className="form-control"
            value={inputState.limitedCount ?? ''}
            type="number"
            min={1}
            onChange={(event) =>
              setInputState({
                valueType: 'limited',
                limitedCount: parseIntOrNull(event.target.value) ?? undefined,
              })
            }
          />
        </>
      )}
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  );
}

export default MaximumEventSignupsInput;
