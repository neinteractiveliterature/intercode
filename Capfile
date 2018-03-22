require 'dotenv'

require 'capistrano/setup'
require 'capistrano/deploy'
require 'capistrano/scm/git'
install_plugin Capistrano::SCM::Git

require 'capistrano/rails'
require 'capistrano/passenger'
require 'capistrano/shoryuken'
require 'capistrano/maintenance'
require 'whenever/capistrano'
require 'rollbar/capistrano3'

Dir.glob('lib/capistrano/tasks/*.rake').each { |r| import r }
