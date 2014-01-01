#
# Definition of the PreCon class of events
#
class Events::PreCon < Event

  # Set default values for a PreCon event
  after_initialize do
    if new_record?
      # PreCon proposals need to be reviewed by the PreCon committee
      self.status = "Proposed"
    end
  end
end
