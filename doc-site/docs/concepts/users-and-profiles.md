---
sidebar_position: 1
---

# Users and profiles

In Intercode, user accounts are shared across multiple convention sites. This is so that users don't have to remember
a separate password for each convention they attend. It also allows some useful cross-site functionality, such as
allowing users to quickly re-propose an event that they've proposed at other conventions.

However, conventions typically want to collect some specific information about attendees, and that information shouldn't
be shared with other conventions by default. Therefore, Intercode has a separate concept of the "user con profile," a
convention-specific record that contains the user's information for that particular convention.

As a result, the user account itself ends up being fairly minimal. It contains only:

- The user's name
- The user's email address
- A hashed password
- A flag for whether or not the user is a global (cross-site) administrator
- Some record-keeping information about logins, password resets, etc.

The user con profile typically contains a great deal more:

- A copy of the user's name (separately editable by the user, and used everywhere on the con site)
- The user's nickname (note: this feature might be phased out in the future)
- Records of their ticket for the convention, if applicable
- Orders from the convention's online store, if applicable
- Event signups
- Event team memberships
- Convention staff positions
- Any other information the convention has decided to collect via its profile form ([see Forms for more details on how this works](/concepts/forms))
