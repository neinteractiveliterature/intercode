desc 'Clean authentication/authorization tables'
task :cleanup do
  %w[intercode:custom_doorkeeper_cleanup db:sessions:trim].each do |task|
    puts "Running #{task}"
    Rake::Task[task].invoke
  end
end

namespace :intercode do
  task custom_doorkeeper_cleanup: [
    'doorkeeper:db:cleanup:revoked_tokens',
    'intercode:custom_token_cleanup',
    'doorkeeper:db:cleanup:revoked_grants',
    'doorkeeper:db:cleanup:expired_grants'
  ]

  task :custom_token_cleanup do
    expirable_tokens = Doorkeeper::AccessToken.where(refresh_token: nil).where(Arel.sql(<<~SQL))
      created_at != (
        SELECT MAX(created_at) FROM #{Doorkeeper::AccessToken.table_name} tokens2
        WHERE #{Doorkeeper::AccessToken.table_name}.resource_owner_id = tokens2.resource_owner_id
        AND #{Doorkeeper::AccessToken.table_name}.application_id = tokens2.application_id
      )
    SQL
    cleaner = Doorkeeper::StaleRecordsCleaner.new(expirable_tokens)
    cleaner.clean_expired(Doorkeeper.configuration.access_token_expires_in)
  end
end
