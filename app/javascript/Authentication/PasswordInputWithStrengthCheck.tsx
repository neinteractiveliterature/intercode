import { useMemo, useState } from 'react';
import * as React from 'react';
import zxcvbn, { ZXCVBNResult } from 'zxcvbn';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useLitformPopperWithAutoClosing, useToggleOpen } from '@neinteractiveliterature/litform';

type PasswordFeedbackProps = {
  result?: ZXCVBNResult | null;
};

function PasswordFeedback({ result }: PasswordFeedbackProps) {
  if (!result) {
    return null;
  }

  if (!result.feedback) {
    return null;
  }

  return (
    <div className="text-danger ">
      {result.feedback.warning && (
        <>
          <i className="bi-exclamation-triangle-fill" /> <strong>{result.feedback.warning}</strong>
        </>
      )}
      {result.feedback.suggestions && (
        <ul className="list-unstyled m-0">
          {result.feedback.suggestions.map((suggestion) => (
            <li key={suggestion}>{suggestion}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

type ScoreText = 'insecure' | 'fair' | 'good' | 'great';

function getTextForScore(score: number): ScoreText {
  if (score < 2) {
    return 'insecure';
  }

  if (score < 3) {
    return 'fair';
  }

  if (score < 4) {
    return 'good';
  }

  return 'great';
}

export type PasswordInputWithStrengthCheckProps = {
  id?: string;
  value: string;
  onChange: React.Dispatch<string>;
};

function PasswordInputWithStrengthCheck({
  id,
  value,
  onChange,
}: PasswordInputWithStrengthCheckProps): React.JSX.Element {
  const { t } = useTranslation();
  const passwordStrengthResult = useMemo(() => zxcvbn(value), [value]);
  const hasFeedback = useMemo(
    () =>
      passwordStrengthResult &&
      passwordStrengthResult.feedback &&
      (passwordStrengthResult.feedback.warning || passwordStrengthResult.feedback.suggestions.length > 0),
    [passwordStrengthResult],
  );

  const { score } = passwordStrengthResult || { score: 0 };
  const scoreProgressClasses = {
    'bg-danger': score < 2,
    'bg-warning': score === 2,
    'bg-primary': score === 3,
    'bg-success': score >= 4,
  };
  const scoreText = getTextForScore(score);
  const scoreTextClasses = {
    'text-danger': score < 2,
    'text-warning': score === 2,
    'text-primary': score === 3,
    'text-success': score >= 4,
  };
  const scoreTextTranslated = {
    insecure: t('authentication.passwordInput.insecure'),
    fair: t('authentication.passwordInput.fair'),
    good: t('authentication.passwordInput.good'),
    great: t('authentication.passwordInput.great'),
  }[scoreText];

  const [dropdownButton, setDropdownButton] = useState<HTMLButtonElement | null>(null);
  const [dropdownMenu, setDropdownMenu] = useState<HTMLDivElement | null>(null);
  const [arrow, setArrow] = useState<HTMLSpanElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { styles, attributes, state, update } = useLitformPopperWithAutoClosing(
    dropdownMenu,
    dropdownButton,
    arrow,
    setDropdownOpen,
  );

  const toggle = useToggleOpen(setDropdownOpen, update);

  return (
    <>
      <div className="rounded" style={{ position: 'relative', overflow: 'hidden' }}>
        <input
          id={id}
          className="form-control"
          type="password"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={t('authentication.passwordInput.label')}
        />
        <div style={{ right: 0, top: 0, position: 'absolute' }} className={classNames('me-2', 'mt-2')}>
          <button
            type="button"
            className={classNames('btn btn-link p-0', scoreTextClasses)}
            aria-haspopup="dialog"
            disabled={!hasFeedback || value.length === 0}
            style={{ opacity: 1 }}
            tabIndex={100 /* eslint-disable-line jsx-a11y/tabindex-no-positive */}
            ref={setDropdownButton}
            onClick={() => (hasFeedback ? toggle() : null)}
            onKeyDown={(event) => {
              if (event.keyCode === 13 || event.keyCode === 32) {
                event.preventDefault();
                toggle();
              }
            }}
          >
            {value.length > 0 && (
              <>
                {scoreTextTranslated}
                {hasFeedback && (
                  <>
                    {' '}
                    <i className="bi-question-circle-fill" style={{ cursor: 'pointer' }}>
                      <span className="visually-hidden">{t('buttons.help')}</span>
                    </i>
                  </>
                )}
              </>
            )}
          </button>
          <div
            className={classNames('card', 'popover', `bs-popover-${state?.placement}`, {
              'd-none': !dropdownOpen || !hasFeedback,
            })}
            ref={setDropdownMenu}
            style={styles.popper}
            {...attributes.popper}
          >
            <div className="card-body">
              <PasswordFeedback result={passwordStrengthResult} />
            </div>
            <span ref={setArrow} style={styles.arrow} className="popover-arrow" />
          </div>
        </div>
        <div
          className="progress w-100 bg-transparent"
          style={{
            bottom: 0,
            height: '3px',
            position: 'absolute',
            overflow: 'hidden',
          }}
        >
          <div
            role="progressbar"
            aria-valuenow={score}
            style={{ width: `${value.length > 0 ? ((score + 1) / 5) * 100 : 0}%` }}
            className={classNames('progress-bar', scoreProgressClasses)}
            aria-valuemin={0}
            aria-valuemax={4}
            aria-label={t('authentication.passwordInput.strengthMeterLabel')}
          />
        </div>
      </div>
    </>
  );
}

export default PasswordInputWithStrengthCheck;
