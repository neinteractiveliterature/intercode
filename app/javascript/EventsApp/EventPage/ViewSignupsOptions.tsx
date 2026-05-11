import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

import buildEventUrl from '../buildEventUrl';

export type ViewSignupsOptionsProps = {
  event: { id: string; title?: string | null; private_signup_list?: boolean | null };
  run: { id: string; current_ability_can_signup_summary_run: boolean };
  currentAbility: { can_read_event_signups: boolean };
};

function ViewSignupsOptions({ event, run, currentAbility }: ViewSignupsOptionsProps): React.JSX.Element {
  const { t } = useTranslation();
  const eventPath = buildEventUrl(event);

  if (currentAbility.can_read_event_signups) {
    return (
      <div className="card-footer text-center">
        <Link
          to={`${eventPath}/runs/${run.id}/admin_signups?filters.state=confirmed,waitlisted,ticket_purchase_hold&sort.id=asc`}
        >
          {t('signups.viewSignupsLink')}
        </Link>
        {run.current_ability_can_signup_summary_run && !event.private_signup_list ? (
          <>
            <br />
            <Link to={`${eventPath}/runs/${run.id}/signup_summary`}>{t('signups.signupSummaryLink')}</Link>
          </>
        ) : null}
      </div>
    );
  }

  if (run.current_ability_can_signup_summary_run) {
    return (
      <div className="card-footer text-center">
        <Link to={`${eventPath}/runs/${run.id}/signup_summary`}>{t('signups.viewSignupsLink')}</Link>
      </div>
    );
  }

  return <></>;
}

export default ViewSignupsOptions;
