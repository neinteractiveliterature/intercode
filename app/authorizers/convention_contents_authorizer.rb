# An intermediate base class for "things that are inside a Convention," such
# as Events, Pages, UserConProfiles, etc.  It pulls in everything from
# ConventionAuthorizer and sets the defaults for all actions to only allow
# con staff or site admins to perform them.  Subclasses must still
# override the ConventionAuthorizer#convention method.
class ConventionContentsAuthorizer < ConventionAuthorizer
  def creatable_by?(user)
    staff_or_site_admin?(user)
  end

  def readable_by?(user)
    staff_or_site_admin?(user)
  end
  
  def updatable_by?(user)
    staff_or_site_admin?(user)
  end

  def deletable_by?(user)
    staff_or_site_admin?(user)
  end
end