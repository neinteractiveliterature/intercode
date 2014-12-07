#
# Definition of the Larp class of events
#
class Events::Larp < Event

  # Set default values for a LARP event
  after_initialize do
    if new_record?
      # LARPs need to be reviewed by the Bid committee
      self.status = "Proposed"

      # Default LARP length is 4 hours
      self.length_seconds = 4 * 60 * 60
    end
  end

  # Return true if there's an author or organization
  def author_or_org?
    if self.author
      return true
    end
    if self.organization
      return true
    end
    false
  end

  # Returns the author of a LARP or the organization that wrote the LARP
  def author_or_org
    if self.author
      return self.author
    end

    if self.organization
      return self.organization
    end

    ''
  end

  # Generate an obfuscated email address. This really wants to be tied to the
  # generation of the link, but I'm not sure how to do that at this point.
  def obfuscated_email
    self.email.gsub('.', ' DOT ').gsub('@', ' AT ')
  end
end
