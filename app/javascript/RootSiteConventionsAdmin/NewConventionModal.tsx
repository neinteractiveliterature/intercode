import { useState, useMemo } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ApolloError } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { DateTime } from 'luxon';
import {
  BootstrapFormInput,
  FormGroupWithLabel,
  ErrorDisplay,
  LoadingIndicator,
  MultipleChoiceInput,
  usePropertySetters,
  LoadQueryWrapper,
} from '@neinteractiveliterature/litform';

import { timespanFromConvention } from '../TimespanUtils';
import DateTimeInput from '../BuiltInFormControls/DateTimeInput';
import TimezoneSelect from '../BuiltInFormControls/TimezoneSelect';
import OrganizationSelect from '../BuiltInFormControls/OrganizationSelect';
import useAsyncFunction from '../useAsyncFunction';
import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import EnumTypes from '../enumTypes.json';
import ConventionLanguageInput from '../ConventionAdmin/ConventionLanguageInput';
import {
  NewConventionModalQueryData,
  NewConventionModalQueryVariables,
  RootSiteConventionsAdminTableQueryData,
  useNewConventionModalQuery,
} from './queries.generated';
import { Convention, Organization, TimezoneMode } from '../graphqlTypes.generated';
import { useCreateConventionMutation } from './mutations.generated';

type CreatingConvention = Pick<
  Convention,
  | 'name'
  | 'domain'
  | 'email_from'
  | 'language'
  | 'starts_at'
  | 'ends_at'
  | 'timezone_mode'
  | 'timezone_name'
> & {
  organization?: Pick<Organization, 'id'> | null;
};

const DEFAULT_PROPS: CreatingConvention = {
  email_from: '',
  language: 'en',
  name: '',
  domain: '',
  timezone_mode: TimezoneMode.ConventionLocal,
};

const CMS_CONTENT_SET_OPTIONS = [
  { name: 'standard', label: 'Standard convention content' },
  { name: 'single_event', label: 'Standard single-event site content' },
  { name: 'procon_import', label: 'Content for Concentral-imported site' },
];

export type NewConventionModalProps = {
  visible: boolean;
  close: () => void;
  cloneConvention?: RootSiteConventionsAdminTableQueryData['conventions_paginated']['entries'][0];
};

export default LoadQueryWrapper<
  NewConventionModalQueryData,
  NewConventionModalQueryVariables,
  NewConventionModalProps
>(
  useNewConventionModalQuery,
  function NewConventionModal({ visible, close, cloneConvention, data }) {
    const history = useHistory();
    const [createConvention] = useCreateConventionMutation();
    const [convention, setConvention] = useState<CreatingConvention>(() =>
      cloneConvention
        ? { ...cloneConvention, ...DEFAULT_PROPS }
        : { ...DEFAULT_PROPS, timezone_name: DateTime.local().zoneName },
    );
    const cloneConventionTimespan = useMemo(
      () => (cloneConvention ? timespanFromConvention(cloneConvention) : null),
      [cloneConvention],
    );
    const [cmsContentSet, setCmsContentSet] = useState<
      typeof CMS_CONTENT_SET_OPTIONS[0] | null | undefined
    >(cloneConvention ? null : CMS_CONTENT_SET_OPTIONS[0]);

    const [
      setName,
      setDomain,
      setEmailFrom,
      setOrganization,
      setLanguage,
      setTimezoneName,
      setEndsAt,
    ] = usePropertySetters(
      setConvention,
      'name',
      'domain',
      'email_from',
      'organization',
      'language',
      'timezone_name',
      'ends_at',
    );

    const setTimezoneMode = (timezoneMode: TimezoneMode) => {
      setConvention((prevConvention) => ({
        ...prevConvention,
        timezone_mode: timezoneMode,
        timezone_name: timezoneMode === 'user_local' ? null : prevConvention.timezone_name,
      }));
    };

    const setStartsAt = (newStartsAt: CreatingConvention['starts_at']) => {
      if (
        newStartsAt &&
        cloneConventionTimespan?.isFinite() &&
        timespanFromConvention(convention).getLength('days') ===
          cloneConventionTimespan.getLength('days')
      ) {
        const newStartsAtInZone = convention.timezone_name
          ? DateTime.fromISO(newStartsAt, { zone: convention.timezone_name })
          : DateTime.fromISO(newStartsAt);
        const newEndsAt = newStartsAtInZone
          .plus({ days: cloneConventionTimespan.getLength('days').days })
          .set({
            hour: cloneConventionTimespan.finish.hour,
            minute: cloneConventionTimespan.finish.minute,
            second: cloneConventionTimespan.finish.second,
          });
        setConvention((prevConvention) => ({
          ...prevConvention,
          starts_at: newStartsAt,
          ends_at: newEndsAt.toISO(),
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
            language: convention.language,
            starts_at: convention.starts_at,
            ends_at: convention.ends_at,
            timezone_name: convention.timezone_name,
            timezone_mode: convention.timezone_mode,
          },
        },
      });

      if (result.data) {
        history.push(`/conventions/${result.data.createConvention.convention.id}`);
      }
    };

    const timezoneNameForInputs = convention.timezone_name ?? DateTime.local().zoneName;

    const [createClicked, createError, createInProgress] = useAsyncFunction(create);

    return (
      <Modal visible={visible} dialogClassName="modal-lg">
        <div className="modal-header">
          {cloneConvention ? `Clone ${cloneConvention.name}` : 'New convention'}
        </div>

        <div className="modal-body">
          <BootstrapFormInput label="Name" value={convention.name} onTextChange={setName} />

          <BootstrapFormInput
            label="Domain name"
            value={convention.domain ?? ''}
            onTextChange={setDomain}
          />

          <BootstrapFormInput
            label="Email from"
            value={convention.email_from}
            onTextChange={setEmailFrom}
          />

          <OrganizationSelect
            organizations={data.organizations}
            value={convention.organization}
            onChange={setOrganization}
            isClearable
          />

          <ConventionLanguageInput value={convention.language} onChange={setLanguage} />

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
              onChange={setTimezoneName}
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
                onChange={setEndsAt}
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
              onChange={(newValue: typeof CMS_CONTENT_SET_OPTIONS[0]) => setCmsContentSet(newValue)}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.name}
            />
          )}

          <ErrorDisplay graphQLError={createError as ApolloError} />
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
            {createInProgress ? (
              <LoadingIndicator iconSet="bootstrap-icons" />
            ) : (
              `${cloneConvention ? 'Clone' : 'Create'}`
            )}
          </button>
        </div>
      </Modal>
    );
  },
);
