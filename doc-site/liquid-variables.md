---
id: liquid-variables
slug: /liquid/variables
title: Available variables
sidebar_label: Available variables
sidebar_position: 2
---

Intercode makes a set of variables available globally for use in templates. These contain a great deal of additional
accessible data. Here's a list of variables that may be available in templates. For those that are only present under
certain conditions, we've documented those conditions.

## Built-in variables

### `content_for_head` (`String`)

#### Present only in layouts.

The HTML content that must be in the `<head>` of the document in order for Intercode to work correctly.

```html title="The <head> tag in a layout"
<head>
  {{ content_for_head }}
</head>
```

### `content_for_layout` (`String`)

#### Present only in layouts.

The HTML content to render the main content of the page. Can be placed anywhere within the `<body>` of the document.

```html title="The main body container in a layout"
<body>
  ...
  <div class="container">{{ content_for_layout }}</div>
</body>
```

### `content_for_navbar` (`String`)

#### Present only in layouts.

The HTML content to render the navigation bar. Can be placed anywhere within the `<body>` of the document.

```html title="The body in a layout, showing the placement of the navbar"
<body>
  {{ content_for_navbar }} ...
</body>
```

### `convention` (<code><a href="/docs/liquid/drops/convention-drop">ConventionDrop</a></code>)

#### Present only within a convention site.

The convention this template is part of.

```liquid title="Using the convention name in site content"
Hello and welcome to {{ convention.name }}!
```

### `conventions` (<code>Array&lt;<a href="/docs/liquid/drops/convention-drop">ConventionDrop</a>&gt;</code>)

An array of all conventions in this instance of Intercode.

### `event` (<code><a href="/docs/liquid/drops/event-drop">EventDrop</a></code>)

#### Present only within an event page in a convention site.

If rendering an event page, the event that this URL points to.

Since events can't use full-fledged Liquid templates (only Markdown with a few Liquid-based extensions), you may wonder
why this could possibly be useful. This variable is still available to the _layout template_ for that event page. This
can be useful for things like rendering meta tags so that links to events will show up properly in social media. In prior
versions of Intercode, admins would have to include a snippet of code that rendered OpenGraph tags properly so
that Facebook, Twitter, etc. could link to the name of the event. This is no longer the case; these tags are automatically
generated as part of `content_for_head`.

So I guess what I'm trying to say here is, this might not possibly be useful anymore 🙃

### `page` (<code><a href="/docs/liquid/drops/page-drop">PageDrop</a></code>)

#### Present only if the template is a CMS page, or a layout or partial used by that page.

The current CMS page being rendered.

### `organizations` (<code>Array&lt;<a href="/docs/liquid/drops/organization-drop">OrganizationDrop</a>&gt;</code>)

An array of all organizations in this instance of Intercode.

### `user` (<code><a href="/docs/liquid/drops/user-drop">UserDrop</a></code>)

The user currently viewing this template. If no user is logged in, this value will be null.

```liquid title="Greeting the user"
{% if user %}
  Welcome, {{ user.name }}!
{% else %}
  Please log in to be greeted!
{% endif %}
```

### `user_con_profile` (<code><a href="/docs/liquid/drops/user-con-profile-drop">UserConProfileDrop</a></code>)

#### Present only within a convention site.

The convention profile, within this convention site, of the user currently viewing this template. If no user is logged
in, this value will be null.

```liquid title="Showing the user's bio"
{% if user_con_profile %}
  Your bio: {{ user.bio }}
{% else %}
  You have to be logged in to have a bio
{% endif %}
```

## CMS variables

In addition to these built-in variables, admins can set additional convention-specific variables. These are made
available to all templates within that convention. For example, you might set a CMS variable called `background_color`
with the value `#ff00ff` (if you hated your users).

You could then use it like this:

```html title="Horrible magenta background layout"
<!DOCTYPE html>
<html>
  <head>
    {{ content_for_head }}
    <style type="text/css">
      body {
        background-color: {{ background_color }};
      }
    </style>
  </head>
  <body>
    {{ content_for_navbar }}
    <div class="container">{{ content_for_layout }}</div>
  </body>
</html>
```
