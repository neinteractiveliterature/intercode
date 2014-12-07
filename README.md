# Intercode 2

Intercode is a web application that:

* serves as the public-facing web site for a larp convention
* automates signup and payment
* automates business processes for the convention staff

The original Intercode was written in PHP by Barry Tannenbaum for Intercon New England, and has since been used by several other conventions around the world.

Intercode 2 is a project to rearchitect Intercode from the ground up, making it more robust, more flexible, and more modern.

# Developer Quickstart with Vagrant

We've put a working Vagrantfile into this repository so that you can easily get a dev environment up and running.  Here are the basic steps:

1. Clone this repository: `git clone https://github.com/neinteractiveliterature/intercode`
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
