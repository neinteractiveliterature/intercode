class PageAuthorizer < ConventionContentsAuthorizer
  def readable_by?(user)
    true
  end
  
  def convention
    @convention ||= resource.parent
  end
end