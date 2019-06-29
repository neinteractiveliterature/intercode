module Concerns::ContextAccessors
  %i[
    controller
    current_user
    pundit_user
    current_ability
    user_con_profile
    convention
    cadmus_renderer
    cms_rendering_context
    current_pending_order
    assumed_identity_from_profile
    verified_request
  ].each do |context_attribute|
    define_method context_attribute do
      context[context_attribute]
    end
  end

  delegate :can?, to: :current_ability

  def cms_parent
    @cms_parent ||= convention || RootSite.instance
  end
end
