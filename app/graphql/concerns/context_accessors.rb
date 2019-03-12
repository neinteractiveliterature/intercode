module Concerns::ContextAccessors
  %i[
    current_user
    current_ability
    user_con_profile
    convention
    cadmus_renderer
    current_pending_order
    assumed_identity_from_profile
    verified_request
  ].each do |context_attribute|
    define_method context_attribute do
      context[context_attribute]
    end
  end

  delegate :can?, to: :current_ability
end
