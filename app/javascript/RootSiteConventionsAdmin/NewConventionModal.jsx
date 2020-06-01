import React, { useState, useMemo } from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { DateTime } from 'luxon';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import { timespanFromConvention } from '../TimespanUtils';
import DateTimeInput from '../BuiltInFormControls/DateTimeInput';
import FormGroupWithLabel from '../BuiltInFormControls/FormGroupWithLabel';
import TimezoneSelect from '../BuiltInFormControls/TimezoneSelect';
import OrganizationSelect from '../BuiltInFormControls/OrganizationSelect';
import { NewConventionModalQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import { CreateConvention } from './mutations.gql';
import LoadingIndicator from '../LoadingIndicator';
import useAsyncFunction from '../useAsyncFunction';
import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import EnumTypes from '../enumTypes.json';

const DEFAULT_PROPS = {
  name: '',
  domain: '',
  timezone_mode: 'convention_local',
};

const CMS_CONTENT_SET_OPTIONS = [
  { name: 'standard', label: 'Standard convention content' },
  { name: 'single_event', label: 'Standard single-event site content' },
  { name: 'procon_import', label: 'Content for Concentral-imported site' },
];

function NewConventionModal({ visible, close, cloneConvention }) {
  const history = useHistory();
  const { data, loading, error } = useQuery(NewConventionModalQuery);
  const [createConvention] = useMutation(CreateConvention);
  const [convention, setConvention] = useState(() => (
    cloneConvention
      ? { ...cloneConvention, ...DEFAULT_PROPS }
      : { ...DEFAULT_PROPS, timezone_name: moment.tz.guess() }
  ));
  const cloneConventionTimespan = useMemo(
    () => (cloneConvention ? timespanFromConvention(cloneConvention) : null),
    [cloneConvention],
  );
  const [cmsContentSet, setCmsContentSet] = useState(
    cloneConvention ? null : CMS_CONTENT_SET_OPTIONS[0],
  );

  const conventionSetter = (fieldName) => (
    (value) => setConvention((prevConvention) => ({ ...prevConvention, [fieldName]: value }))
  );

  const setTimezoneMode = (timezoneMode) => {
    setConvention((prevConvention) => ({
      ...prevConvention,
      timezone_mode: timezoneMode,
      timezone_name: (timezoneMode === 'user_local' ? null : prevConvention.timezone_name),
    }));
  };

  const setStartsAt = (newStartsAt) => {
    if (
      cloneConventionTimespan?.isFinite()
      && timespanFromConvention(convention).getLength('day') === cloneConventionTimespan.getLength('day')
    ) {
      const newEndsAt = moment.tz(newStartsAt, convention.timezone_name)
        .add(cloneConventionTimespan.getLength('day'), 'day')
        .set({
          hour: cloneConventionTimespan.finish.hour(),
          minute: cloneConventionTimespan.finish.minute(),
          second: cloneConventionTimespan.finish.second(),
        });
      setConvention((prevConvention) => ({
        ...prevConvention, starts_at: newStartsAt, ends_at: newEndsAt.toISOString(),
      }));
    } else {
      setConvention((prevConvention) => ({ ...prevConvention, starts_at: newStartsAt }));
    }
  };

  const create = async () => {
    const result = await createConvention({
      variables: {
        cloneConventionId: cloneConvention?.id,
        organizationId: convention.organization?.id,
        cmsContentSetName: cmsContentSet?.name,
        convention: {
          name: convention.name,
          domain: convention.domain,
          email_from: convention.email_from,
          starts_at: convention.starts_at,
          ends_at: convention.ends_at,
          timezone_name: convention.timezone_name,
          timezone_mode: convention.timezone_mode,
        },
      },
    });

    history.push(`/conventions/${result.data.createConvention.convention.id}`);
  };

  const timezoneNameForInputs = convention.timezone_name ?? DateTime.local().zoneName;

  const [createClicked, createError, createInProgress] = useAsyncFunction(create);

  if (loading) {
    return null;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <Modal visible={visible} dialogClassName="modal-lg">
      <div className="modal-header">
        {cloneConvention ? `Clone ${cloneConvention.name}` : 'New convention'}
      </div>

      <div className="modal-body">
        <BootstrapFormInput
          label="Name"
          value={convention.name}
          onTextChange={conventionSetter('name')}
        />

        <BootstrapFormInput
          label="Domain name"
          value={convention.domain}
          onTextChange={conventionSetter('domain')}
        />

        <BootstrapFormInput
          label="Email from"
          value={convention.email_from}
          onTextChange={conventionSetter('email_from')}
        />

        <OrganizationSelect
          organizations={data.organizations}
          value={convention.organization}
          onChange={conventionSetter('organization')}
          isClearable
        />

        <MultipleChoiceInput
          caption="Date and time display mode"
          choices={EnumTypes.TimezoneMode.enumValues.map((enumValue) => ({
            value: enumValue.name,
            label: enumValue.description,
          }))}
          value={convention.timezone_mode}
          onChange={setTimezoneMode}
        />

        {convention.timezone_mode === 'convention_local' && (
          <TimezoneSelect
            label="Time zone"
            value={convention.timezone_name}
            onChange={conventionSetter('timezone_name')}
          />
        )}

        <FormGroupWithLabel label="Starts at">
          {(id) => (
            <DateTimeInput
              value={convention.starts_at}
              timezoneName={timezoneNameForInputs}
              onChange={setStartsAt}
              id={id}
              alwaysShowTimezone
            />
          )}
        </FormGroupWithLabel>

        <FormGroupWithLabel label="Ends at">
          {(id) => (
            <DateTimeInput
              value={convention.ends_at}
              timezoneName={timezoneNameForInputs}
              onChange={conventionSetter('ends_at')}
              id={id}
              alwaysShowTimezone
            />
          )}
        </FormGroupWithLabel>

        {!cloneConvention && (
          <SelectWithLabel
            label="Initial CMS content set"
            options={CMS_CONTENT_SET_OPTIONS}
            value={cmsContentSet}
            onChange={setCmsContentSet}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.name}
          />
        )}

        <ErrorDisplay graphQLError={createError} />
      </div>

      <div className="modal-footer">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={close}
          disabled={createInProgress}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={createClicked}
          disabled={createInProgress}
        >
          {createInProgress ? <LoadingIndicator /> : `${cloneConvention ? 'Clone' : 'Create'}`}
        </button>
      </div>
    </Modal>
  );
}

NewConventionModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  cloneConvention: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

NewConventionModal.defaultProps = {
  cloneConvention: null,
};

export default NewConventionModal;
