import { useTranslation } from 'react-i18next';
import FakeEventRun from './FakeEventRun';

function FullnessLegend(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-wrap">
      <div className="col-md-6 col-lg-4 mb-4 pe-3">
        <div className="card bg-light">
          <div className="card-header">
            {t('schedule.legends.eventFullness.title', 'Event fullness colors')}
          </div>

          <div className="card-body">
            {[
              {
                className: 'below-minimum',
                availability: 0.9,
                unlimited: false,
                label: t('schedule.legends.eventFullness.belowMinimum', 'Below minimum'),
              },
              {
                className: 'minimum',
                availability: 0.6,
                unlimited: false,
                label: t('schedule.legends.eventFullness.minimum', 'Reached minimum'),
              },
              {
                className: 'preferred',
                availability: 0.2,
                unlimited: false,
                label: t('schedule.legends.eventFullness.preferred', 'Reached preferred'),
              },
              {
                className: 'full',
                availability: 0.0,
                unlimited: false,
                label: t('schedule.legends.eventFullness.full', 'Full'),
              },
              {
                className: 'unlimited',
                unlimited: true,
                label: t('schedule.legends.eventFullness.unlimited', 'Unlimited capacity'),
              },
            ].map(({ className, label, availability, unlimited }) => (
              <FakeEventRun
                classifyEventsBy="fullness"
                eventCategory={{}}
                availability={availability}
                unlimited={unlimited}
                key={className}
              >
                {label}
              </FakeEventRun>
            ))}
          </div>
        </div>
      </div>

      <div className="col-md-6 col-lg-4 mb-4 pe-3">
        <div className="card bg-light">
          <div className="card-header">
            {t('schedule.legends.attendeeCounts.title', 'Attendee counts')}
          </div>

          <div className="card-body">
            <small className="text-muted">
              <div>{t('schedule.legends.attendeeCounts.minPreferredMax', 'min/preferred/max')}</div>
              <div>
                <abbr
                  className="text-success"
                  title={t('schedule.legends.attendeeCounts.confirmed', 'confirmed signups')}
                >
                  {t('schedule.legends.attendeeCounts.confirmedAbbreviation', 'conf')}
                </abbr>
                /
                <abbr
                  className="text-info"
                  title={t(
                    'schedule.legends.attendeeCounts.nocount',
                    'non-counted signups (usually staff or NPCs)',
                  )}
                >
                  {t('schedule.legends.attendeeCounts.nocountAbbreviation', 'nocount')}
                </abbr>
                /
                <abbr
                  className="text-danger"
                  title={t('schedule.legends.attendeeCounts.waitlisted', 'waitlisted signups')}
                >
                  {t('schedule.legends.attendeeCounts.waitlistedAbbreviation', 'waitlist')}
                </abbr>
              </div>
              <div>
                {t('schedule.legends.attendeeCounts.totals', 'Total: [total of above 3 numbers]')}
              </div>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FullnessLegend;
