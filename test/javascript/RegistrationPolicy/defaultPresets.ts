import { RegistrationPolicyPreset } from '../../../app/javascript/FormAdmin/FormItemUtils';

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
    name: 'Limited slots for larps with NPCs',
    policy: {
      buckets: [
        {
          key: 'pcs',
          name: 'PC',
          description: 'Player characters',
          slots_limited: true,
          expose_attendees: true,
        },
        {
          key: 'npcs',
          name: 'NPC',
          description: 'Non-player characters',
          slots_limited: true,
          not_counted: true,
          expose_attendees: true,
        },
      ],
      prevent_no_preference_signups: true,
    },
  },
  {
    name: 'Limited slots for horde larps',
    policy: {
      buckets: [
        {
          key: 'cast',
          name: 'Cast',
          description: 'Players who will have one character for the entire game',
          slots_limited: true,
        },
        {
          key: 'horde',
          name: 'Horde',
          description: 'Players who will be playing multiple characters over the course of the game',
          slots_limited: true,
        },
      ],
    },
  },
  {
    name: 'Limited slots by gender (classic Intercon-style)',
    policy: {
      buckets: [
        {
          key: 'female',
          name: 'Female role',
          description: 'Female characters',
          slots_limited: true,
        },
        {
          key: 'male',
          name: 'Male role',
          description: 'Male characters',
          slots_limited: true,
        },
        {
          key: 'flex',
          name: 'Flex',
          description: 'Characters that are not strictly defined as male or female',
          slots_limited: true,
          anything: true,
        },
      ],
    },
  },
] as RegistrationPolicyPreset[];

export default presets;
