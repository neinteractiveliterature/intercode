import { EventCategoryInput } from '../graphqlTypes.generated';
import { EventCategoryForForm } from './EventCategoryForm';

export default function buildEventCategoryInput(eventCategory: EventCategoryForForm): EventCategoryInput {
  return {
    name: eventCategory.name,
    team_member_name: eventCategory.team_member_name,
    proposal_description: eventCategory.proposal_description,
    departmentId: eventCategory.department?.id ?? null,
    scheduling_ui: eventCategory.scheduling_ui,
    default_color: eventCategory.default_color,
    signed_up_color: eventCategory.signed_up_color,
    full_color: eventCategory.full_color,
    eventFormId: eventCategory.event_form?.id ?? null,
    eventProposalFormId: eventCategory.event_proposal_form?.id ?? null,
    can_provide_tickets: eventCategory.can_provide_tickets,
  };
}
