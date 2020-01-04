#!/usr/bin/env rake
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

Intercode::Application.load_tasks

require 'graphql/rake_task'
GraphQL::RakeTask.new(schema_name: 'IntercodeSchema')

Doorkeeper::Rake.load_tasks

# TURBOHAX: make the yarn:install task a no-op since we can't easily stop Rails from
# running it with assets:precompile

Rake::Task['yarn:install'].clear

namespace :yarn do
  task :install do
    # workaround to stop running yarn install after precompile
  end
end
