import { useCallback, useId } from 'react';
import classNames from 'classnames';
import {
  BootstrapFormInput,
  useConfirm,
  HelpPopover,
  parseIntOrNull,
  BootstrapFormTextarea,
  useFunctionalStateUpdater,
  usePropertySetters,
} from '@neinteractiveliterature/litform';

import { checkBucketFieldMinimums } from './RegistrationPolicyBucket';
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
}: RegistrationBucketRowProps<T>): React.JSX.Element {
  const updateBucket = useCallback(
    (newValue: T) => onChange(registrationBucket.key, newValue),
    [registrationBucket.key, onChange],
  );
  const setBucket = useFunctionalStateUpdater(registrationBucket, updateBucket);
  const [
    setName,
    setDescription,
    setSlotsLimited,
    setNotCounted,
    setExposeAttendees,
    setMinimumSlots,
    setPreferredSlots,
    setTotalSlots,
  ] = usePropertySetters(
    setBucket,
    'name',
    'description',
    'slots_limited',
    'not_counted',
    'expose_attendees',
    'minimum_slots',
    'preferred_slots',
    'total_slots',
  );

  const confirm = useConfirm();

  const unlimitedId = useId();
  const countedId = useId();
  const exposeAttendeesId = useId();
  const minId = useId();
  const preferredId = useId();
  const maxId = useId();

  const countValidationErrors = checkBucketFieldMinimums(registrationBucket);

  const renderBucketFlags = () => {
    if (lockLimited) {
      return null;
    }

    return (
      <div className="ms-2">
        <div className="form-check">
          <label className="form-check-label text-nowrap" htmlFor={unlimitedId}>
            <input
              id={unlimitedId}
              className="form-check-input"
              type="checkbox"
              checked={!registrationBucket.slots_limited}
              onChange={(event) => setSlotsLimited(!event.target.checked)}
              aria-label="Unlimited?"
            />
            Unlimited?
          </label>
        </div>

        <div className="form-check">
          <label className="form-check-label me-1" htmlFor={countedId}>
            <input
              id={countedId}
              className="form-check-input"
              type="checkbox"
              checked={!registrationBucket.not_counted}
              onChange={(event) => setNotCounted(!event.target.checked)}
              aria-label="Counted for signups?"
            />
            Counted for signups?{' '}
            <HelpPopover iconSet="bootstrap-icons">
              “Counted” buckets count towards the attendee’s number of signups, and are included in the “No Preference”
              option. If the bucket is <em>not</em> counted, any attendees who click “No Preference” won’t end up in
              this bucket.
            </HelpPopover>
          </label>
        </div>

        <div className="form-check">
          <div className="d-flex">
            <label className="form-check-label me-1" htmlFor={exposeAttendeesId}>
              <input
                id={exposeAttendeesId}
                className="form-check-input"
                type="checkbox"
                checked={registrationBucket.expose_attendees}
                onChange={(event) => setExposeAttendees(event.target.checked)}
                aria-label="Show bucket name in signup list?"
              />
              Show bucket name in signup list?{' '}
              <HelpPopover iconSet="bootstrap-icons">
                If checked, attendees will be able to see which of their fellow attendees are in this bucket via the
                signup summary page. (The signup summary always lists fellow attendees’ names, but normally doesn’t show
                which bucket they’re in.)
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

    const slotControls = (
      [
        {
          label: 'Min',
          field: 'minimum_slots',
          min: 0,
          inputId: minId,
          value: registrationBucket.minimum_slots ?? '',
          setValue: setMinimumSlots,
        },
        {
          label: 'Pref',
          field: 'preferred_slots',
          min: 0,
          inputId: preferredId,
          value: registrationBucket.preferred_slots ?? '',
          setValue: setPreferredSlots,
        },
        {
          label: 'Max',
          field: 'total_slots',
          min: 0,
          inputId: maxId,
          value: registrationBucket.total_slots ?? '',
          setValue: setTotalSlots,
        },
      ] as const
    ).map(({ label, field, min, inputId, value, setValue }) => (
      <div key={field} className={lockLimited ? 'd-inline me-2' : undefined}>
        <label htmlFor={inputId} className="form-label d-inline">
          {label}
        </label>
        <input
          id={inputId}
          type="number"
          size={2}
          className="form-control form-control-sm d-inline ms-1"
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
            value={registrationBucket.name ?? ''}
            onTextChange={setName}
            placeholder="Bucket name"
            label="Bucket name"
            labelClassName="form-label visually-hidden"
            className={classNames('form-control', {
              'is-invalid': validateComplete && !registrationBucket.name,
            })}
            invalidFeedback="This field is required."
          />
        </div>

        <BootstrapFormTextarea
          rows={2}
          value={registrationBucket.description ?? ''}
          label="Bucket description"
          labelClassName="form-label visually-hidden"
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
          <i className="bi-trash" />
          <span className="visually-hidden">Delete bucket</span>
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
