namespace :stage do
  desc 'Sanitize the local database and update the stage server with its contents'
  task :update_db do
    def run_command(cmd)
      puts cmd
      exit! unless system(cmd)
    end

    run_command 'pg_dump -Fc -d intercode_development >intercode_development_bak.pgdump'
    run_command 'bin/rake sanitize_db'
    run_command 'heroku pg:push intercode_development DATABASE'
    run_command 'pg_restore -c -d intercode_development intercode_development_bak.pgdump'
    run_command 'rm intercode_development_bak.pgdump'
  end
end
