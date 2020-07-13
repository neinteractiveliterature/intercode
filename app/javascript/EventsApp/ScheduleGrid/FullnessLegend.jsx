import React from 'react';
import { useTranslation } from 'react-i18next';

function FullnessLegend() {
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-wrap">
      <div className="col-md-6 col-lg-4 mb-4">
        <div className="card bg-light">
          <div className="card-header">
            {t('schedule.legends.eventFullness.title', 'Event fullness colors')}
          </div>

          <div className="card-body">
            {[
              {
                className: 'below-minimum',
                label: t('schedule.legends.eventFullness.belowMinimum', 'Below minimum'),
              },
              {
                className: 'minimum',
                label: t('schedule.legends.eventFullness.minimum', 'Reached minimum'),
              },
              {
                className: 'preferred',
                label: t('schedule.legends.eventFullness.preferred', 'Reached preferred'),
              },
              {
                className: 'full',
                label: t('schedule.legends.eventFullness.full', 'Full'),
              },
              {
                className: 'unlimited',
                label: t('schedule.legends.eventFullness.unlimited', 'Unlimited capacity'),
              },
            ].map(({ className, label }) => (
              <div className={`px-2 event-fullness-${className}`} key={className}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-md-6 col-lg-4 mb-4">
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
                  title={t('schedule.legends.attendeeCounts.nocount', 'non-counted signups (usually staff or NPCs)')}
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
