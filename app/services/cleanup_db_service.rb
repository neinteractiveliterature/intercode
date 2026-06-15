# frozen_string_literal: true
class CleanupDbService < CivilService::Service
  # Diagnostic probe (oauth_refresh_failure investigation): keep the intercode
  # frontend app's *recently* revoked access tokens instead of deleting them on
  # the first cleanup pass. If an idle convention session's cookie still points
  # at one of these, the refresh endpoint will now find it (revoked) and report
  # `grant_rejected` rather than `token_not_found` (row deleted) — which tells us
  # whether this cleanup is what turns those sessions into "logged out overnight"
  # reports. Tune/remove once we have the answer.
  REVOKED_FRONTEND_TOKEN_GRACE_PERIOD = 2.days

  private

  def inner_call
    clean_revoked_access_tokens

    custom_doorkeeper_token_cleanup

    cleaner = Doorkeeper::StaleRecordsCleaner.new(Doorkeeper.config.access_grant_model)
    cleaner.clean_revoked

    if Doorkeeper.configuration.access_token_expires_in
      cleaner = Doorkeeper::StaleRecordsCleaner.new(Doorkeeper.config.access_grant_model)
      cleaner.clean_expired(Doorkeeper.config.authorization_code_expires_in)
    end

    trim_sessions

    success
  end

  # Mirrors Doorkeeper's StaleRecordsCleaner#clean_revoked, but spares the
  # intercode frontend app's tokens revoked within REVOKED_FRONTEND_TOKEN_GRACE_PERIOD
  # (see the constant for why).
  def clean_revoked_access_tokens
    revoked = Doorkeeper::AccessToken.where.not(revoked_at: nil).where(revoked_at: ..Time.current)

    frontend_app_id = OAuthApplication.find_by(is_intercode_frontend: true)&.id
    if frontend_app_id
      spared =
        Doorkeeper::AccessToken.where(
          application_id: frontend_app_id,
          revoked_at: REVOKED_FRONTEND_TOKEN_GRACE_PERIOD.ago..
        ).select(:id)
      revoked = revoked.where.not(id: spared)
    end

    revoked.in_batches(&:delete_all)
  end

  # Don't delete the most recently generated token for each user
  def custom_doorkeeper_token_cleanup
    return unless Doorkeeper.configuration.access_token_expires_in

    expirable_tokens = Doorkeeper::AccessToken.where(refresh_token: nil).where(Arel.sql(<<~SQL.squish))
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
    cutoff_period = (ENV["SESSION_DAYS_TRIM_THRESHOLD"] || 30).to_i.days.ago
    ActiveRecord::SessionStore::Session.where(updated_at: ...cutoff_period).delete_all
  end
end
