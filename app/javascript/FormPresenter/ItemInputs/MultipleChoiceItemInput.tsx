import { useMemo, useCallback, ChangeEvent } from 'react';
import classNames from 'classnames';
import { ChoiceSet } from '@neinteractiveliterature/litform';

import CaptionLegend from './CaptionLegend';
import { CommonFormItemInputProps } from './CommonFormItemInputProps';
import { FormItemValueType, MultipleChoiceFormItem } from '../../FormAdmin/FormItemUtils';
import { VisibilityDisclosureCard } from './PermissionDisclosures';
import assertNever from 'assert-never';

const OTHER_VALUE = '_OTHER_VALUE';

function castSingleValue(value: FormItemValueType<MultipleChoiceFormItem> | null | undefined): string | null {
  if (value == null) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value[0] : null;
  }

  assertNever(value);
}

function castMultipleValue(value: FormItemValueType<MultipleChoiceFormItem> | null | undefined): string[] {
  let arrayValue: string[];

  if (Array.isArray(value)) {
    arrayValue = value;
  } else if (value == null) {
    arrayValue = [];
  } else {
    arrayValue = [value];
  }

  return arrayValue;
}

export type MultipleChoiceItemInputProps = CommonFormItemInputProps<MultipleChoiceFormItem>;

function MultipleChoiceItemInput({
  formItem,
  formTypeIdentifier,
  onChange,
  value: uncastValue,
  valueInvalid,
  onInteract,
}: MultipleChoiceItemInputProps): React.JSX.Element {
  const isMultiple = useMemo(
    () => ['checkbox_horizontal', 'checkbox_vertical'].includes(formItem.rendered_properties.style),
    [formItem.rendered_properties.style],
  );

  const value = isMultiple ? castMultipleValue(uncastValue) : castSingleValue(uncastValue);

  const otherIsSelected = useMemo(() => {
    if (!formItem.rendered_properties.other) {
      return false;
    }

    const choiceValues = formItem.rendered_properties.choices.map((choice) => choice.value);

    if (Array.isArray(value)) {
      return !value.every((selectedChoiceValue) => choiceValues.includes(selectedChoiceValue));
    }

    return value != null && !choiceValues.includes(value);
  }, [formItem.rendered_properties.choices, formItem.rendered_properties.other, value]);

  const otherValue = useMemo(() => {
    if (otherIsSelected) {
      if (isMultiple) {
        const choiceValues = formItem.rendered_properties.choices.map((choice) => choice.value);
        return castMultipleValue(value).find((selectedChoiceValue) => !choiceValues.includes(selectedChoiceValue));
      }
      return castSingleValue(value);
    }

    return '';
  }, [formItem.rendered_properties.choices, isMultiple, otherIsSelected, value]);

  const choicesForChoiceSet = useMemo(() => {
    const providedChoices = formItem.rendered_properties.choices.map((choice) => ({
      label: choice.caption,
      value: choice.value,
    }));

    if (formItem.rendered_properties.other) {
      const otherCaption = formItem.rendered_properties.other_caption || 'Other';
      return [
        ...providedChoices,
        {
          label: otherCaption,
          value: OTHER_VALUE,
        },
      ];
    }

    return providedChoices;
  }, [
    formItem.rendered_properties.choices,
    formItem.rendered_properties.other,
    formItem.rendered_properties.other_caption,
  ]);

  const valueForChoiceSet = useMemo(() => {
    if (Array.isArray(value)) {
      if (otherIsSelected) {
        return [...value, OTHER_VALUE];
      }

      return value;
    }

    if (otherIsSelected) {
      return OTHER_VALUE;
    }

    return castSingleValue(value);
  }, [otherIsSelected, value]);

  const userDidInteract = useCallback(() => onInteract(formItem.identifier), [formItem.identifier, onInteract]);

  const valueDidChangeMultiple = (newValue: string[] | null) => {
    userDidInteract();

    const choiceValues = formItem.rendered_properties.choices.map((choice) => choice.value);
    const providedValues = (newValue ?? []).filter((choiceValue) =>
      choiceValues.some((providedValue) => providedValue === choiceValue),
    );
    if (otherValue && newValue?.includes(OTHER_VALUE)) {
      onChange([...providedValues, otherValue]);
    } else {
      onChange(providedValues);
    }
  };

  const valueDidChangeSingle = (newValue: string | null) => {
    userDidInteract();

    if (newValue === OTHER_VALUE) {
      onChange(otherValue);
    } else {
      onChange(newValue);
    }
  };

  const otherValueDidChange = (event: ChangeEvent<HTMLInputElement>) => {
    userDidInteract();
    if (typeof valueForChoiceSet === 'string') {
      onChange(event.target.value);
    } else {
      onChange(
        (valueForChoiceSet ?? []).map((singleValue) => {
          if (singleValue === OTHER_VALUE) {
            return event.target.value;
          }

          return singleValue;
        }),
      );
    }
  };

  const renderOtherInput = () => {
    if (!otherIsSelected) {
      return null;
    }

    return (
      <input
        aria-label={`${formItem.rendered_properties.other_caption ?? 'Other'}: please specify`}
        type="text"
        className="form-control"
        value={otherValue ?? ''}
        onChange={otherValueDidChange}
        placeholder="Please specify"
      />
    );
  };

  const choiceClassName = classNames({
    'form-check-inline': ['radio_horizontal', 'checkbox_horizontal'].includes(formItem.rendered_properties.style),
  });

  return (
    <fieldset className="mb-3">
      <VisibilityDisclosureCard formItem={formItem} formTypeIdentifier={formTypeIdentifier}>
        <div
          className={classNames({
            'border-0': !valueInvalid,
            'border rounded border-danger': valueInvalid,
          })}
        >
          <CaptionLegend formItem={formItem} />
          {Array.isArray(valueForChoiceSet) ? (
            <ChoiceSet
              choices={choicesForChoiceSet}
              value={valueForChoiceSet}
              onChange={valueDidChangeMultiple}
              multiple
              choiceClassName={choiceClassName}
            />
          ) : (
            <ChoiceSet
              choices={choicesForChoiceSet}
              value={valueForChoiceSet}
              onChange={valueDidChangeSingle}
              choiceClassName={choiceClassName}
            />
          )}
          {renderOtherInput()}
          {valueInvalid ? <span className="text-danger">This field is required.</span> : null}
        </div>
      </VisibilityDisclosureCard>
    </fieldset>
  );
}

export default MultipleChoiceItemInput;
