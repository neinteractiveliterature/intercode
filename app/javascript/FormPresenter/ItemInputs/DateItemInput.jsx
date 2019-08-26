import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CaptionLegend from './CaptionLegend';
import FieldRequiredFeedback from './FieldRequiredFeedback';

function DateItemInput(props) {
  const {
    formItem, onInteract, onChange, value, valueInvalid,
  } = props;

  const userDidInteract = useCallback(
    () => { onInteract(formItem.identifier); },
    [onInteract, formItem],
  );

  const inputChanged = useCallback(
    (event) => {
      onChange(event.target.value);
      userDidInteract();
    },
    [onChange, userDidInteract],
  );

  return (
    <fieldset className="form-group">
      <CaptionLegend formItem={formItem} />
      <input
        type="date"
        value={value}
        onChange={inputChanged}
        onBlur={userDidInteract}
        className={classNames('form-control', { 'is-invalid': valueInvalid })}
      />
      <FieldRequiredFeedback valueInvalid={valueInvalid} />
    </fieldset>
  );
}

DateItemInput.propTypes = {
  formItem: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      caption: PropTypes.string,
    }).isRequired,
  }).isRequired,
  value: PropTypes.string,
  valueInvalid: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onInteract: PropTypes.func.isRequired,
};

DateItemInput.defaultProps = {
  value: null,
  valueInvalid: false,
};

export default DateItemInput;
