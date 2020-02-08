import React from 'react';
import PropTypes from 'prop-types';

import ChoiceSet from './ChoiceSet';
import HelpText from './HelpText';

const MultipleChoiceInput = ({ caption, helpText, ...choiceSetProps }) => (
  <fieldset className="form-group">
    <legend className="col-form-label">{caption}</legend>
    <ChoiceSet {...choiceSetProps} />
    <HelpText>{helpText}</HelpText>
  </fieldset>
);

MultipleChoiceInput.propTypes = {
  caption: PropTypes.node.isRequired,
  helpText: PropTypes.node,
};

MultipleChoiceInput.defaultProps = {
  helpText: null,
};

export default MultipleChoiceInput;
