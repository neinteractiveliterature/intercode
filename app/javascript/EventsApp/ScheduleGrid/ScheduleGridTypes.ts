import { SchedulingUi } from '../../graphqlTypes.generated';
import { ConventionForTimespanUtils } from '../../TimespanUtils';
import { CommonFormItemFieldsFragment } from '../../Models/commonFormFragments.generated';

export type ScheduleGridEventCategory = {
  __typename: 'EventCategory';
  id: string;
  name: string;
  default_color: string | null;
  full_color: string | null;
  signed_up_color: string | null;
  team_member_name: string;
  teamMemberNamePlural: string;
  scheduling_ui: SchedulingUi;
  event_form: {
    __typename: 'Form';
    id: string;
    form_sections: {
      __typename: 'FormSection';
      id: string;
      form_items: CommonFormItemFieldsFragment[];
    }[];
  };
};

export type ScheduleGridConventionInput = ConventionForTimespanUtils & {
  event_categories: ScheduleGridEventCategory[];
};
