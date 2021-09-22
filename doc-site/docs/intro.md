---
sidebar_position: 1
---

# Welcome to Intercode

Intercode is a web application for conventions, which:

- serves as the public-facing web site for a convention
- automates signup and payment
- automates business processes for the convention staff

The original Intercode was written in PHP by Barry Tannenbaum for Intercon New England, and has since been used by several other conventions around the world.

Intercode 2 is a ground-up rewrite of Intercode, making it more robust, more flexible, and more modern.

## Using Intercode via NEIL Hosting

New England Interactive Literature, the non-profit organization that maintains Intercode, runs a hosting service for conventions called [NEIL Hosting](https://www.neilhosting.net). NEIL Hosting aims to provide larp conventions with free or affordable hosting in support of NEIL's mission to promote larp in New England and beyond.

For pricing and other details, please see NEIL Hosting's [host with us page](https://www.neilhosting.net/pages/host-with-us).

## Self-hosting Intercode

Intercode is open source and can be self-hosted. To do this, we strongly recommend using a setup similar to the one NEIL Hosting uses, since that's the setup we test with ourselves and therefore the best-supported one. Specifically, NEIL Hosting uses:

- [Heroku](https://heroku.com) for backend servers
- [PostgreSQL](https://postgresql.org) for a database (we use AWS RDS for this, but Heroku's PostgreSQL product will also work)
- [Amazon S3](https://aws.amazon.com/s3/) for file hosting
- [Amazon Simple Email Service](https://aws.amazon.com/ses/) for sending and receiving email
- [Amazon Simple Queue Service](https://aws.amazon.com/sqs/) for background job queues

To try out running Intercode, you can clone [the source code from Github](https://github.com/neinteractiveliterature/intercode).
