import React from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash-es/sortBy';

import ChoiceSet from '../../BuiltInFormControls/ChoiceSet';
import PopperDropdown from '../../UIComponents/PopperDropdown';
import { Transforms } from '../../ComposableFormUtils';
import { RATING_NAMES } from '../../EventRatings/EventRatingIcon';

const DROPDOWN_OPTIONS = sortBy(
  Object.entries(RATING_NAMES),
  ([rating]) => ['1', '-1', '0'].indexOf(rating),
).map(([rating, name]) => ({
  label: name,
  value: rating.toString(),
}));

const EventListMyRatingDropdown = ({ value, onChange }) => {
  return (
    <div className="d-flex btn">
      <span className="mr-2">Show:</span>
      <ChoiceSet
        choices={DROPDOWN_OPTIONS}
        choiceClassName="form-check-inline"
        value={(value || []).map((integer) => integer.toString())}
        onChange={(integerArray) => { onChange(integerArray.map(Transforms.integer)); }}
        multiple
      />
    </div>
  );
}

EventListMyRatingDropdown.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

EventListMyRatingDropdown.defaultProps = {
  value: null,
};

export default EventListMyRatingDropdown;
