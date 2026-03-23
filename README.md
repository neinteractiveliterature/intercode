# Intercode

[![Build Status](https://github.com/neinteractiveliterature/intercode/workflows/Docker%20Image%20CI/badge.svg)](https://github.com/neinteractiveliterature/intercode/actions?workflow=Docker+Image+CI)
[![Automated Code Review](https://github.com/neinteractiveliterature/intercode/workflows/Pronto/badge.svg)](https://github.com/neinteractiveliterature/intercode/actions?workflow=Pronto)

Intercode is a web application that:

- serves as the public-facing web site for a convention
- automates signup and payment
- automates business processes for the convention staff

[The original Intercode](https://github.com/neinteractiveliterature/intercode-classic) was written in PHP by Barry Tannenbaum for Intercon New England, and has since been used by several other conventions around the world.

Intercode 2 was a ground-up rewrite of Intercode, making it more robust, more flexible, and more modern. Starting at version 3.0.0, we've used [semantic versioning](https://semver.org/) for our releases.

## Overall Architecture

- **Backend**: Ruby on Rails application exposing a GraphQL API and an OpenID Connect-enabled OAuth2 server
- **Frontend**: React and Apollo-based single-page JavaScript app
- **Database engine**: PostgreSQL
- **Background queue system**: Amazon SQS + Shoryuken (this might change in the future)
- **Production infrastructure**: For [New England Interactive Literature](http://interactiveliterature.org)'s installation of Intercode, we're hosting it on [Fly](https://fly.io).

## Getting Started with Developing Intercode

- Intercode in development mode uses `intercode.test` as its cookie domain. If you use `localhost` to visit the site, that will mysteriously fail. I'm going to try to make the site detect the wrong domain and redirect you, but for now, please just use the `intercode.test` domain name.
- We used to support a Docker Compose-based development workflow, but this has been deprecated. Please run Rails locally using the instructions below.

### Developer Setup with local Rails

This is the classic Rails development setup, and should work for Mac and Linux users. Windows users should use WSL.

#### Dev tooling setup using mise

In this tutorial, we're going to set up [mise-en-place](https://mise.jdx.dev) to manage the versions of Ruby and Node.js used to run Intercode. This will be a globally-installed tool on your system, so if you don't want to do it this way, know that there are other options such as [rbenv](https://github.com/sstephenson/rbenv#readme).

First, run this command to install mise globally:

```sh
curl https://mise.run | sh
```

This will download mise and then give you a command to run to activate mise in your shell. Run that command as well, then run:

```sh
mise doctor
```

Hopefully, this will run with no issues. If it does find problems, follow its instructions to correct them.

Now we need to set some settings in mise so that it will correctly pick up the tool versions Intercode uses. Run these commands:

```sh
mise settings add idiomatic_version_file_enable_tools ruby
mise settings add idiomatic_version_file_enable_tools node
mise settings ruby.compile=false
```

(The last one isn't strictly necessary but it should save a lot of time on the installation.)

#### Setting up other dependencies

On Linux and WSL, you'll need to have a few packages installed before setting up Intercode. For Debian and Ubuntu, this command should do it:

```sh
sudo apt install build-essential git postgresql libmariadb-dev libvips zlib1g-dev libffi-dev libssl-dev libyaml-dev
```

On macOS, you should have [Homebrew](https://brew.sh/) installed. Homebrew will also guide you through installing the Xcode command line tools. Once that's done, run this:

```sh
brew install mysql-client postgresql
```

In order to connect to your local PostgreSQL instance and set up Intercode, you'll need to have a user with enough permissions to log in and create databases. First, run this:

```sh
sudo -u postgres psql postgres
```

This should bring you into a Postgres command prompt. You'll need to run a few commands that include your local username on your Linux or macOS machine:

```sql
CREATE ROLE [your username];
ALTER USER [your username] login;
ALTER USER [your username] createdb;
```

Now exit the Postgres command prompt using Ctrl-D, and run:

```sh
psql postgres
```

This should let you into Postgres, this time as your local user account.

#### Setting up Intercode

First, clone this repository:

```sh
git clone https://github.com/neinteractiveliterature/intercode.git
```

cd into the checked-out repository and have mise install Ruby and Node automatically:

```sh
cd intercode
mise install
```

Intercode ships with a sample settings file that has credentials for external services the app uses. We'll need to make a copy of it so that we can set up those credentials as needed. For now, we'll leave all the actual credentials blank:

```sh
cp .env.development.local.sample .env.development.local
```

Now let's install the Ruby and Node.js dependencies of the app:

```sh
bundle install
corepack enable
yarn install
```

#### Setting up the database

In theory, it should be possible to set up your local database using this command:

```sh
bin/rails db:create db:migrate db:seed
```

There are a few things that can go wrong here. Let's go through some common types of errors and how you can fix them:

<details>

<summary>`PG::ConnectionBad: connection to server at "::1", port 5432 failed: fe_sendauth: no password supplied (PG::ConnectionBad)`</summary>

If you're seeing something like this, you probably need to force Rails to connect to the database server using a UNIX socket as opposed to trying to connect via localhost TCP port 5432. To do this, we'll need to change the `DATABASE_URL` environment variables. Start by copying these lines from `.env.development` into `.env.development.local`:

```text
DEVELOPMENT_DATABASE_URL=postgresql://localhost/intercode_development
TEST_DATABASE_URL=postgresql://localhost/intercode_test
```

Then, add the path to the UNIX socket as a `?host=` parameter at the end of both URLs. On Debian, the path to the socket is `/var/run/postgresql`, so these lines would become:

```text
DEVELOPMENT_DATABASE_URL=postgresql://localhost/intercode_development?host=/var/run/postgresql
TEST_DATABASE_URL=postgresql://localhost/intercode_test?host=/var/run/postgresql
```

</details>

<details>

<summary>`psql:/home/debian/intercode/db/structure.sql:4: ERROR:  unrecognized configuration parameter "transaction_timeout"`</summary>

If you're seeing something like this, you're probably running an older version of PostgreSQL than the one Intercode supports. We tend to track new PostgreSQL releases pretty closely, so you probably
need the latest version available.

</details>

#### Setting up weird web serving nonsense

Intercode uses a somewhat unfortunate custom setup for local HTTP. Because some features require HTTPS, we generate a self-signed CA and certificate. In addition, Intercode expects to have different domain names for each convention it hosts, so we set up \*.intercode.test as a private fake DNS namespace for the local copy of Intercode to use.

First, let's generate the self-signed certificates:

```sh
gem install toys
toys setup_tls
```

On macOS, the above command will prompt for your password and install the CA in your local keychain. On other OSes, you'll have to do this step manually from your browser (later in the process).

Now, let's set up the private DNS namespace. The setup for this differs somewhat between different operating systems:

<details>
<summary>macOS</summary>

On macOS, create a file called `/etc/resolver/intercode.test` with the following contents:

```text
domain intercode.test
nameserver 127.0.0.1
```

To test that this is working, try running `ping randomname.intercode.test`. It should start pinging your local machine on 127.0.0.1.

</details>

<details>

<summary>Linux</summary>

On Linux, there's no built-in way to do wildcard domain resolution like there is with macOS's resolver. But, we can use dnsmasq as a DNS resolver proxy and configure it to resolve \*.intercode.test to 127.0.0.1. First, install dnsmasq:

```sh
sudo apt install dnsmasq
```

Then create a file called `/etc/dnsmasq.d/dnsmasq-intercode.conf` with the following contents:

```text
address=/intercode.test/127.0.0.1
```

Now we need to get dnsmasq to play nice with systemd, which at least in Debian's setup, it won't do by default. First, edit `/etc/dnsmasq.conf` and add these lines:

```text
listen-address=127.0.0.2
bind-interfaces
```

This will make dnsmasq listen on 127.0.0.2, which won't conflict with systemd-resolved. We also need to get it to stop trying to listen on 127.0.0.1. To do that, edit `/etc/default/dnsmasq` and find the commented-out line that says `DNSMASQ_EXCEPT="lo"`. Uncomment it:

```text
DNSMASQ_EXCEPT="lo"
```

Now restart dnsmasq:

```sh
sudo systemctl restart dnsmasq
```

Once that's done, edit `/etc/systemd/resolved.conf` and find the commented-out line that begins with `DNS=`. Change it to say:

```text
DNS=127.0.0.2
```

Now restart systemd-resolved:

```sh
sudo systemctl restart systemd-resolved.service
```

To test that this is working, try running `ping randomname.intercode.test`. It should start pinging your local machine on 127.0.0.1.

</details>

<details>
<summary>Windows</summary>

On Windows, there's no built-in way to do wildcard domain resolution like there is with macOS's resolver. But, we can use a DNS resolver proxy such as [Acrylic](https://mayakron.altervista.org/support/acrylic/Home.htm) and configure it to resolve \*.intercode.test to 127.0.0.1.

I have not personally tried this, but if someone does and would like to contribute instructions to this README, I would be forever grateful!

<3, Nat

</details>

#### Starting Intercode for the first time

You'll need two terminals (or two terminal tabs) for this. In the first, start up the Rails backend server:

```sh
bin/rails server
```

In the second, start up the Vite frontend server:

```sh
yarn run start
```

You should now be able to go to <https://intercode.test:5050> and see the app running!

Now let's make you a local administrator. Click the user icon in the upper right of the navigation bar and choose "Sign up" to sign up for an account in your local copy of Intercode.

To make yourself a superadmin in your local copy, open a third terminal and run:

```sh
bin/rails console
```

At the Rails console prompt, type:

```ruby
User.first.update!(site_admin: true)
```

This will set the `site_admin` flag on your account in the database, giving you superadmin powers.

## Testing production builds

If you want to test how the app runs in production, but using your local development installation, you can do so as follows:

1. Build Docker images for Intercode: `docker build --target production -t local-intercode-production .`
2. Install the `dev-proxy` npm package: `npm install -g dev-proxy`
3. Run `dev-proxy` to start proxying HTTPS locally: `dev-proxy -p 5051:5050`
4. Run something like the following command, changing the asset host as necessary for your setup: `docker run -it -p 5051:3000 -e DATABASE_URL=postgresql://postgres@docker.for.mac.localhost/intercode_development -e RAILS_LOG_TO_STDOUT=true -e ASSETS_HOST=//intercont.intercode.test:5050 -e RAILS_SERVE_STATIC_FILES=true local-intercode-production bin/rails`
5. Visit <https://some-convention-domain.intercode.test:5050>, probably using Firefox (it seems to deal better than Chrome with self-signed certificates these days).

## Contacting us

To contact the Intercode project team, you can:

- [File an issue or feature request here](https://github.com/neinteractiveliterature/intercode/issues)
- [Email Nat Budin](mailto:natbudin@gmail.com).

## Code of Conduct

Participants in the Intercode project are expected to follow the Contributor Covenant. For details, [see CODE_OF_CONDUCT.md](https://github.com/neinteractiveliterature/intercode/blob/main/CODE_OF_CONDUCT.md).

## License

Intercode is released under the terms and conditions of the MIT license. Please see the LICENSE file for the full legalese.
