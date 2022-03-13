class CleanupDbService < CivilService::Service
  private

  def inner_call
    cleaner = Doorkeeper::StaleRecordsCleaner.new(Doorkeeper.config.access_token_model)
    cleaner.clean_revoked

    custom_doorkeeper_token_cleanup

    cleaner = Doorkeeper::StaleRecordsCleaner.new(Doorkeeper.config.access_grant_model)
    cleaner.clean_revoked

    cleaner = Doorkeeper::StaleRecordsCleaner.new(Doorkeeper.config.access_grant_model)
    cleaner.clean_expired(Doorkeeper.config.authorization_code_expires_in)

    trim_sessions

    success
  end

  # Don't delete the most recently generated token for each user
  def custom_doorkeeper_token_cleanup
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

  # Copy/pasted from activerecord-session_store
  def trim_sessions
    cutoff_period = (ENV['SESSION_DAYS_TRIM_THRESHOLD'] || 30).to_i.days.ago
    ActiveRecord::SessionStore::Session.where('updated_at < ?', cutoff_period).delete_all
  end
end
