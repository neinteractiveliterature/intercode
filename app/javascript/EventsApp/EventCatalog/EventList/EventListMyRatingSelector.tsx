import * as React from 'react';
import sortBy from 'lodash/sortBy';
import { notEmpty, parseIntOrNull, ChoiceSet, HelpPopover } from '@neinteractiveliterature/litform';

import { RATING_NAMES } from '../../../EventRatings/EventRatingIcon';
import RatingsHelp from '../../../EventRatings/RatingsHelp';

export const RATING_OPTIONS = sortBy(Object.entries(RATING_NAMES), ([rating]) => ['1', '0', '-1'].indexOf(rating)).map(
  ([rating, name]) => ({
    label: name,
    value: rating.toString(),
  }),
);

export type EventListMyRatingSelectorProps = {
  value?: number[];
  onChange: React.Dispatch<number[]>;
};

function EventListMyRatingSelector({ value, onChange }: EventListMyRatingSelectorProps): JSX.Element {
  return (
    <div className="d-flex btn cursor-auto">
      <span className="me-2">Show:</span>
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
      <span className="ms-2">
        <HelpPopover iconSet="bootstrap-icons">
          <RatingsHelp />
        </HelpPopover>
      </span>
    </div>
  );
}

export default EventListMyRatingSelector;
