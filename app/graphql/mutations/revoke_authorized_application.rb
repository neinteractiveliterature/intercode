# frozen_string_literal: true
class Mutations::RevokeAuthorizedApplication < Mutations::BaseMutation
  argument :uid, ID, required: true

  require_user

  def resolve(uid:)
    application = Doorkeeper.config.application_model.find_by!(uid:)
    Doorkeeper.config.application_model.revoke_tokens_and_grants_for(application.id, current_user)
    {}
  end
end
