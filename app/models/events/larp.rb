#
# Definition of the Larp class of events
#
class Events::Larp < Event

  # Set default values for a LARP event
  after_initialize do
    if new_record?
      # LARPs need to be reviewed by the Bid committee
      self.status = "Proposed"
    end
  end
end
