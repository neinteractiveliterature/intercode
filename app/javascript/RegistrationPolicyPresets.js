const presets = [
  {
    name: 'Unlimited slots',
    policy: {
      buckets: [
        {
          key: 'unlimited',
          name: 'Signups',
          description: 'Signups for this event',
          slots_limited: false,
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
    name: 'Limited slots for horde larps',
    policy: {
      buckets: [
        {
          key: 'horde',
          name: 'Horde',
          description: 'Players who will be playing multiple characters over the course of the game',
          slots_limited: true,
        },
        {
          key: 'cast',
          name: 'Cast',
          description: 'Players who will have one character for the entire game',
          slots_limited: true,
        },
      ],
    },
  },
  {
    name: 'Limited slots by binary gender',
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
