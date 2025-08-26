import { useTranslation } from 'react-i18next';
import FakeEventRun from './FakeEventRun';

function FullnessLegend(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-wrap">
      <div className="col-md-6 col-lg-4 mb-4 pe-3">
        <div className="card bg-light">
          <div className="card-header">{t('schedule.legends.eventFullness.title')}</div>

          <div className="card-body">
            {[
              {
                className: 'below-minimum',
                availability: 0.9,
                unlimited: false,
                label: t('schedule.legends.eventFullness.belowMinimum'),
              },
              {
                className: 'minimum',
                availability: 0.6,
                unlimited: false,
                label: t('schedule.legends.eventFullness.minimum'),
              },
              {
                className: 'preferred',
                availability: 0.2,
                unlimited: false,
                label: t('schedule.legends.eventFullness.preferred'),
              },
              {
                className: 'full',
                availability: 0.0,
                unlimited: false,
                label: t('schedule.legends.eventFullness.full'),
              },
              {
                className: 'unlimited',
                unlimited: true,
                label: t('schedule.legends.eventFullness.unlimited'),
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
          <div className="card-header">{t('schedule.legends.attendeeCounts.title')}</div>

          <div className="card-body">
            <small className="text-muted">
              <div>{t('schedule.legends.attendeeCounts.minPreferredMax')}</div>
              <div>
                <abbr className="text-success" title={t('schedule.legends.attendeeCounts.confirmed')}>
                  {t('schedule.legends.attendeeCounts.confirmedAbbreviation')}
                </abbr>
                /
                <abbr className="text-info" title={t('schedule.legends.attendeeCounts.nocount')}>
                  {t('schedule.legends.attendeeCounts.nocountAbbreviation')}
                </abbr>
                /
                <abbr className="text-danger" title={t('schedule.legends.attendeeCounts.waitlisted')}>
                  {t('schedule.legends.attendeeCounts.waitlistedAbbreviation')}
                </abbr>
              </div>
              <div>{t('schedule.legends.attendeeCounts.totals')}</div>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FullnessLegend;
