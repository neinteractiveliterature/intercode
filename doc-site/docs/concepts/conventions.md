---
sidebar_position: 0
---

# Conventions

Intercode was first designed to manage web sites for conventions. In Intercode 1, a separate
instance of the Intercode application would be set up for each convention.

Intercode 2 is a multi-tenant application, designed to host multiple sites from a single application
instance. Because different conventions have vastly different needs, most of Intercode 2's
configurability and customization options are attached to conventions in the database. A convention
in Intercode includes:

- a unique domain name or subdomain
- [CMS content such as pages, layouts, and partials](/docs/concepts/content-management)
- [events, runs, and event proposals](/docs/concepts/events-and-runs)
- [staff positions](/docs/concepts/permissions)
- [user convention profiles](/docs/concepts/users-and-profiles)
- [tickets and products](/docs/concepts/store)
- ...and a lot more stuff

## Convention modes

There are a few overall configuration settings on conventions that affect the behavior
of their web site. These are **site mode**, **signup mode**, **ticket mode**, **email mode**, and
**time zone mode**.

### Site modes

There are currently three site modes: convention mode, single-event mode, and event series mode.
Convention mode is the original behavior of Intercode, and provides the fullest set of
functionality, including events that can run multiple times throughout the con, a schedule grid,
ticket sales, and more.

Single-event mode is intended for simpler sites that represent just a single event (the fact that
Intercode thinks of these, confusingly, as "conventions" is an unfortunate historical artifact).
This mode disables most of the user interface around events and scheduling, and enforces a single
event with a single run. Currently, ticket sales are not available in single-event mode (so
single-event "conventions" must be free for attendees), but there are plans to enable them through
future UX design work and development.

Event series mode is intended for sites that represent a set of connected events run under the same
umbrella, but taking place on different, non-consecutive dates and possibly in separate locations.
Event series mode operates similarly to convention mode, but disables some parts of the user
interface that are cumbersome or unworkable under these conditions, such as the grid view of the
schedule. Event series sites, like single-event sites, cannot yet sell tickets, but this is also
planned.

### Signup modes

There are currently two signup modes: self-service and moderated. Almost all conventions using
Intercode use self-service signups, but some, such as [Be-Con](https://beconlarp.com), use moderated
signups.

Self-service signups allow attendees to sign up for events via the web site. When signups are
available, users can go to event pages on the site and click to sign up. If a spot is available,
the user will be instantly confirmed as an attendee. If not, they will be placed on the waitlist.
For more details about this process, see [the signups section](/docs/concepts/signups). In
self-service signup mode, convention staff cannot directly manipulate the signups on events
(although if absolutely necessary, they can use the "become user" feature to do so).

Moderated signups present a similar experience to attendees, but rather than clicking to sign up
for an event, users can click to _request_ to sign up for an event. This request goes into a queue
visible to convention staff, from which they can accept or reject requests. Accepting a request
will sign the user up for the event, waitlisting them if necessary, just as in self-service signups.
Moderated signups also provide a direct user interface for con staff to sign users up for events
without them having to submit a request. (This is useful for cases such as Be-Con's, where the
initial round of requests goes through a separate online survey that collects ranked choices.)

### Ticket modes

There are currently two ticket modes: tickets disabled and tickets required for signup.

If tickets are disabled, attending the convention is free. Anyone can sign up for events at the
convention just by logging in with their Intercode account, and doing so will effectively sign them
up for the convention.

If tickets are required for signup, attendees must purchase (or receive) a ticket before they are
allowed to sign up for events. A single ticket covers all event signups for that attendee; there
is no additional charge for further event registrations.

In the future, there are potential plans to build more ticket modes, such as one that would allow
conventions to sell per-event tickets.

### Email modes

There are currently two email modes: forwarding and catch-all. These modes only have an effect if
the convention has set up their domain to have Intercode process its incoming emails.

In forwarding mode, staff positions can have email aliases and forwarding addresses. These aliases
will automatically forward received email to everyone with that staff position, plus (optionally)
a CC list of additional addresses.

In catch-all mode, all received emails will be forwarded to a catch-all address. This is primarily
intended for conventions that are already over and for which their staff no longer wants to receive
email.

### Time zone mode

There are currently two time zone modes: convention time zone and user-local time zone.

In convention time zone mode, the convention chooses a time zone in which it takes place. All
dates and times of events on the web site are expressed in that zone. This is primarily intended
for conventions taking place at a specific location.

In user-local time zone mode, the web site will automatically detect the time zone the user's
computer or device is set to and express all times and dates in that zone. This is primarily
intended for virtual conventions.
