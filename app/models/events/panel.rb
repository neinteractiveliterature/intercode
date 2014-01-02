#
# Definition of the Panel class of events.  This will be used to implement
# Intercon's Pre-Convention events.
#
class Events::Panel < Event

  # Set default values for a Panel event
  after_initialize do
    if new_record?
      # Panel proposals need to be reviewed by the Panel committee
      self.status = "Proposed"
    end
  end
end
