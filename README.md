# Intercode 2

[ ![Codeship Status for neinteractiveliterature/intercode](https://codeship.com/projects/6a8bde80-69df-0133-bfd5-6e257542035e/status?branch=master)](https://codeship.com/projects/114682)

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
5. Install Ruby 2.2.3: `rbenv install 2.2.3`
6. (Optional, but if you don't, you'll have to set yourself using 2.2.3 some other way.) Make Ruby 2.2.3 your default: `rbenv global 2.2.3`
7. Install Bundler: `gem install bundler`
8. Edit your hosts file (typically found in `/etc/hosts` on Mac and Linux systems) and add the following line: `127.0.0.1 intercode`
8. From the Intercode source folder:
  1. Copy the basic developer database configuration: `cp config/database.yml.dev config/database.yml`
  2. Install all the dependencies of Intercode: 
    1. Install MySQL and PostgreSQL. With Homebrew: `brew install mysql postgres `
    2. `bundle install`
  3. Set up your local database: `bin/rake db:create db:migrate`
  4. Start up the Intercode server: `bin/rails server`
9. You should now be able to go to http://intercode:3000 and see the app running!

# Contacting us

To contact the Intercode 2 project team, you can:

* [File an issue or feature request on our Jira tracker](https://intercode2.atlassian.net)
* [Email the project mailing list](mailto:intercode2@lists.interactiveliterature.org).  Your message will be held for moderation but we'll see it and get back to you.

# License

Intercode 2 is released under the terms and conditions of the MIT license.  Please see the LICENSE file for the full legalese.
