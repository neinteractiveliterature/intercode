import { useState, useMemo } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ApolloError } from '@apollo/client';
import { Link, useFetcher } from 'react-router-dom';
import { DateTime } from 'luxon';
import {
  BootstrapFormInput,
  FormGroupWithLabel,
  ErrorDisplay,
  LoadingIndicator,
  MultipleChoiceInput,
  usePropertySetters,
} from '@neinteractiveliterature/litform';

import { timespanFromConvention, timespanFromConventionIfValid } from '../TimespanUtils';
import DateTimeInput from '../BuiltInFormControls/DateTimeInput';
import TimezoneSelect from '../BuiltInFormControls/TimezoneSelect';
import OrganizationSelect from '../BuiltInFormControls/OrganizationSelect';
import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import EnumTypes from '../enumTypes.json';
import ConventionLanguageInput from '../ConventionAdmin/ConventionLanguageInput';
import { NewConventionModalQueryData, RootSiteConventionsAdminTableQueryData } from './queries.generated';
import { Convention, TimezoneMode } from '../graphqlTypes.generated';

type CreatingConvention = Pick<
  Convention,
  'name' | 'domain' | 'email_from' | 'language' | 'starts_at' | 'ends_at' | 'timezone_mode' | 'timezone_name'
> & {
  organization?: { id: string; name: string } | null;
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
  data: NewConventionModalQueryData;
  cloneConvention?: RootSiteConventionsAdminTableQueryData['conventions_paginated']['entries'][0];
};

export default function NewConventionModal({ data, cloneConvention }: NewConventionModalProps) {
  const [convention, setConvention] = useState<CreatingConvention>(() =>
    cloneConvention
      ? { ...cloneConvention, ...DEFAULT_PROPS }
      : { ...DEFAULT_PROPS, timezone_name: DateTime.local().zoneName },
  );
  const cloneConventionTimespan = useMemo(
    () => (cloneConvention ? timespanFromConvention(cloneConvention) : null),
    [cloneConvention],
  );
  const [cmsContentSet, setCmsContentSet] = useState<(typeof CMS_CONTENT_SET_OPTIONS)[0] | null | undefined>(
    cloneConvention ? null : CMS_CONTENT_SET_OPTIONS[0],
  );
  const fetcher = useFetcher();
  const createError = fetcher.data instanceof Error ? fetcher.data : undefined;
  const createInProgress = fetcher.state !== 'idle';

  const [setName, setDomain, setEmailFrom, setOrganization, setLanguage, setTimezoneName, setEndsAt] =
    usePropertySetters(
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
      timespanFromConventionIfValid(convention)?.getLength('days') === cloneConventionTimespan.getLength('days')
    ) {
      const newStartsAtInZone = convention.timezone_name
        ? DateTime.fromISO(newStartsAt, { zone: convention.timezone_name })
        : DateTime.fromISO(newStartsAt);
      const newEndsAt = newStartsAtInZone.plus({ days: cloneConventionTimespan.getLength('days').days }).set({
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

  const create = () => {
    fetcher.submit(
      {
        cloneConventionId: cloneConvention?.id ?? null,
        organizationId: convention.organization?.id ?? null,
        cmsContentSetName: cmsContentSet?.name ?? null,
        convention: {
          name: convention.name ?? null,
          domain: convention.domain ?? null,
          email_from: convention.email_from ?? null,
          language: convention.language ?? null,
          starts_at: convention.starts_at ?? null,
          ends_at: convention.ends_at ?? null,
          timezone_name: convention.timezone_name ?? null,
          timezone_mode: convention.timezone_mode,
        },
      },
      { action: `/conventions/new`, method: 'POST', encType: 'application/json' },
    );
  };

  const timezoneNameForInputs = convention.timezone_name ?? DateTime.local().zoneName ?? '';

  return (
    <Modal visible dialogClassName="modal-lg">
      <div className="modal-header">{cloneConvention ? `Clone ${cloneConvention.name}` : 'New convention'}</div>

      <div className="modal-body">
        <BootstrapFormInput label="Name" value={convention.name} onTextChange={setName} />

        <BootstrapFormInput label="Domain name" value={convention.domain ?? ''} onTextChange={setDomain} />

        <BootstrapFormInput label="Email from" value={convention.email_from} onTextChange={setEmailFrom} />

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
          <TimezoneSelect label="Time zone" value={convention.timezone_name} onChange={setTimezoneName} />
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
            onChange={(newValue: (typeof CMS_CONTENT_SET_OPTIONS)[0]) => setCmsContentSet(newValue)}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.name}
          />
        )}

        <ErrorDisplay graphQLError={createError as ApolloError} />
      </div>

      <div className="modal-footer">
        <Link to=".." className="btn btn-secondary">
          Cancel
        </Link>
        <button className="btn btn-primary" type="button" onClick={create} disabled={createInProgress}>
          {createInProgress ? (
            <LoadingIndicator iconSet="bootstrap-icons" />
          ) : (
            `${cloneConvention ? 'Clone' : 'Create'}`
          )}
        </button>
      </div>
    </Modal>
  );
}
