---
sidebar_position: 3
---

# Events and runs

In Intercode, an event is a description of a session that takes place at a convention. All events
have:

- a title
- a short description
- a long description
- an [event category](#event-categories)
- a length
- a set of team members
- a [registration policy](/docs/concepts/signups#registration-policies)

Events can have multiple runs over the course of the convention. Therefore, an event doesn't have
a start time. Instead, it has a set of runs, each of which has:

- a start time
- a set of signups
- a set of rooms
- (optionally) a title suffix and/or a schedule note

It's possible for an event to have only a single run (indeed, this is probably the most common
case), or no runs (for example, if the con staff hasn't decided on the schedule yet).

## Event categories

Conventions can have multiple categories of event. For example, Intercon has larps, moderated
discussions, workshops, parties, etc. An event category in Intercode has:

- a name
- a color
- variants of that color for users who are signed up, or if an event is full
- a [form](/docs/concepts/forms) containing all the properties of events in this category
- (optionally) a form for [event proposals](#event-proposals) in this category
  (if not present, users can't propose events in this category)
- (optionally) a name to use for team members, such as "GM" or "moderator"

## Event proposals

Intercode can accept proposals for events. Con staff can create a proposal form for events in one or
more categories. If attendees fill out that form, the proposal goes into an inbox where staff
members can review, accept, or reject it.

When a proposal is accepted, Intercode automatically creates an event for it and copies over all the
information from the proposal form that has a matching field in the event form for that category.
It also links together the proposal with the event, and makes the proposer a team member in the
newly-created event.

## Single-event mode

Conventions can be set up in "single-event" mode. This is useful for simpler web sites,
where there's a single, standalone event scheduled at a particular time and place, but that event
would like its own web site.

In this case, all the objects mentioned above actually still exist: there's a convention, it has
one event in it, and that event has one run. There's one event category in the convention, and
the single event is in it. In single-event mode, Intercode hides most of the details of runs,
events, and event categories from the admin user interface, but behind the scenes, they're still
present.
