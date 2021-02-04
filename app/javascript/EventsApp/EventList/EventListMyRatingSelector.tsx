import * as React from 'react';
import sortBy from 'lodash/sortBy';

import ChoiceSet from '../../BuiltInFormControls/ChoiceSet';
import { RATING_NAMES } from '../../EventRatings/EventRatingIcon';
import HelpPopover from '../../UIComponents/HelpPopover';
import RatingsHelp from '../../EventRatings/RatingsHelp';
import { notEmpty, parseIntOrNull } from '../../ValueUtils';

export const RATING_OPTIONS = sortBy(Object.entries(RATING_NAMES), ([rating]) =>
  ['1', '0', '-1'].indexOf(rating),
).map(([rating, name]) => ({
  label: name,
  value: rating.toString(),
}));

export type EventListMyRatingSelectorProps = {
  value?: number[];
  onChange: React.Dispatch<number[]>;
};

function EventListMyRatingSelector({ value, onChange }: EventListMyRatingSelectorProps) {
  return (
    <div className="d-flex btn cursor-auto">
      <span className="mr-2">Show:</span>
      <ChoiceSet
        choices={RATING_OPTIONS}
        choiceClassName="form-check-inline"
        containerClassName="d-flex flex-wrap"
        value={(value || []).map((integer: number) => integer.toString())}
        onChange={(integerArray) => {
          onChange((integerArray ?? []).map(parseIntOrNull).filter(notEmpty));
        }}
        multiple
      />
      <span className="ml-2">
        <HelpPopover>
          <RatingsHelp />
        </HelpPopover>
      </span>
    </div>
  );
}

export default EventListMyRatingSelector;
