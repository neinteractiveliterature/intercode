class PageAuthorizer < ConventionContentsAuthorizer
  
  # Anyone can read any page.
  def readable_by?(user)
    true
  end
  
  # Pages in Intercode are always children of a Convention, so to
  # find the Convention we just ask the resource (which is a Page)
  # for its parent object.
  def convention
    @convention ||= resource.parent
  end
  
end