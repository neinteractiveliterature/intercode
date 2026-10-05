import buildSignupOptions, { SignupOption } from '../../../app/javascript/EventsApp/EventPage/buildSignupOptions';
import sortBuckets from '../../../app/javascript/EventsApp/EventPage/sortBuckets';
import SignupCountData from '../../../app/javascript/EventsApp/SignupCountData';
import { RegistrationPolicyBucket, SignupState } from '../../../app/javascript/graphqlTypes.generated';
import { buildBucket, buildStandardBuckets } from '../fixtures/registrationPolicy';

type EventArg = Parameters<typeof buildSignupOptions>[0];

const player = buildBucket({ id: '1', key: 'player', name: 'Player', total_slots: 10 });
const gm = buildBucket({ id: '2', key: 'gm', name: 'GM', total_slots: 2 });
const flex = buildStandardBuckets()[2];
const observer = buildBucket({
  id: '4',
  key: 'observer',
  name: 'Observer',
  not_counted: true,
  slots_limited: false,
  total_slots: null,
});

const buildEvent = (
  buckets: RegistrationPolicyBucket[],
  { preventNoPreference = false, teamMemberIds = [] }: { preventNoPreference?: boolean; teamMemberIds?: string[] } = {},
): EventArg => ({
  registration_policy: {
    __typename: 'RegistrationPolicy',
    slots_limited: true,
    prevent_no_preference_signups: preventNoPreference,
    total_slots_including_not_counted: 12,
    // (the fixtures are the full generated type, where missing values are optional rather than null)
    buckets: buckets.map((bucket) => ({
      __typename: 'RegistrationPolicyBucket',
      id: bucket.id,
      key: bucket.key,
      name: bucket.name,
      description: bucket.description ?? null,
      not_counted: bucket.not_counted,
      slots_limited: bucket.slots_limited,
      anything: bucket.anything,
      minimum_slots: bucket.minimum_slots ?? null,
      total_slots: bucket.total_slots ?? null,
    })),
  },
  team_members: teamMemberIds.map((id) => ({ user_con_profile: { id } })),
  event_category: { team_member_name: 'GM' },
});

// Confirmed signups per bucket, in the shape the run's grouped counts take
const counts = (byBucket: Record<string, number>, state = SignupState.Confirmed) =>
  SignupCountData.fromGroupedCounts(
    Object.entries(byBucket).map(([bucketId, count]) => ({
      bucket: { id: bucketId },
      count,
      counted: true,
      state,
      team_member: false,
    })),
  );

