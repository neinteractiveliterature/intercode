import formFromExportJSON from '../formFromExportJSON';
import { TimezoneMode, Event, FormItemRole, FormType } from '../../../app/javascript/graphqlTypes.generated';
import { ConventionForFormItemDisplay } from '../../../app/javascript/FormPresenter/ItemDisplays/FormItemDisplay';
import { FormResponse } from '../../../app/javascript/FormPresenter/useFormResponse';
import { DEFAULT_EVENT_FORM_RESPONSE_ATTRS } from '../../../app/javascript/EventAdmin/useEventForm';

export const minimalForm = formFromExportJSON({
  title: 'Regular event form',
  form_type: FormType.Event,
  sections: [
    {
      title: 'Event Properties',
      section_items: [
        {
          item_type: 'free_text',
          identifier: 'title',
          public_description: 'Title',
          caption: 'Title',
          lines: 1,
          required: true,
        },
      ],
    },
  ],
});

export const convention: ConventionForFormItemDisplay = {
  starts_at: '2017-01-01T00:00:00Z',
  ends_at: '2017-01-03T00:00:00Z',
  timezone_name: 'UTC',
  timezone_mode: TimezoneMode.UserLocal,
};

export const initialEvent: FormResponse &
  Pick<Event, 'current_user_form_item_viewer_role' | 'current_user_form_item_writer_role'> & { id: string } = {
  id: '123',
  form_response_attrs: DEFAULT_EVENT_FORM_RESPONSE_ATTRS,
  current_user_form_item_viewer_role: FormItemRole.Normal,
  current_user_form_item_writer_role: FormItemRole.Normal,
};
