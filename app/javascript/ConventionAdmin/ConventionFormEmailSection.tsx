import * as React from 'react';
import { BootstrapFormInput, MultipleChoiceInput, usePropertySetters } from '@neinteractiveliterature/litform';

import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import type { ConventionFormConvention } from './ConventionForm';
import { ConventionAdminConventionQueryData } from './queries.generated';
import { EmailMode } from '../graphqlTypes.generated';

export type ConventionFormEmailSectionProps = {
  convention: ConventionFormConvention;
  setConvention: React.Dispatch<React.SetStateAction<ConventionFormConvention>>;
  disabled: boolean;
  staffPositions: ConventionAdminConventionQueryData['convention']['staff_positions'];
};

function ConventionFormEmailSection({
  convention,
  setConvention,
  disabled,
  staffPositions,
}: ConventionFormEmailSectionProps): React.JSX.Element {
  const [setEventMailingListDomain, setEmailFrom, setCatchAllStaffPosition, setEmailMode] = usePropertySetters(
    setConvention,
    'event_mailing_list_domain',
    'email_from',
    'catch_all_staff_position',
    'email_mode',
  );

  return (
    <>
      <BootstrapFormInput
        name="email_from"
        label="Email from"
        value={convention.email_from ?? ''}
        helpText="Site-generated emails will come from this address."
        onTextChange={setEmailFrom}
        disabled={disabled}
      />

      <BootstrapFormInput
        name="event_mailing_list_domain"
        label="Event mailing list domain name"
        value={convention.event_mailing_list_domain ?? ''}
        helpText="If present, event teams can use this domain name to create automatically-managed mailing lists for their team."
        onTextChange={setEventMailingListDomain}
        disabled={disabled}
      />

      <SelectWithLabel
        label="Catch-all staff position"
        helpText={`If present, email received by any address @${convention.domain}
          that doesn’t match any staff position will be forwarded to this staff position.`}
        options={staffPositions}
        getOptionLabel={(staffPosition) => staffPosition?.name ?? ''}
        getOptionValue={(staffPosition) => staffPosition?.id.toString() ?? ''}
        value={convention.catch_all_staff_position}
        isClearable
        onChange={(newValue: typeof convention.catch_all_staff_position) => setCatchAllStaffPosition(newValue)}
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
        value={convention.email_mode}
        onChange={(newValue: string) => setEmailMode(newValue as EmailMode)}
        disabled={disabled}
      />
    </>
  );
}

export default ConventionFormEmailSection;
