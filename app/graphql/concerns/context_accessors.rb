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

  def cms_rendering_context(path: nil)
    cms_content_finder.cms_rendering_context(
      path: path,
      controller: context[:controller],
      user: context[:user],
      user_con_profile: context[:user_con_profile]
    )
  end
end
