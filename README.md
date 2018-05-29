# Intercode 2

[![Build Status](https://travis-ci.org/neinteractiveliterature/intercode.svg?branch=master)](https://travis-ci.org/neinteractiveliterature/intercode)
[![Code Climate](https://codeclimate.com/github/neinteractiveliterature/intercode/badges/gpa.svg)](https://codeclimate.com/github/neinteractiveliterature/intercode)
[![Test Coverage](https://codeclimate.com/github/neinteractiveliterature/intercode/badges/coverage.svg)](https://codeclimate.com/github/neinteractiveliterature/intercode/coverage)

Intercode is a web application that:

* serves as the public-facing web site for a larp convention
* automates signup and payment
* automates business processes for the convention staff

The original Intercode was written in PHP by Barry Tannenbaum for Intercon New England, and has since been used by several other conventions around the world.

Intercode 2 is a project to rearchitect Intercode from the ground up, making it more robust, more flexible, and more modern.

# Developer Quickstart with local Rails

This is the classic Rails development setup, and should work for Mac and Linux users.

1. Clone this repository: `git clone https://github.com/neinteractiveliterature/intercode.git`
2. Make sure you have a working C/C++ development toolchain installed.  On Mac OS X, that's Xcode and its Command Line Tools.
3. Install [rbenv](https://github.com/sstephenson/rbenv#readme)
4. Install [ruby-build](https://github.com/sstephenson/ruby-build#readme)
5. Install Ruby 2.4.2: `rbenv install 2.4.2`
6. (Optional, but if you don't, you'll have to set yourself using 2.3.1 some other way.) Make Ruby 2.3.1 your default: `rbenv global 2.4.2`
7. Install Bundler: `gem install bundler`
8. Edit your hosts file (typically found in `/etc/hosts` on Mac and Linux systems) and add the following line: `127.0.0.1 intercode.test`
9. From the Intercode source folder:
  1. Copy the basic developer database configuration: `cp config/database.yml.dev config/database.yml`
  2. Install all the dependencies of Intercode:
    1. Install MySQL and PostgreSQL. With Homebrew: `brew install mysql postgres `
    2. Make sure you have Node JS installed. `brew install node`
    3. Make sure you have Yarn installed. With Homebrew: `brew install yarn`
    4. `bundle install`
  3. Set up your local database: `bin/rake db:create db:migrate`
  4. `yarn install`
  5. Start up the Intercode server: `bin/rails server`
  6. Start up the Webpack server: `bin/webpack-dev-server`
10. You should now be able to go to http://intercode.test:3000 and see the app running!

**IMPORTANT NOTE:** Intercode 2 in development mode uses `intercode.test` as its cookie domain.  If you use `localhost` to visit the site, that will mysteriously fail.  I'm going to try to make the site detect the wrong domain and redirect you, but for now, please just use the `intercode.test` domain name.

# Contacting us

To contact the Intercode 2 project team, you can:

* [File an issue or feature request here](https://github.com/neinteractiveliterature/issues)
* [Email Nat Budin](mailto:natbudin@gmail.com).

# License

Intercode 2 is released under the terms and conditions of the MIT license.  Please see the LICENSE file for the full legalese.
