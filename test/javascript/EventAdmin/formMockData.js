import formFromExportJSON from '../formFromExportJSON';

export const minimalForm = formFromExportJSON({
  title: 'Regular event form',
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

export const convention = {
  starts_at: '2017-01-01T00:00:00Z',
  ends_at: '2017-01-03T00:00:00Z',
  timezone_name: 'UTC',
};

export const initialEvent = {
  id: 123,
  form_response_attrs: {
    title: '',
    author: '',
    email: '',
    organization: '',
    con_mail_destination: 'gms',
    url: '',
    short_blurb: '',
    description: '',
    participant_communications: '',
    can_play_concurrently: false,
    registration_policy: {
      buckets: [],
    },
  },
};
