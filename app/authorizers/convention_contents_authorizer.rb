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