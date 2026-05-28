export type ScopeDescription = {
  scope: string;
  description: string;
};

const SCOPE_DESCRIPTIONS: ScopeDescription[] = [
  { scope: 'public', description: 'Access your public data, and public data about conventions you are signed up for' },
  { scope: 'openid', description: 'OpenID Connect identity token' },
  { scope: 'email', description: 'Access your email address' },
  { scope: 'profile', description: 'Access your personal profile data' },
  { scope: 'read_profile', description: 'Access your personal profile data' },
  { scope: 'read_signups', description: 'Access data about your signups' },
  { scope: 'read_events', description: 'Access data about the events and event proposals you manage' },
  {
    scope: 'read_conventions',
    description: 'Access privileged data about the conventions you manage (e.g. user profiles)',
  },
  { scope: 'read_organizations', description: 'Access privileged data about organizations on the site' },
  { scope: 'read_email_routing', description: 'Access email routing configuration' },
  { scope: 'manage_profile', description: 'Update your personal profile data' },
  { scope: 'manage_signups', description: 'Sign you up and withdraw you from events' },
  { scope: 'manage_events', description: 'Update events and event proposals you manage' },
  { scope: 'manage_conventions', description: 'Update conventions you manage' },
  { scope: 'manage_organizations', description: 'Update privileged data about organizations on the site' },
  { scope: 'manage_email_routing', description: 'Manage email routing configuration' },
  { scope: 'manage_intercode', description: 'Full site administration access' },
];

export default SCOPE_DESCRIPTIONS;