describe('buildSignupOptions', () => {
  const build = (
    event: EventArg,
    {
      signupCounts = counts({}),
      addToQueue = false,
      pending = [],
      atMaximum = false,
      userConProfile = { id: '99' },
    }: {
      signupCounts?: SignupCountData;
      addToQueue?: boolean;
      pending?: SignupOption['pendingRankedChoices'];
      atMaximum?: boolean;
      userConProfile?: { id: string } | undefined;
    } = {},
  ) => buildSignupOptions(event, signupCounts, addToQueue, pending, { at_maximum_signups: atMaximum }, userConProfile);

  const keys = (options: SignupOption[]) => options.map((option) => option.key);

  describe('the options on offer', () => {
    it('offers each regular bucket, plus “no preference”, as the main options', () => {
      const result = build(buildEvent([player, gm, flex]));

      expect(keys(result.mainPreference)).toEqual(['2', '1']);
      expect(keys(result.mainNoPreference)).toEqual(['_no_preference']);
      expect(result.auxiliary).toEqual([]);
    });

    it('never offers a flex ("anything") bucket as a choice of its own', () => {
      const result = build(buildEvent([player, gm, flex]));

      expect(keys([...result.mainPreference, ...result.mainNoPreference, ...result.auxiliary])).not.toContain('3');
    });

    it('orders the buckets the way the run capacity graph does', () => {
      const result = build(buildEvent([player, gm, observer, flex]));

      expect(keys(result.mainPreference)).toEqual(['2', '1']);
    });

    it('labels buckets by name, with a description as help text', () => {
      const described = buildBucket({ ...gm, description: 'Runs the game' });
      const result = build(buildEvent([player, described]));

      const option = result.mainPreference.find((o) => o.key === '2');
      expect(option).toMatchObject({ label: 'GM', helpText: 'Runs the game', counted: true, noPreference: false });
    });

    it('gives each bucket a button colour by its position, matching the capacity graph', () => {
      const result = build(buildEvent([player, gm]));

      expect(result.mainPreference.map((option) => option.buttonClass)).toEqual([
        'btn-outline-bucket-color-1',
        'btn-outline-bucket-color-2',
      ]);
    });

    it('cycles through nine button colours', () => {
      const buckets = Array.from({ length: 10 }, (_, index) =>
        buildBucket({ id: String(index + 1), key: `b${index}`, name: `Bucket ${String(index).padStart(2, '0')}` }),
      );

      const classes = build(buildEvent(buckets)).mainPreference.map((option) => option.buttonClass);

      expect(classes[0]).toBe('btn-outline-bucket-color-1');
      expect(classes[8]).toBe('btn-outline-bucket-color-9');
      expect(classes[9]).toBe('btn-outline-bucket-color-1');
    });

    describe('with only one regular bucket', () => {
      it('has no label (there’s nothing to choose between) and no “no preference” option', () => {
        const result = build(buildEvent([player, flex]));

        expect(result.mainPreference).toHaveLength(1);
        expect(result.mainPreference[0].label).toBeUndefined();
        expect(result.mainNoPreference).toEqual([]);
      });
    });

    describe('“no preference”', () => {
      it('offers any of the limited, counted buckets, saying which', () => {
        const option = build(buildEvent([player, gm, flex])).mainNoPreference[0];

        expect(option).toMatchObject({
          label: 'No preference',
          noPreference: true,
          counted: true,
          bucket: undefined,
          // (in the order the policy lists them, not the order they're shown in)
          helpText: 'Sign up for any of: Player, GM',
        });
      });

      it('is left out when the event prevents no-preference signups', () => {
        const result = build(buildEvent([player, gm], { preventNoPreference: true }));

        expect(result.mainNoPreference).toEqual([]);
      });

      it('ignores buckets that aren’t limited or aren’t counted', () => {
        const result = build(buildEvent([player, observer, flex]));

        expect(result.mainNoPreference).toEqual([]);
      });
    });

    describe('buckets that aren’t counted', () => {
      it('are auxiliary options, with the counted bucket staying main', () => {
        const result = build(buildEvent([player, observer]));

        expect(keys(result.mainPreference)).toEqual(['1']);
        expect(keys(result.auxiliary)).toEqual(['4']);
        expect(result.auxiliary[0]).toMatchObject({ label: 'Observer', counted: false });
        expect(result.mainPreference[0].label).toBe('Player');
      });
    });

    describe('for a team member', () => {
      it('offers only a team member signup, named for the event category, as an auxiliary option', () => {
        const result = build(buildEvent([player, gm], { teamMemberIds: ['7'] }), { userConProfile: { id: '7' } });

        expect(result.mainPreference).toEqual([]);
        expect(result.mainNoPreference).toEqual([]);
        expect(result.auxiliary).toHaveLength(1);
        expect(result.auxiliary[0]).toMatchObject({
          key: '_team_member',
          label: 'GM',
          teamMember: true,
          counted: false,
          action: 'SIGN_UP_NOW',
          helpText: 'Register your intent to come to this event as a GM',
        });
      });

      it('is not applied to someone who isn’t on the team, or to nobody', () => {
        const event = buildEvent([player, gm], { teamMemberIds: ['7'] });

        expect(build(event, { userConProfile: { id: '8' } }).auxiliary).toEqual([]);
        expect(build(event, { userConProfile: undefined }).auxiliary).toEqual([]);
      });
    });
  });

  describe('what signing up would do', () => {
    const actionFor = (result: ReturnType<typeof build>, key: string) =>
      [...result.mainPreference, ...result.mainNoPreference, ...result.auxiliary].find((option) => option.key === key)
        ?.action;

    it('is to sign up now while there is room', () => {
      const result = build(buildEvent([player, gm]), { signupCounts: counts({ '1': 3, '2': 0 }) });

      expect(actionFor(result, '1')).toBe('SIGN_UP_NOW');
      expect(actionFor(result, '2')).toBe('SIGN_UP_NOW');
    });

    it('is to join the waitlist once a bucket is full', () => {
      const result = build(buildEvent([player, gm]), { signupCounts: counts({ '1': 3, '2': 2 }) });

      expect(actionFor(result, '2')).toBe('WAITLIST');
      expect(actionFor(result, '1')).toBe('SIGN_UP_NOW');
    });

    it('counts only confirmed signups towards a bucket being full', () => {
      const result = build(buildEvent([player, gm]), { signupCounts: counts({ '2': 2 }, SignupState.Waitlisted) });

      expect(actionFor(result, '2')).toBe('SIGN_UP_NOW');
    });

    it('counts a limited flex bucket’s signups and capacity in with the regular ones', () => {
      const limitedFlex = buildBucket({ id: '3', key: 'flex', name: 'Flex', anything: true, total_slots: 3 });
      const roomy = build(buildEvent([player, gm, limitedFlex]), { signupCounts: counts({ '2': 2, '3': 0 }) });
      const full = build(buildEvent([player, gm, limitedFlex]), { signupCounts: counts({ '2': 2, '3': 3 }) });

      // GM has 2 of 2 but the flex bucket has room, so GM isn't full yet; with the flex bucket full too, it is
      expect(actionFor(roomy, '2')).toBe('SIGN_UP_NOW');
      expect(actionFor(full, '2')).toBe('WAITLIST');
    });

    it('is to join the waitlist for “no preference” when every limited bucket is full', () => {
      const open = build(buildEvent([player, gm]), { signupCounts: counts({ '1': 9, '2': 2 }) });
      const full = build(buildEvent([player, gm]), { signupCounts: counts({ '1': 10, '2': 2 }) });

      expect(actionFor(open, '_no_preference')).toBe('SIGN_UP_NOW');
      expect(actionFor(full, '_no_preference')).toBe('WAITLIST');
    });

    describe('for someone who has reached their maximum number of signups', () => {
      it('is to add to their ranked-choice queue, when the signup round allows that', () => {
        const result = build(buildEvent([player, gm]), { atMaximum: true, addToQueue: true });

        expect(actionFor(result, '1')).toBe('ADD_TO_QUEUE');
        expect(actionFor(result, '_no_preference')).toBe('ADD_TO_QUEUE');
      });

      it('is still to sign up when they could add to the queue but haven’t hit their maximum', () => {
        const result = build(buildEvent([player, gm]), { atMaximum: false, addToQueue: true });

        expect(actionFor(result, '1')).toBe('SIGN_UP_NOW');
      });

      it('is not to queue for a bucket that isn’t counted', () => {
        const result = build(buildEvent([player, observer]), { atMaximum: true, addToQueue: true });

        expect(actionFor(result, '1')).toBe('ADD_TO_QUEUE');
        expect(actionFor(result, '4')).toBe('SIGN_UP_NOW');
      });

      it('is to show they are already in the queue for a bucket they have asked for', () => {
        const pending = [{ priority: 1, requested_bucket: { id: '1' } }];

        const result = build(buildEvent([player, gm]), { atMaximum: true, addToQueue: true, pending });

        expect(actionFor(result, '1')).toBe('IN_QUEUE');
        expect(actionFor(result, '2')).toBe('ADD_TO_QUEUE');
        const option = result.mainPreference.find((o) => o.key === '1');
        expect(option?.pendingRankedChoices).toEqual(pending);
      });

      it('shows they are in the queue for “no preference”, with just those choices', () => {
        const noPreferenceChoice = { priority: 2, requested_bucket: null };
        const pending = [noPreferenceChoice, { priority: 1, requested_bucket: { id: '1' } }];

        const result = build(buildEvent([player, gm]), { atMaximum: true, addToQueue: true, pending });

        expect(actionFor(result, '_no_preference')).toBe('IN_QUEUE');
        expect(result.mainNoPreference[0].pendingRankedChoices).toEqual([noPreferenceChoice]);
      });
    });
  });

  describe('which options are main and which are auxiliary', () => {
    it('makes everything main when every bucket is counted and there is no “no preference”', () => {
      const result = build(buildEvent([player]));

      expect(result.auxiliary).toEqual([]);
      expect(keys(result.mainPreference)).toEqual(['1']);
    });

    it('puts an unlimited counted bucket among the auxiliary options when there are other kinds of option', () => {
      const unlimited = buildBucket({
        id: '5',
        key: 'audience',
        name: 'Audience',
        slots_limited: false,
        total_slots: null,
      });

      const result = build(buildEvent([player, gm, unlimited]));

      expect(keys(result.auxiliary)).toEqual(['5']);
    });
  });
});

