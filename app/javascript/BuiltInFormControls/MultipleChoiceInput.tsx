import React, { ReactNode } from 'react';

import ChoiceSet, { ChoiceSetProps } from './ChoiceSet';
import HelpText from './HelpText';

export type MultipleChoiceInputProps = ChoiceSetProps & {
  caption: ReactNode;
  helpText?: ReactNode;
};

const MultipleChoiceInput = ({
  caption,
  helpText,
  ...choiceSetProps
}: MultipleChoiceInputProps) => (
  <fieldset className="form-group">
    <legend className="col-form-label">{caption}</legend>
    <ChoiceSet {...choiceSetProps} />
    <HelpText>{helpText}</HelpText>
  </fieldset>
);

export default MultipleChoiceInput;
