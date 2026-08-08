import getI18n from '../../../../app/javascript/setupI18Next';
import {
  findBucket,
  formatBucket,
  formatSignupState,
  formatSignupStatus,
  EventForFormatBucket,
  SignupForFormatBucket,
} from '../../../../app/javascript/EventsApp/SignupAdmin/SignupUtils';
import { SignupState } from '../../../../app/javascript/graphqlTypes.generated';
import { TFunction } from 'i18next';

describe('SignupUtils', () => {
  let t: TFunction;

  beforeAll(async () => {
    t = (await getI18n()).getFixedT('en');
  });

  const playerBucket = { id: '1', name: 'Player' };
  const gmBucket = { id: '2', name: 'GM' };

  const registrationPolicy = { buckets: [playerBucket, gmBucket] };

  const defaultEvent: EventForFormatBucket = {
    event_category: { team_member_name: 'GM' },
    registration_policy: registrationPolicy,
    team_members: [],
  };

  const defaultSignup: SignupForFormatBucket = {
    counted: true,
    state: SignupState.Confirmed,
    bucket: null,
    requested_bucket: null,
    user_con_profile: { id: 'u1' },
  };

  describe('findBucket', () => {
    it('finds a bucket by id', () => {
      expect(findBucket('1', registrationPolicy)).toEqual(playerBucket);
      expect(findBucket('2', registrationPolicy)).toEqual(gmBucket);
    });

    it('does not match a bucket with a different id, even if other buckets could be confused by name', () => {
      // Two buckets can legitimately share a display name once matching is purely id-based (see
      // #11892) -- this must never accidentally match the wrong one.
      const buckets = [
        { id: '1', name: 'Custom 1' },
        { id: '2', name: 'Custom 1' },
      ];
      expect(findBucket('1', { buckets })).toBe(buckets[0]);
      expect(findBucket('2', { buckets })).toBe(buckets[1]);
    });

    it('returns undefined for an id with no match', () => {
      expect(findBucket('nonexistent', registrationPolicy)).toBeUndefined();
    });

    it('returns undefined for a null or undefined id', () => {
      expect(findBucket(null, registrationPolicy)).toBeUndefined();
      expect(findBucket(undefined, registrationPolicy)).toBeUndefined();
    });
  });

  describe('formatBucket', () => {
    it('shows withdrawn for a withdrawn signup, regardless of bucket', () => {
      const signup = { ...defaultSignup, state: SignupState.Withdrawn, bucket: playerBucket };
      expect(formatBucket(signup, defaultEvent, t)).toEqual('Withdrawn');
    });

    describe('when not counted', () => {
      it('shows the bucket name with a not-counted suffix, when in a bucket', () => {
        const signup = { ...defaultSignup, counted: false, bucket: { id: '1' } };
        expect(formatBucket(signup, defaultEvent, t)).toEqual('Player (not counted)');
      });

      it('shows a team-member label for a not-counted team member with no bucket', () => {
        const signup = { ...defaultSignup, counted: false, bucket: null, user_con_profile: { id: 'gm1' } };
        const event: EventForFormatBucket = {
          ...defaultEvent,
          team_members: [{ user_con_profile: { id: 'gm1' } }],
        };
        expect(formatBucket(signup, event, t)).toEqual('Gm (not counted)');
      });

      it('shows the requested bucket for a not-counted waitlisted signup, when one is found by id', () => {
        const signup = {
          ...defaultSignup,
          counted: false,
          state: SignupState.Waitlisted,
          bucket: null,
          requested_bucket: { id: '2' },
        };
        expect(formatBucket(signup, defaultEvent, t)).toEqual('Waitlisted (requested GM)');
      });

      it('shows no-preference for a not-counted waitlisted signup with an unresolvable requested bucket', () => {
        const signup = {
          ...defaultSignup,
          counted: false,
          state: SignupState.Waitlisted,
          bucket: null,
          requested_bucket: { id: 'removed-bucket' },
        };
        expect(formatBucket(signup, defaultEvent, t)).toEqual('Waitlisted (no preference)');
      });

      it('falls back to a plain not-counted label otherwise', () => {
        const signup = { ...defaultSignup, counted: false, state: SignupState.Confirmed, bucket: null };
        expect(formatBucket(signup, defaultEvent, t)).toEqual('Not counted');
      });
    });

    describe('when counted', () => {
      it('shows just the bucket name when the current and requested buckets match by id', () => {
        const signup = { ...defaultSignup, bucket: { id: '1' }, requested_bucket: { id: '1' } };
        expect(formatBucket(signup, defaultEvent, t)).toEqual('Player');
      });

      it('shows both bucket and requested bucket when they resolve to different buckets', () => {
        const signup = { ...defaultSignup, bucket: { id: '1' }, requested_bucket: { id: '2' } };
        expect(formatBucket(signup, defaultEvent, t)).toEqual('Player (requested GM)');
      });

      it('shows the requested bucket alone, with a placeholder bucket name, when there is no current bucket', () => {
        const signup = { ...defaultSignup, bucket: null, requested_bucket: { id: '2' } };
        expect(formatBucket(signup, defaultEvent, t)).toEqual('None (requested GM)');
      });

      it('shows the bucket with a no-preference suffix when there is no requested bucket', () => {
        const signup = { ...defaultSignup, bucket: { id: '1' }, requested_bucket: null };
        expect(formatBucket(signup, defaultEvent, t)).toEqual('Player (no preference)');
      });

      it('shows a placeholder when neither bucket resolves', () => {
        const signup = { ...defaultSignup, bucket: null, requested_bucket: null };
        expect(formatBucket(signup, defaultEvent, t)).toEqual('None');
      });
    });
  });

  describe('formatSignupState', () => {
    it('formats each known state', () => {
      expect(formatSignupState(SignupState.Confirmed, t)).toEqual('Confirmed');
      expect(formatSignupState(SignupState.Waitlisted, t)).toEqual('Waitlisted');
      expect(formatSignupState(SignupState.Withdrawn, t)).toEqual('Withdrawn');
      expect(formatSignupState(SignupState.TicketPurchaseHold, t)).toEqual('Held pending {{ ticketName }} purchase');
    });

    it('formats a null or undefined state as not signed up', () => {
      expect(formatSignupState(null, t)).toEqual('Not signed up');
      expect(formatSignupState(undefined, t)).toEqual('Not signed up');
    });
  });

  describe('formatSignupStatus', () => {
    it('delegates to formatBucket for a confirmed signup', () => {
      const signup = { ...defaultSignup, state: SignupState.Confirmed, bucket: { id: '1' } };
      expect(formatSignupStatus(signup, defaultEvent, t)).toEqual('Player (no preference)');
    });

    it('shows the state with a requested bucket, for a non-confirmed signup with one resolvable by id', () => {
      const signup = { ...defaultSignup, state: SignupState.Waitlisted, requested_bucket: { id: '2' } };
      expect(formatSignupStatus(signup, defaultEvent, t)).toEqual('Waitlisted (requested GM)');
    });

    it('shows just the state when the requested bucket cannot be resolved', () => {
      const signup = { ...defaultSignup, state: SignupState.Waitlisted, requested_bucket: { id: 'removed-bucket' } };
      expect(formatSignupStatus(signup, defaultEvent, t)).toEqual('Waitlisted');
    });
  });
});