describe('sortBuckets', () => {
  const ids = (buckets: RegistrationPolicyBucket[]) => buckets.map((bucket) => bucket.id);

  it('puts limited buckets before unlimited ones', () => {
    const unlimited = buildBucket({ id: 'u', name: 'Audience', slots_limited: false, total_slots: null });

    expect(ids(sortBuckets([unlimited, buildBucket({ id: 'l', name: 'Zed' })]))).toEqual(['l', 'u']);
  });

  it('puts flex ("anything") buckets last among the unlimited ones', () => {
    const audience = buildBucket({ id: 'a', name: 'Audience', slots_limited: false, total_slots: null });
    const anything = buildBucket({ id: 'f', name: 'Aaa', slots_limited: false, anything: true, total_slots: null });

    expect(ids(sortBuckets([anything, audience]))).toEqual(['a', 'f']);
  });

  it('puts buckets that aren’t counted after counted ones', () => {
    const notCounted = buildBucket({ id: 'n', name: 'Aaa', not_counted: true });

    expect(ids(sortBuckets([notCounted, buildBucket({ id: 'c', name: 'Zed' })]))).toEqual(['c', 'n']);
  });

  it('otherwise sorts by name, ignoring case', () => {
    const buckets = [
      buildBucket({ id: 'z', name: 'zebra' }),
      buildBucket({ id: 'a', name: 'Apple' }),
      buildBucket({ id: 'b', name: 'banana' }),
    ];

    expect(ids(sortBuckets(buckets))).toEqual(['a', 'b', 'z']);
  });

  it('does not change the array it was given', () => {
    const buckets = [buildBucket({ id: 'z', name: 'Zed' }), buildBucket({ id: 'a', name: 'Apple' })];

    sortBuckets(buckets);

    expect(ids(buckets)).toEqual(['z', 'a']);
  });
});
