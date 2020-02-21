import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';

import ChoiceSet from '../../BuiltInFormControls/ChoiceSet';
import { Transforms } from '../../ComposableFormUtils';
import { RATING_NAMES } from '../../EventRatings/EventRatingIcon';
import HelpPopover from '../../UIComponents/HelpPopover';
import RatingsHelp from '../../EventRatings/RatingsHelp';

export const RATING_OPTIONS = sortBy(
  Object.entries(RATING_NAMES),
  ([rating]) => ['1', '0', '-1'].indexOf(rating),
).map(([rating, name]) => ({
  label: name,
  value: rating.toString(),
}));

function EventListMyRatingSelector({ value, onChange }) {
  const dismissedRatingsHelp = useMemo(
    () => window.localStorage.getItem('dismissedRatingsHelp') != null,
    [],
  );

  const ratingsHelpVisibleChanged = (newVisible) => {
    if (!newVisible) {
      window.localStorage.setItem('dismissedRatingsHelp', 'true');
    }
  };

  return (
    <div className="d-flex btn">
      <span className="mr-2">Show:</span>
      <ChoiceSet
        choices={RATING_OPTIONS}
        choiceClassName="form-check-inline"
        containerClassName="d-flex flex-wrap"
        value={(value || []).map((integer) => integer.toString())}
        onChange={(integerArray) => { onChange(integerArray.map(Transforms.integer)); }}
        multiple
      />
      <span className="ml-2">
        <HelpPopover
          initialVisible={!dismissedRatingsHelp}
          visibleChanged={ratingsHelpVisibleChanged}
        >
          <RatingsHelp />
        </HelpPopover>
      </span>
    </div>
  );
}

EventListMyRatingSelector.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func.isRequired,
};

EventListMyRatingSelector.defaultProps = {
  value: null,
};

export default EventListMyRatingSelector;
