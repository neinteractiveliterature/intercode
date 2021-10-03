# frozen_string_literal: true
class Mutations::RevokeAuthorizedApplication < Mutations::BaseMutation
  argument :uid, ID, required: true

  require_user

  def resolve(uid:)
    application = Doorkeeper::Application.find_by!(uid: uid)
    Doorkeeper::Application.revoke_tokens_and_grants_for(application.id, current_user)
    {}
  end
end
