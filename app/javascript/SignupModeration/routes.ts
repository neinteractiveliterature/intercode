import { index, layout, route } from '@react-router/dev/routes';

export default layout('SignupModeration/moderatedSignupGuard.ts', [
  route('/signup_moderation', 'SignupModeration/index.tsx', [
    layout('SignupModeration/rankedChoiceGuard.ts', [
      route('ranked_choice_queue', 'SignupModeration/RankedChoiceQueue.tsx', [
        route(':userConProfileId', 'SignupModeration/UserRankedChoiceQueue.tsx'),
      ]),
    ]),
    route('signup_requests', 'SignupModeration/signup_requests/route.ts', [
      route(':id', 'SignupModeration/signup_requests/$id/route.ts', [
        route('accept', 'SignupModeration/signup_requests/$id/accept.ts'),
        route('reject', 'SignupModeration/signup_requests/$id/reject.ts'),
      ]),
    ]),
    route('signup_rounds', 'SignupModeration/signup_rounds/route.ts', [
      route(':id', 'SignupModeration/signup_rounds/$id/route.ts', [
        route('rerun', 'SignupModeration/signup_rounds/$id/rerun.ts'),
      ]),
    ]),
    route('queue', 'SignupModeration/SignupModerationQueue.tsx'),
    route('create_signups', 'SignupModeration/CreateSignup.tsx'),
    index('SignupModeration/redirectToQueue.ts'),
  ]),
]);
