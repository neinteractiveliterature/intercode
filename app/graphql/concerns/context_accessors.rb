# frozen_string_literal: true
module ContextAccessors
  %i[
    current_user
    pundit_user
    user_con_profile
    convention
    cadmus_renderer
    current_pending_order
    assumed_identity_from_profile
    verified_request
    timezone_for_request
  ].each do |context_attribute|
    define_method context_attribute do
      context[context_attribute]
    end
  end

  def cms_parent
    @cms_parent ||= convention || RootSite.instance
  end

  def policy(model)
    Pundit.policy(context[:pundit_user], model)
  end

  def policy_scope(scope)
    Pundit.policy_scope(context[:pundit_user], scope)
  end

  def cms_content_finder
    @cms_content_finder ||= CmsContentFinder.new(context[:convention])
  end

  def cms_rendering_context_for_cms_parent(cms_parent, path: nil)
    user_con_profile = nil
    convention = nil
    if cms_parent.is_a?(Convention)
      convention = cms_parent
      user_con_profile = cms_parent.user_con_profiles.find_by(user_id: context[:current_user])
    end

    cms_content_finder = CmsContentFinder.new(convention)
    cms_content_finder.cms_rendering_context(
      path:,
      controller: context[:controller],
      user: context[:current_user],
      user_con_profile:,
      timezone: context[:timezone_for_request]
    )
  end
end
