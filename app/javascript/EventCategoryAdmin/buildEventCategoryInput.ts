import { EventCategoryInput, SchedulingUi } from '../graphqlTypes.generated';

export function buildEventCategoryFromFormData(formData: FormData): EventCategoryInput {
  return {
    name: formData.get('name')?.toString(),
    team_member_name: formData.get('team_member_name')?.toString(),
    proposal_description: formData.get('proposal_description')?.toString(),
    departmentId: formData.get('department_id')?.toString(),
    scheduling_ui: formData.get('scheduling_ui')?.toString() as SchedulingUi | undefined,
    default_color: formData.get('default_color')?.toString(),
    signed_up_color: formData.get('signed_up_color')?.toString(),
    full_color: formData.get('full_color')?.toString(),
    eventFormId: formData.get('event_form_id')?.toString(),
    eventProposalFormId: formData.get('event_proposal_form_id')?.toString(),
    can_provide_tickets: formData.get('can_provide_tickets') === 'true',
  };
}
