import React, { ReactNode, ChangeEvent } from 'react';
import BootstrapFormCheckbox from './BootstrapFormCheckbox';

export type ChoiceSetChoice = {
  label: ReactNode,
  value: string,
  disabled?: boolean,
};

export interface ChoiceSetBaseProps {
  name?: string;
  choices: ChoiceSetChoice[];
  value?: string | string[] | null;
  onChange(value: string | string[] | null): any;
  multiple?: boolean;
  containerClassName?: string;
  choiceClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export interface ChoiceSetSingleChoiceProps extends ChoiceSetBaseProps {
  value?: string | null;
  multiple?: false;
}

export interface ChoiceSetMultipleChoiceProps extends ChoiceSetBaseProps {
  value?: string[] | null;
  multiple: true;
}

type ChoiceSetProps = ChoiceSetSingleChoiceProps | ChoiceSetMultipleChoiceProps;

function ChoiceSet(props: ChoiceSetProps) {
  const choiceType = props.multiple ? 'checkbox' : 'radio';

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (props.multiple) {
      if (event.target.checked) {
        props.onChange([...(props.value || []), event.target.value]);
      } else {
        props.onChange((props.value || []).filter((value) => value !== event.target.value));
      }
    } else {
      props.onChange(event.target.value);
    }
  };

  const options = props.choices.map(({ label, value, disabled = false }, index) => (
    <BootstrapFormCheckbox
      // eslint-disable-next-line react/no-array-index-key
      key={index}
      name={props.name || ''}
      type={choiceType}
      className={props.choiceClassName}
      inputClassName={props.inputClassName}
      label={label}
      value={value}
      checked={(
        props.multiple
          ? ((props.value || []).includes(value))
          : props.value === value
      )}
      onChange={onChange}
      disabled={props.disabled || disabled}
    />
  ));

  return (
    <div className={props.containerClassName}>
      {options}
    </div>
  );
}

export default ChoiceSet;
