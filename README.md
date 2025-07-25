# Intercode

[![Build Status](https://github.com/neinteractiveliterature/intercode/workflows/Docker%20Image%20CI/badge.svg)](https://github.com/neinteractiveliterature/intercode/actions?workflow=Docker+Image+CI)
[![Automated Code Review](https://github.com/neinteractiveliterature/intercode/workflows/Pronto/badge.svg)](https://github.com/neinteractiveliterature/intercode/actions?workflow=Pronto)

Intercode is a web application that:

- serves as the public-facing web site for a convention
- automates signup and payment
- automates business processes for the convention staff

[The original Intercode](https://github.com/neinteractiveliterature/intercode-classic) was written in PHP by Barry Tannenbaum for Intercon New England, and has since been used by several other conventions around the world.

Intercode 2 was a ground-up rewrite of Intercode, making it more robust, more flexible, and more modern.  Starting at version 3.0.0, we've used [semantic versioning](https://semver.org/) for our releases.

# Overall Architecture

- **Backend**: Ruby on Rails application exposing a GraphQL API and an OpenID Connect-enabled OAuth2 server
- **Frontend**: React and Apollo-based single-page JavaScript app
- **Database engine**: PostgreSQL
- **Background queue system**: Amazon SQS + Shoryuken (this might change in the future)
- **Production infrastructure**: For [New England Interactive Literature](http://interactiveliterature.org)'s installation of Intercode, we're hosting it on [Fly](https://fly.io).

# Getting Started with Developing Intercode

- Intercode in development mode uses `intercode.test` as its cookie domain. If you use `localhost` to visit the site, that will mysteriously fail. I'm going to try to make the site detect the wrong domain and redirect you, but for now, please just use the `intercode.test` domain name.
- We used to support a Docker Compose-based development workflow, but this has been deprecated. Please run Rails locally using the instructions below.

## Developer Setup with local Rails

This is the classic Rails development setup, and should work for Mac and Linux users.

1. Clone this repository: `git clone https://github.com/neinteractiveliterature/intercode.git`
2. Make sure you have a working C/C++ development toolchain installed. On macOS, that's Xcode and its Command Line Tools.
3. Install [rbenv](https://github.com/sstephenson/rbenv#readme)
4. Install [ruby-build](https://github.com/sstephenson/ruby-build#readme)
5. Edit your hosts file (typically found in `/etc/hosts` on Mac and Linux systems) and add the following line: `127.0.0.1 intercode.test`
6. `cd` to the Intercode source folder, all the remaining steps should be performed in that folder.
7. Copy `.env.development.local.sample` to `.env.development.local` and follow the instructions in
   that file to set up keys for various external services. You'll almost certainly need to set up
   reCAPTCHA; the others are probably best left until you really need to.
8. Install all the dependencies of Intercode:

   1. Install the Ruby version Intercode requires: `rbenv install`
   2. Install Bundler: `gem install bundler`
   3. Install PostgreSQL. With Homebrew: `brew install postgres`
   4. Make sure you have Node.js installed. With Homebrew: `brew install node`
   5. Make sure you have Yarn installed. With Homebrew: `brew install yarn`
   6. `bundle install`

9. Generate self-signed certificates to support HTTPS

   1. `gem install toys`
   2. `toys setup_tls`

10. Set up your local database: `bin/rails db:create db:migrate`
11. Install JavaScript packages: `yarn install`
12. Start up the Intercode server: `bin/rails server`
13. Start up the Webpack server: `yarn run start`
14. You should now be able to go to <https://intercode.test:5050> and see the app running!
15. Click the user icon in the upper right of the navigation bar and choose "Sign up" to sign up for
    an account in your local copy of Intercode.
16. To make yourself a superadmin in your local copy, run `./bin/rails console`. At the Rails
    console prompt, type `User.first.update!(site_admin: true)`. This will set the `site_admin`
    flag on your account in the database, giving you superadmin powers.

## Testing production builds

If you want to test how the app runs in production, but using your local development installation, you can do so as follows:

1. Build Docker images for Intercode: `docker build --target production -t local-intercode-production .`
2. Install the `dev-proxy` npm package: `npm install -g dev-proxy`
3. Run `dev-proxy` to start proxying HTTPS locally: `dev-proxy -p 5051:5050`
4. Run something like the following command, changing the asset host as necessary for your setup: `docker run -it -p 5051:3000 -e DATABASE_URL=postgresql://postgres@docker.for.mac.localhost/intercode_development -e RAILS_LOG_TO_STDOUT=true -e ASSETS_HOST=//intercont.intercode.test:5050 -e RAILS_SERVE_STATIC_FILES=true local-intercode-production bin/rails`
5. Visit <https://some-convention-domain.intercode.test:5050>, probably using Firefox (it seems to deal better than Chrome with self-signed certificates these days).

# Contacting us

To contact the Intercode project team, you can:

- [File an issue or feature request here](https://github.com/neinteractiveliterature/intercode/issues)
- [Email Nat Budin](mailto:natbudin@gmail.com).

# Code of Conduct

Participants in the Intercode project are expected to follow the Contributor Covenant. For details, [see CODE_OF_CONDUCT.md](https://github.com/neinteractiveliterature/intercode/blob/main/CODE_OF_CONDUCT.md).

# License

Intercode is released under the terms and conditions of the MIT license. Please see the LICENSE file for the full legalese.
