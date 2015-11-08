# Intercode 2

Intercode is a web application that:

* serves as the public-facing web site for a larp convention
* automates signup and payment
* automates business processes for the convention staff

The original Intercode was written in PHP by Barry Tannenbaum for Intercon New England, and has since been used by several other conventions around the world.

Intercode 2 is a project to rearchitect Intercode from the ground up, making it more robust, more flexible, and more modern.

# Developer Quickstart with local Rails

This is the classic Rails development setup, and should work for Mac and Linux users.

1. Make sure you have a working C/C++ development toolchain installed.  On Mac OS X, that's Xcode and its Command Line Tools.
2. Install [rbenv](https://github.com/sstephenson/rbenv#readme)
3. Install [ruby-build](https://github.com/sstephenson/ruby-build#readme)
4. Install Ruby 2.2.3: `rbenv install 2.2.3`
5. (Optional, but if you don't, you'll have to set yourself using 2.2.3 some other way.) Make Ruby 2.2.3 your default: `rbenv global 2.2.3`
6. Install Bundler: `gem install bundler`
7. From the Intercode source folder:
  1. Install all the dependencies of Intercode: `bundle install`
  2. Set up your local database: `bin/rake db:create db:migrate`
  3. Start up the Intercode server: `bin/rails server`
9. You should now be able to go to http://localhost:3000 and see the app running!

# Developer Quickstart with Vagrant

We've put a working Vagrantfile into this repository so that you can easily get a dev environment up and running.  Here are the basic steps:

1. Clone this repository: `git clone https://github.com/neinteractiveliterature/intercode.git`
2. Download and install [VirtualBox](http://www.virtualbox.org)
3. Download and install [Vagrant](http://www.vagrantup.com)
4. Run the following commands from inside the Intercode source directory.  (It will take awhile to run `vagrant up` the first time, but it will finish eventually and you won't have to wait for it again the next time.)
    
    ```bash
    vagrant plugin install vagrant-vbguest
    vagrant plugin install vagrant-librarian-chef
    vagrant up
    vagrant ssh
    ```
5. You're now inside a Linux virtual machine set up to run Intercode.  The Intercode source is mounted into this VM at `/vagrant`, and any changes you make locally will be reflected in the VM (and vice versa).  To set up and run the app, run these commands:
    
    ```bash
    cd /vagrant
    bundle install
    rake db:create db:migrate db:seed
    rails server
    ```
6. You should now be able to visit http://localhost:3000 in a web browser and see Intercode running!  Any changes you make locally will be reflected here, just as if you were running the app locally.

# Contacting us

To contact the Intercode 2 project team, you can:

* [File an issue or feature request on our Jira tracker](https://intercode2.atlassian.net)
* [Email the project mailing list](mailto:intercode2@lists.interactiveliterature.org).  Your message will be held for moderation but we'll see it and get back to you.

# License

Intercode 2 is released under the terms and conditions of the MIT license.  Please see the LICENSE file for the full legalese.
