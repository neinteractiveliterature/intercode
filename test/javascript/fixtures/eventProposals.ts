import {
  EventProposalFieldsFragment,
  EventProposalQueryData,
} from '../../../app/javascript/EventProposals/queries.generated';
import { TypedFormItem } from '../../../app/javascript/FormAdmin/FormItemUtils';
import { FormItemRole, FormType, TimezoneMode } from '../../../app/javascript/graphqlTypes.generated';
import { buildFreeTextItem } from './formItems';

type FormFromFragment = NonNullable<EventProposalFieldsFragment['event_category']['event_proposal_form']>;

// Form item fixtures carry parsed properties; the API sends them as JSON strings
export function buildProposalForm(
  items: TypedFormItem[] = [buildFreeTextItem({ identifier: 'title', caption: 'Title' })],
) {
  const form: FormFromFragment = {
    __typename: 'Form',
    id: '30',
    title: 'Proposal form',
    form_type: FormType.EventProposal,
    form_sections: [
      {
        __typename: 'FormSection',
        id: '40',
        title: 'Basics',
        position: 1,
        form_items: items.map((item, index) => ({
          __typename: 'FormItem',
          id: item.id,
          admin_description: null,
          position: index + 1,
          identifier: item.identifier ?? null,
          item_type: item.item_type,
          rendered_properties: JSON.stringify(item.rendered_properties),
          default_value: null,
          visibility: item.visibility,
          writeability: item.writeability,
          expose_in: null,
        })),
      },
    ],
  };
  return form;
}

export function buildEventProposalFields(
  overrides: Partial<EventProposalFieldsFragment> = {},
  form: FormFromFragment | null = buildProposalForm(),
): EventProposalFieldsFragment {
  return {
    __typename: 'EventProposal',
    id: '20',
    title: 'My Big Game',
    status: 'proposed',
    form_response_attrs_json: JSON.stringify({ title: 'My Big Game' }),
    current_user_form_item_viewer_role: FormItemRole.Normal,
    current_user_form_item_writer_role: FormItemRole.Normal,
    images: [],
    event_category: { __typename: 'EventCategory', id: '5', name: 'Tabletop RPG', event_proposal_form: form },
    event: null,
    ...overrides,
  };
}

export function buildEventProposalQueryData(
  proposalOverrides: Partial<EventProposalFieldsFragment> = {},
  { canDelete = false }: { canDelete?: boolean } = {},
): EventProposalQueryData {
  return {
    __typename: 'Query',
    currentAbility: { __typename: 'Ability', can_delete_event_proposal: canDelete },
    convention: {
      __typename: 'Convention',
      id: '1',
      starts_at: '2026-06-05T00:00:00Z',
      ends_at: '2026-06-07T23:00:00Z',
      timezone_name: 'UTC',
      timezone_mode: TimezoneMode.ConventionLocal,
      event_mailing_list_domain: null,
      event_proposal: buildEventProposalFields(proposalOverrides),
    },
  };
}
