const presets = [
  {
    name: 'Unlimited slots',
    policy: {
      buckets: [
        {
          key: 'unlimited',
          name: 'Signups',
          description: 'Signups for this event',
          slots_limited: true,
        },
      ],
    },
  },
  {
    name: 'Limited slots',
    policy: {
      buckets: [
        {
          key: 'signups',
          name: 'Signups',
          description: 'Signups for this event',
          slots_limited: true,
        },
      ],
    },
  },
  {
    name: 'Limited slots by gender',
    policy: {
      buckets: [
        {
          key: 'male',
          name: 'Male',
          description: 'Male characters',
          slots_limited: true,
        },
        {
          key: 'female',
          name: 'Female',
          description: 'Female characters',
          slots_limited: true,
        },
        {
          key: 'anything',
          name: 'Anything',
          description: 'Characters that are not strictly defined as male or female',
          slots_limited: true,
          anything: true,
        },
      ],
    },
  },
];

export default presets;
