import React from 'react';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import type { ConventionFormConvention } from './ConventionForm';
import { ConventionAdminConventionQueryQuery } from './queries.generated';
import { usePartialState, usePartialStateFactory } from '../usePartialState';
import { EmailMode } from '../graphqlTypes.generated';

export type ConventionFormEmailSectionProps = {
  convention: ConventionFormConvention;
  setConvention: React.Dispatch<React.SetStateAction<ConventionFormConvention>>;
  disabled: boolean;
  staffPositions: ConventionAdminConventionQueryQuery['convention']['staff_positions'];
};

function ConventionFormEmailSection({
  convention,
  setConvention,
  disabled,
  staffPositions,
}: ConventionFormEmailSectionProps) {
  const factory = usePartialStateFactory(convention, setConvention);
  const [eventMailingListDomain, setEventMailingListDomain] = usePartialState(
    factory,
    'event_mailing_list_domain',
  );
  const [emailFrom, setEmailFrom] = usePartialState(factory, 'email_from');
  const [catchAllStaffPosition, setCatchAllStaffPosition] = usePartialState(
    factory,
    'catch_all_staff_position',
  );
  const [emailMode, setEmailMode] = usePartialState(factory, 'email_mode');

  return (
    <>
      <BootstrapFormInput
        name="email_from"
        label="Email from"
        value={emailFrom ?? ''}
        helpText="Site-generated emails will come from this address."
        onTextChange={setEmailFrom}
        disabled={disabled}
      />

      <BootstrapFormInput
        name="event_mailing_list_domain"
        label="Event mailing list domain name"
        value={eventMailingListDomain ?? ''}
        helpText="If present, event teams can use this domain name to create automatically-managed mailing lists for their team."
        onTextChange={setEventMailingListDomain}
        disabled={disabled}
      />

      <SelectWithLabel
        label="Catch-all staff position"
        helpText={`If present, email received by any address @${convention.domain}
          that doesn’t match any staff position will be forwarded to this staff position.`}
        options={staffPositions}
        getOptionLabel={(staffPosition) => staffPosition.name}
        getOptionValue={(staffPosition) => staffPosition.id.toString()}
        value={catchAllStaffPosition}
        isClearable
        onChange={(newValue: typeof catchAllStaffPosition) => setCatchAllStaffPosition(newValue)}
      />

      <MultipleChoiceInput
        caption="Email receiving mode"
        choices={[
          {
            value: 'forward',
            label: `Forward received @${convention.domain} emails to staff as configured`,
          },
          {
            value: 'staff_emails_to_catch_all',
            label: `Forward all @${convention.domain} emails to the catch-all staff position`,
          },
        ]}
        value={emailMode}
        onChange={(newValue: string) => setEmailMode(newValue as EmailMode)}
        disabled={disabled}
      />
    </>
  );
}

export default ConventionFormEmailSection;
