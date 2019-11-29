import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Confirm from '../ModalDialogs/Confirm';
import HelpPopover from '../UIComponents/HelpPopover';
import { mutator, Transforms } from '../ComposableFormUtils';
import { RegistrationPolicyBucketPropType, checkBucketFieldMinimums } from './RegistrationPolicyBucket';
import BootstrapFormTextarea from '../BuiltInFormControls/BootstrapFormTextarea';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import useUniqueId from '../useUniqueId';

const bucketTransforms = {
  name: Transforms.identity,
  description: Transforms.identity,
  slots_limited: Transforms.negate(Transforms.identity),
  not_counted: Transforms.negate(Transforms.identity),
  expose_attendees: Transforms.identity,
  minimum_slots: Transforms.integer,
  preferred_slots: Transforms.integer,
  total_slots: Transforms.integer,
};

function RegistrationBucketRow({
  registrationBucket, onChange, lockLimited, lockCounts, lockNameAndDescription, validateComplete,
  lockDelete, onDelete,
}) {
  const bucketMutator = useMemo(
    () => mutator({
      getState: () => registrationBucket,
      setState: (newState) => onChange(
        registrationBucket.key,
        { ...registrationBucket, ...newState },
      ),
      transforms: bucketTransforms,
    }),
    [onChange, registrationBucket],
  );

  const unlimitedId = useUniqueId('unlimited-');
  const countedId = useUniqueId('counted-');
  const exposeAttendeesId = useUniqueId('expose-attendees-');
  const minId = useUniqueId('min-');
  const preferredId = useUniqueId('preferred-');
  const maxId = useUniqueId('max-');

  const countValidationErrors = checkBucketFieldMinimums(registrationBucket);

  const renderBucketFlags = () => {
    if (lockLimited) {
      return null;
    }

    return (
      <div className="ml-2">
        <div className="form-check">
          <label className="form-check-label text-nowrap" htmlFor={unlimitedId}>
            <input
              id={unlimitedId}
              className="form-check-input"
              type="checkbox"
              checked={!registrationBucket.slots_limited}
              onChange={(event) => { bucketMutator.slots_limited(event.target.checked); }}
              aria-label="Unlimited?"
            />

            Unlimited?
          </label>
        </div>

        <div className="form-check">
          <label className="form-check-label text-nowrap mr-1" htmlFor={countedId}>
            <input
              id={countedId}
              className="form-check-input"
              type="checkbox"
              checked={!registrationBucket.not_counted}
              onChange={(event) => { bucketMutator.not_counted(event.target.checked); }}
              aria-label="Counted?"
            />

            Counted?
          </label>
          <HelpPopover>
            &ldquo;Counted&rdquo; buckets count towards the attendee&rsquo;s number of signups,
            and are included in the &ldquo;No Preference&rdquo; option. If the bucket is

            <em>not</em>

            counted, any attendees who click &ldquo;No Preference&rdquo; won&rsquo;t end up in this
            bucket.
          </HelpPopover>
        </div>

        <div className="form-check">
          <div className="d-flex">
            <label className="form-check-label text-nowrap mr-1" htmlFor={exposeAttendeesId}>
              <input
                id={exposeAttendeesId}
                className="form-check-input"
                type="checkbox"
                checked={registrationBucket.expose_attendees}
                onChange={(event) => { bucketMutator.expose_attendees(event.target.checked); }}
                aria-label="Expose attendees?"
              />

              Expose attendees?
            </label>
            <HelpPopover>
              If checked, attendees will be able to see which of their fellow attendees are in this
              bucket via the signup summary page.  (The signup summary always lists fellow
              attendees&rsquo; names, but normally doesn&rsquo;t show which bucket they&rsquo;re
              in.)
            </HelpPopover>
          </div>
        </div>
      </div>
    );
  };

  const renderLimits = () => {
    if (!registrationBucket.slots_limited) {
      return null;
    }

    if (lockCounts) {
      return null;
    }

    const slotControls = [
      {
        label: 'Min',
        field: 'minimum_slots',
        min: 0,
        inputId: minId,
      },
      {
        label: 'Pref',
        field: 'preferred_slots',
        min: 0,
        inputId: preferredId,
      },
      {
        label: 'Max',
        field: 'total_slots',
        min: 0,
        inputId: maxId,
      },
    ].map(({
      label, field, min, inputId,
    }) => (
      <div key={field} className={lockLimited ? 'd-inline mr-2' : null}>
        <label htmlFor={inputId} className="d-inline">{label}</label>
        <input
          id={inputId}
          type="number"
          size="2"
          className="form-control form-control-sm d-inline ml-1"
          min={min}
          placeholder={label}
          value={registrationBucket[field] == null ? '' : registrationBucket[field]}
          onChange={(event) => { bucketMutator[field](event.target.value); }}
          style={{ width: '4em' }}
          aria-label={label}
        />
      </div>
    ));

    return (
      <div>
        {slotControls}
        <small className="text-danger">
          {countValidationErrors.join(', ')}
        </small>
      </div>
    );
  };

  const renderNameAndDescription = () => {
    if (lockNameAndDescription) {
      return (
        <td title={registrationBucket.description}>
          {registrationBucket.name}
        </td>
      );
    }

    return [
      <td key="nameAndDescription" style={{ width: '19rem' }}>
        <div className="mb-1">
          <BootstrapFormInput
            value={registrationBucket.name || ''}
            onTextChange={bucketMutator.name}
            placeholder="Bucket name"
            label="Bucket name"
            hideLabel
            className={classNames('form-control', {
              'is-invalid': validateComplete && !registrationBucket.name,
            })}
            invalidFeedback="This field is required."
          />
        </div>

        <BootstrapFormTextarea
          rows="2"
          value={registrationBucket.description || ''}
          label="Bucket description"
          hideLabel
          onTextChange={bucketMutator.description}
          placeholder="Bucket description"
          className={classNames('form-control', {
            'is-invalid': validateComplete && !registrationBucket.description,
          })}
          invalidFeedback="This field is required."
        />
      </td>,
    ];
  };

  const renderActions = () => {
    if (lockDelete) {
      return <td style={{ width: 0 }} />;
    }

    return (
      <td style={{ width: '30px' }}>
        <Confirm.Trigger>
          {(confirm) => (
            <button
              className="btn btn-sm btn-secondary"
              type="button"
              onClick={() => confirm({
                prompt: 'Are you sure you wish to delete this registration bucket?',
                action: () => onDelete(registrationBucket.key),
              })}
            >
              <i className="fa fa-trash-o" />
              <span className="sr-only">Delete bucket</span>
            </button>
          )}
        </Confirm.Trigger>
      </td>
    );
  };

  return (
    <tr className={classNames({ 'anything-bucket': registrationBucket.anything })}>
      {renderNameAndDescription()}
      <td style={{ width: '20rem' }}>
        <div className="d-flex">
          {renderLimits()}
          {renderBucketFlags()}
        </div>
      </td>
      {renderActions()}
    </tr>
  );
}

RegistrationBucketRow.propTypes = {
  registrationBucket: RegistrationPolicyBucketPropType.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  lockCounts: PropTypes.bool,
  lockNameAndDescription: PropTypes.bool,
  lockLimited: PropTypes.bool,
  lockDelete: PropTypes.bool,
  validateComplete: PropTypes.bool,
};

RegistrationBucketRow.defaultProps = {
  lockCounts: false,
  lockNameAndDescription: false,
  lockLimited: false,
  lockDelete: false,
  validateComplete: false,
};

export default RegistrationBucketRow;
