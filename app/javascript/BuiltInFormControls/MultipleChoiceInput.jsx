import React from 'react';
import PropTypes from 'prop-types';
import ChoiceSet from './ChoiceSet';

const MultipleChoiceInput = ({ caption, ...choiceSetProps }) => (
  <fieldset className="form-group">
    <legend className="col-form-legend">{caption}</legend>
    <ChoiceSet {...choiceSetProps} />
  </fieldset>
);

MultipleChoiceInput.propTypes = {
  caption: PropTypes.string.isRequired,
};

export default MultipleChoiceInput;
