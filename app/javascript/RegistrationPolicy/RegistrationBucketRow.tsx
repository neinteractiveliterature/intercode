import React, { useCallback } from 'react';
import classNames from 'classnames';

import { useConfirm } from '../ModalDialogs/Confirm';
import HelpPopover from '../UIComponents/HelpPopover';
import { parseIntOrNull } from '../ComposableFormUtils';
import { checkBucketFieldMinimums } from './RegistrationPolicyBucket';
import BootstrapFormTextarea from '../BuiltInFormControls/BootstrapFormTextarea';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import useUniqueId from '../useUniqueId';
import { usePartialState, usePartialStateFactoryWithValueSetter } from '../usePartialState';
import { RegistrationPolicyBucket } from '../graphqlTypes.generated';

export type EditingRegistrationBucket = Pick<
  RegistrationPolicyBucket,
  | 'key'
  | 'name'
  | 'description'
  | 'slots_limited'
  | 'not_counted'
  | 'expose_attendees'
  | 'minimum_slots'
  | 'preferred_slots'
  | 'total_slots'
  | 'anything'
>;

export type RegistrationBucketRowProps<T extends EditingRegistrationBucket> = {
  registrationBucket: T;
  onChange: (key: string, bucket: T) => void;
  lockLimited?: boolean;
  lockCounts?: boolean;
  lockNameAndDescription?: boolean;
  lockDelete?: boolean;
  validateComplete?: boolean;
  onDelete: (key: string) => void;
};

function RegistrationBucketRow<T extends EditingRegistrationBucket>({
  registrationBucket,
  onChange,
  lockLimited,
  lockCounts,
  lockNameAndDescription,
  validateComplete,
  lockDelete,
  onDelete,
}: RegistrationBucketRowProps<T>) {
  const updateBucket = useCallback((newValue: T) => onChange(registrationBucket.key, newValue), [
    registrationBucket.key,
    onChange,
  ]);
  const factory = usePartialStateFactoryWithValueSetter(registrationBucket, updateBucket);
  const [name, setName] = usePartialState(factory, 'name');
  const [description, setDescription] = usePartialState(factory, 'description');
  const [slotsLimited, setSlotsLimited] = usePartialState(factory, 'slots_limited');
  const [notCounted, setNotCounted] = usePartialState(factory, 'not_counted');
  const [exposeAttendees, setExposeAttendees] = usePartialState(factory, 'expose_attendees');
  const [minimumSlots, setMinimumSlots] = usePartialState(factory, 'minimum_slots');
  const [preferredSlots, setPreferredSlots] = usePartialState(factory, 'preferred_slots');
  const [totalSlots, setTotalSlots] = usePartialState(factory, 'total_slots');

  const confirm = useConfirm();

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
              checked={!slotsLimited}
              onChange={(event) => setSlotsLimited(!event.target.checked)}
              aria-label="Unlimited?"
            />
            Unlimited?
          </label>
        </div>

        <div className="form-check">
          <label className="form-check-label mr-1" htmlFor={countedId}>
            <input
              id={countedId}
              className="form-check-input"
              type="checkbox"
              checked={!notCounted}
              onChange={(event) => setNotCounted(!event.target.checked)}
              aria-label="Counted for signups?"
            />
            Counted for signups?{' '}
            <HelpPopover>
              “Counted” buckets count towards the attendee’s number of signups, and are included in
              the “No Preference” option. If the bucket is <em>not</em> counted, any attendees who
              click “No Preference” won’t end up in this bucket.
            </HelpPopover>
          </label>
        </div>

        <div className="form-check">
          <div className="d-flex">
            <label className="form-check-label mr-1" htmlFor={exposeAttendeesId}>
              <input
                id={exposeAttendeesId}
                className="form-check-input"
                type="checkbox"
                checked={exposeAttendees}
                onChange={(event) => setExposeAttendees(event.target.checked)}
                aria-label="Show bucket name in signup list?"
              />
              Show bucket name in signup list?{' '}
              <HelpPopover>
                If checked, attendees will be able to see which of their fellow attendees are in
                this bucket via the signup summary page. (The signup summary always lists fellow
                attendees’ names, but normally doesn’t show which bucket they’re in.)
              </HelpPopover>
            </label>
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

    const slotControls = ([
      {
        label: 'Min',
        field: 'minimum_slots',
        min: 0,
        inputId: minId,
        value: minimumSlots,
        setValue: setMinimumSlots,
      },
      {
        label: 'Pref',
        field: 'preferred_slots',
        min: 0,
        inputId: preferredId,
        value: preferredSlots,
        setValue: setPreferredSlots,
      },
      {
        label: 'Max',
        field: 'total_slots',
        min: 0,
        inputId: maxId,
        value: totalSlots,
        setValue: setTotalSlots,
      },
    ] as const).map(({ label, field, min, inputId, value, setValue }) => (
      <div key={field} className={lockLimited ? 'd-inline mr-2' : undefined}>
        <label htmlFor={inputId} className="d-inline">
          {label}
        </label>
        <input
          id={inputId}
          type="number"
          size={2}
          className="form-control form-control-sm d-inline ml-1"
          min={min}
          placeholder={label}
          value={value?.toString()}
          onChange={(event) => setValue(parseIntOrNull(event.target.value))}
          style={{ width: '4em' }}
          aria-label={label}
        />
      </div>
    ));

    return (
      <div>
        {slotControls}
        <small className="text-danger">{countValidationErrors.join(', ')}</small>
      </div>
    );
  };

  const renderNameAndDescription = () => {
    if (lockNameAndDescription) {
      return <td title={registrationBucket.description ?? undefined}>{registrationBucket.name}</td>;
    }

    return [
      <td key="nameAndDescription" style={{ width: '19rem' }}>
        <div className="mb-1">
          <BootstrapFormInput
            value={name ?? ''}
            onTextChange={setName}
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
          rows={2}
          value={description ?? ''}
          label="Bucket description"
          hideLabel
          onTextChange={setDescription}
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
        <button
          className="btn btn-sm btn-secondary"
          type="button"
          onClick={() =>
            confirm({
              prompt: 'Are you sure you wish to delete this registration bucket?',
              action: () => onDelete(registrationBucket.key),
            })
          }
        >
          <i className="fa fa-trash-o" />
          <span className="sr-only">Delete bucket</span>
        </button>
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

export default RegistrationBucketRow;
