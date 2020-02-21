import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import zxcvbn from 'zxcvbn';
import pickBy from 'lodash/pickBy';
import classNames from 'classnames';

import PopperDropdown from '../UIComponents/PopperDropdown';

function PasswordFeedback({ result }) {
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
          <i className="fa fa-exclamation-triangle" />
          {' '}
          <strong>{result.feedback.warning}</strong>
        </>
      )}
      {result.feedback.suggestions && (
        <ul className="list-unstyled">
          {result.feedback.suggestions.map((suggestion) => (
            <li key={suggestion}>{suggestion}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

PasswordFeedback.propTypes = {
  result: PropTypes.shape({
    feedback: PropTypes.shape({
      warning: PropTypes.string,
      suggestions: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
};

PasswordFeedback.defaultProps = {
  result: null,
};

function PasswordInputWithStrengthCheck({ id, value, onChange }) {
  const passwordStrengthResult = useMemo(
    () => zxcvbn(value),
    [value],
  );
  const hasFeedback = useMemo(
    () => passwordStrengthResult && passwordStrengthResult.feedback && (
      passwordStrengthResult.feedback.warning
      || passwordStrengthResult.feedback.suggestions.length > 0
    ),
    [passwordStrengthResult],
  );
  const helpContainer = useRef();

  const { score } = passwordStrengthResult || { score: 0 };
  const scoreProgressClasses = {
    'bg-danger': score < 2,
    'bg-warning': score === 2,
    'bg-primary': score === 3,
    'bg-success': score >= 4,
  };
  const scoreText = Object.keys(pickBy({
    insecure: score < 2,
    fair: score === 2,
    good: score === 3,
    great: score >= 4,
  }, (matches) => matches))[0];
  const scoreTextClasses = {
    'text-danger': score < 2,
    'text-warning': score === 2,
    'text-primary': score === 3,
    'text-success': score >= 4,
  };

  return (
    <>
      <div className="rounded" style={{ position: 'relative', overflow: 'hidden' }}>
        <input
          id={id}
          className="form-control"
          type="password"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Password"
        />
        <div
          style={{ right: 0, top: 0, position: 'absolute' }}
          className={classNames('mr-2', 'mt-2')}
        >
          <PopperDropdown
            renderReference={({ ref, toggle }) => (
              <button
                type="button"
                className={classNames('btn btn-link p-0', scoreTextClasses)}
                aria-haspopup="dialog"
                disabled={!hasFeedback || value.length === 0}
                style={{ opacity: 1 }}
                tabIndex={100 /* eslint-disable-line jsx-a11y/tabindex-no-positive */}
                ref={ref}
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
                    {scoreText}
                    {hasFeedback && (
                      <>
                        {' '}
                        <i className="fa fa-question-circle" style={{ cursor: 'pointer' }}>
                          <span className="sr-only">
                            Help
                          </span>
                        </i>
                      </>
                    )}
                  </>
                )}
              </button>
            )}
          >
            {({
              placement,
              visible,
              arrowProps,
              ref,
              style,
            }) => (helpContainer.current
              ? ReactDOM.createPortal(
                (
                  <div
                    className={classNames(
                      'card',
                      'popover',
                      `bs-popover-${placement}`,
                      { 'd-none': !visible || !hasFeedback },
                    )}
                    ref={ref}
                    style={style}
                    data-placement={placement}
                  >
                    <div className="card-body">
                      <PasswordFeedback result={passwordStrengthResult} />
                    </div>
                    <span ref={arrowProps.ref} style={arrowProps.style} className="arrow" />
                  </div>
                ),
                helpContainer.current,
              ) : <></>)}
          </PopperDropdown>
        </div>
        <div
          className="progress w-100 bg-transparent"
          style={{
            bottom: 0, height: '3px', position: 'absolute', overflow: 'hidden',
          }}
        >
          <div
            role="progressbar"
            aria-valuenow={score}
            style={{ width: `${value.length > 0 ? ((score + 1) / 5) * 100 : 0}%` }}
            className={classNames('progress-bar', scoreProgressClasses)}
            aria-valuemin="0"
            aria-valuemax="4"
            aria-label="Password strength"
          />
        </div>
      </div>
      <div ref={helpContainer} />
    </>
  );
}

PasswordInputWithStrengthCheck.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

PasswordInputWithStrengthCheck.defaultProps = {
  id: null,
};

export default PasswordInputWithStrengthCheck;
