import { useContext, useMemo } from 'react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import { Placement } from '@popperjs/core';
import { usePopper } from 'react-popper';
import { useTranslation } from 'react-i18next';

import { describeAvailability, calculateAvailability, describeWaitlist } from './AvailabilityUtils';
import BucketAvailabilityDisplay from '../EventPage/BucketAvailabilityDisplay';
import buildEventUrl from '../buildEventUrl';
import AppRootContext from '../../AppRootContext';
import RateEventControl from '../../EventRatings/RateEventControl';
import useRateEvent from '../../EventRatings/useRateEvent';
import { ScheduleEvent, ScheduleRun } from './Schedule';
import SignupCountData from '../SignupCountData';
import { FiniteTimespan } from '../../Timespan';
import { conventionRequiresDates, useFormatRunTimespan } from '../runTimeFormatting';
import { useAppDateTimeFormat } from '../../TimeUtils';
import { FormItemExposeIn } from '../../graphqlTypes.generated';
import FormItemDisplay from '../../FormPresenter/ItemDisplays/FormItemDisplay';
import { parseTypedFormItemArray } from '../../FormAdmin/FormItemUtils';

export type RunDetailsProps = {
  placement?: Placement;
  styles: ReturnType<typeof usePopper>['styles'];
  attributes: ReturnType<typeof usePopper>['attributes'];
  toggle: () => void;
  event: ScheduleEvent;
  run: ScheduleRun;
  timespan: FiniteTimespan;
  signupCountData: SignupCountData;
  arrowRef: React.Ref<HTMLSpanElement>;
};

const RunDetails = React.forwardRef<HTMLDivElement, RunDetailsProps>(function RunDetails(
  { styles, placement, attributes, event, run, timespan, toggle, signupCountData, arrowRef },
  ref,
) {
  const { t } = useTranslation();
  const { myProfile, conventionTimespan, siteMode, convention } = useContext(AppRootContext);
  const rateEvent = useRateEvent();
  const apolloClient = useApolloClient();
  const formatRunTimespan = useFormatRunTimespan();
  const format = useAppDateTimeFormat();

  const showDate = useMemo(() => conventionRequiresDates(conventionTimespan, siteMode), [conventionTimespan, siteMode]);

  const availabilityDescription = useMemo(
    () => describeAvailability(event, signupCountData, t),
    [event, signupCountData, t],
  );
  const waitlistDescription = useMemo(() => describeWaitlist(event, signupCountData), [event, signupCountData]);
  const availability = useMemo(() => calculateAvailability(event, signupCountData), [event, signupCountData]);
  const roomsDescription = useMemo(() => [...run.room_names].sort().join(', '), [run.room_names]);
  const additionalExposedFields = useMemo(() => {
    if (convention == null) {
      return [];
    }

    const exposedFormItems = event.event_category.event_form.form_sections.flatMap((section) =>
      parseTypedFormItemArray(
        section.form_items.filter((item) => item.expose_in?.includes(FormItemExposeIn.SchedulePopup)),
      ),
    );

    if (exposedFormItems.length === 0) {
      return [];
    }
    const formResponse = JSON.parse(event.form_response_attrs_json_with_rendered_markdown ?? '{}');
    return exposedFormItems.map((item) => (
      <tr key={item.id}>
        <td className="text-center pe-1">
          <i className="bi-caret-right-fill" />
        </td>
        <td>
          <FormItemDisplay
            convention={convention}
            displayMode="public"
            formItem={item}
            value={formResponse[item.identifier ?? '']}
          />
        </td>
      </tr>
    ));
  }, [event.form_response_attrs_json_with_rendered_markdown, convention, event.event_category.event_form]);

  const ratingChanged = async (rating: number) => {
    await rateEvent(event.id, rating);
    await apolloClient.resetStore();
  };

  return (
    <div
      className={`popover schedule-grid-run-details-popover bs-popover-${placement}`}
      ref={ref}
      style={styles.popper}
      role="tooltip"
      {...attributes.popper}
    >
      <span ref={arrowRef} style={styles.arrow} className="popover-arrow" />
      <div className="schedule-grid-run-details-content">
        <div className="popover-header">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 schedule-grid-run-details-title">
              <strong>{event.title}</strong>
              {run.title_suffix
                ? [<span key="mdash">&mdash;</span>, <em key="title-suffix">{run.title_suffix}</em>]
                : []}
            </div>
            <button
              type="button"
              className="btn btn-link btn-sm text-dark"
              style={{ cursor: 'pointer' }}
              onClick={toggle}
              aria-label={t('buttons.close')}
            >
              <i className="bi-x" title={t('buttons.close')} />
            </button>
          </div>
        </div>
        <div className="popover-body overflow-auto">
          {myProfile && (
            <div className="float-end">
              <RateEventControl value={event.my_rating} onChange={ratingChanged} />
            </div>
          )}
          <table className="mb-2">
            <tbody>
              {showDate && (
                <tr>
                  <td className="text-center pe-1">
                    <i className="bi-calendar" />
                  </td>
                  <td>{format(timespan.start, 'longDate')}</td>
                </tr>
              )}
              <tr>
                <td className="text-center pe-1">
                  <i className="bi-clock" />
                </td>
                <td>{formatRunTimespan(timespan, { formatType: 'short', includeDate: false })}</td>
              </tr>
              {roomsDescription ? (
                <tr>
                  <td className="text-center pe-1">
                    <i className="bi-geo-alt-fill" />
                  </td>
                  <td>{roomsDescription}</td>
                </tr>
              ) : null}
              {additionalExposedFields}
              {availabilityDescription ? (
                <tr>
                  <td className="text-center pe-1 align-top">
                    <i className="bi-people-fill" />
                  </td>
                  <td>
                    {availabilityDescription}
                    {availability.totalSlots > 0 && (
                      <BucketAvailabilityDisplay
                        compact
                        className="text-dark"
                        signupCount={availability.signupCount}
                        remainingCapacity={availability.remainingCapacity}
                      />
                    )}
                  </td>
                </tr>
              ) : null}
              {waitlistDescription ? (
                <tr>
                  <td className="text-center pe-1 align-top">
                    <i className="bi-hourglass-split" />
                  </td>
                  <td>
                    {waitlistDescription}
                    {availability.waitlistCount > 0 && (
                      <BucketAvailabilityDisplay
                        compact
                        className="text-black-50"
                        signupCount={availability.waitlistCount}
                        remainingCapacity={0}
                      />
                    )}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>

          <Link to={`${buildEventUrl(event)}#run-${run.id}`} className="btn btn-primary btn-sm mb-2">
            <>{t('schedule.goToEvent', 'Go to event')} &raquo;</>
          </Link>

          <div
            className="small"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: event.short_blurb_html ?? '' }}
          />
        </div>
      </div>
    </div>
  );
});

export default RunDetails;
