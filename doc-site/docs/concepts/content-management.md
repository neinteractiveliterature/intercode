---
sidebar_position: 2
---

# Content management

Intercode comes with a built-in content management system. This CMS allows convention runners to build extremely
customizable web sites for their cons, including layouts, dynamic page content, and interactive elements. It also
allows reuse of content across multiple pages as well as partial permissioning, so that staff members can be allowed
to edit certain pages related to their areas of responsibility without having to have full permissions to update
everything on the web site.

Intercode's CMS is built on [Liquid](https://shopify.github.io/liquid/), a template language created by Shopify. Liquid
has built-in features for manipulating text, rendering content conditionally, looping, and much more. Intercode extends
the Liquid language with several custom tags and filters, and exposes a great deal of its data to CMS templates so that
convention web sites can intelligently adapt their content for the user viewing them.

## Pages

A page is pretty much what it sounds like: a single page's worth of content. Each page has its own URL path, beginning
with `/pages/` (for example, a convention might have `/pages/about-us`, `/pages/info/hotel`, and
`/pages/info/transportation`).

Pages are written in Liquid markup and rendered to HTML. In CMS pages (unlike the Markdown content on events), no
HTML filtering is applied, and any valid HTML markup is allowed. CMS content can therefore include JavaScript, CSS,
fonts, embedded videos, and anything else you can express in a web page.

Here's an example of a very simple page:

```html
<h1>About us</h1>

<p>{{ convention.name }} is a community convention put on by a crew of volunteers!</p>
```

Because Intercode exposes the `convention` object, the CMS will automatically put the name of the convention in place of
the `{{ convention.name }}` Liquid snippet.

## Partials

A partial is an embeddable block of content that can be used in pages or layouts. For example, if the convention had
a partial called `copyright` with the following content:

```html title="Partial: copyright"
<p>Copyright &copy; 2021 {{ convention.name }}</p>
```

Pages on the site could include that partial like so:

```html title="Page"
<div>Some content</div>

{% include "copyright" %}
```

The copyright notice would then appear in place of the `{% include "copyright" %}` Liquid tag.

## Layouts

A layout is the content that surrounds all pages of the site. Layouts can be used to do custom site-wide styling,
include custom content on each page, modify the location of the navigation bar, and more.

There are a few special variables that are available to layouts. Layouts should always include all of them:

- `content_for_head` contains tags that load the Bootstrap CSS framework as well as Intercode's global JavaScript and
  styles. It should be placed somewhere in the `<head>` tag of the page.
- `content_for_navbar` contains the navigation bar for the site. It should be placed somewhere inside the `<body>` tag
  of the page.
- `content_for_layout` contains the actual content of the page being rendered. It should be placed somewhere inside the
  `<body>` tag as well.

A minimal example of a layout might be:

```html
<!DOCTYPE html>
<html>
  <head>
    {{ content_for_head }}
  </head>
  <body>
    <div class="container">{{ content_for_navbar }}</div>
    <div class="container py-4">{{ content_for_layout }}</div>
  </body>
</html>
```

If you wanted to make the background blue and the content area white, you might add some inline styling in the `<head>` tag and use a Bootstrap background color class in the `<body>`:

```html
<!DOCTYPE html>
<html>
  <head>
    {{ content_for_head }}
    <style type="text/css">
      body {
        background: aliceblue;
      }
    </style>
  </head>
  <body>
    <div class="container">{{ content_for_navbar }}</div>
    <div class="container py-4 bg-white">{{ content_for_layout }}</div>
  </body>
</html>
```

## Files

You can upload files to the CMS. The most common uses of this are to embed images on pages and to provide downloadable
documents, but there are many other uses for uploaded files.

Pages can include uploaded files by name using the `{% file_url %}` Liquid tag:

```html
<img src="{% file_url picture-of-nat.jpg %}" alt="A picture of Nat" />
```

Similarly, if you wanted to link to an uploaded file:

```html
<a href="{% file_url convention-poster.pdf %}">Click here to download our poster!</a>
```

## Navigation

Using the Navigation tab of the CMS, you can add custom items and dropdown menus to the site navigation bar. A
well-organized and comprehensive navigation bar is essential for making all the info about a convention available to
attendees.

Navigation bars can contain sections and links. A link is pretty much what it sounds like: a link to a CMS page. By
default, the text of the link is the title of the page, but this can be customized. A section is a dropdown menu on
the navigation bar. Sections can contain links, but not other sections (in other words, the navigation hierarchy only
goes one level deep).

## Variables

Conventions can define custom Liquid variables using the Variables tab of the CMS. A variable defined in this way is
usable by all pages, layouts, and partials in the convention. Variables are defined using JSON syntax.

For example, if a convention defines a variable called `hotel_room_block_code` with the value `"MYCON"`, a page might
include it like this:

```html
<p>When calling the hotel, mention room block code: <strong>{{ hotel_room_block_code }}</strong>.</p>
```

This can be very useful particularly for conventions that reoccur, because they can copy the CMS content and only change
the variables to update the site for the following year.

## Content groups

A content group is a set of CMS content (pages, layouts, and partials). Content groups can be separately permissioned
so that staff members can have permission to edit just a few pages relevant to their area of responsibility.

For example, if a convention has a game design contest, you might want to give the Game Design Contest Coordinator
the ability to update the contest page as well as the page containing the contest rules and prizes. You could use a
content group containing just those pages, and grant update permission on it to the Game Design Contest Coordinator
staff position. Then, anyone with that staff position would be able to edit those pages.

Anyone who can edit CMS content also gets the ability to view the source code of all CMS content on that convention's
site. This can be helpful if they want to copy Liquid markup or widgets from other pages.

## GraphQL queries

Intercode exposes much of its data via Liquid variables, but sometimes you need to access something that's not available
that way. For situations like that, Intercode allows creating custom GraphQL queries that can be run from inside CMS
content.

As a very simple example (so simple that you would never want to actually do this with a GraphQL query), here's a query
that retrieves the name of the convention:

```graphql
query getConventionName {
  convention: conventionByRequestHost {
    name
  }
}
```

You could then use it from a CMS page like this:

```html
{% assign_graphql_result convention_name_result=getConventionName() %}

<p>The name of this convention is {{ convention_name_result.convention.name }}.</p>
```
