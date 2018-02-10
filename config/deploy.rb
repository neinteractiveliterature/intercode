# config valid for current version and patch releases of Capistrano
lock "~> 3.10.1"

set :application, "intercode"
set :repo_url, "https://github.com/neinteractiveliterature/intercode"

task :load_remote_environment do
  on roles(:app) do
    set :rollbar_token, Dotenv::Parser.call(capture("cat #{shared_path}/.env.production"))['ROLLBAR_ACCESS_TOKEN']
  end
end
after 'deploy:set_current_revision', 'load_remote_environment'

set :rollbar_env, Proc.new { fetch :rails_env }
set :rollbar_role, Proc.new { :app }

set :whenever_identifier, ->{ "#{fetch(:application)}_#{fetch(:stage)}" }

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, "/var/www/my_app_name"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
append :linked_files, "config/database.yml", "config/secrets.yml", ".env.production"

# Default value for linked_dirs is []
append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
# set :keep_releases, 5

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure
