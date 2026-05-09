# frozen_string_literal: true
class Mutations::RevokeAuthorizedApplication < Mutations::BaseMutation
  description "Revokes all tokens and grants for an OAuth application for the current user."

  argument :uid, ID, required: true

  require_user

  def resolve(uid:)
    application = Doorkeeper.config.application_model.find_by!(uid:)
    Doorkeeper.config.application_model.revoke_tokens_and_grants_for(application.id, current_user)
    {}
  end
end
