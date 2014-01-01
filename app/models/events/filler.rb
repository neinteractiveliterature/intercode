#
# Definition of the Filler class of events. These events are used to describe
# filler for the schedule grid
#
class Events::Filler < Event
  # Set default values for the Ops! event
  after_initialize do
    if new_record?
      # Filler events do not need to be reviewed
      self.status = "Accepted"
    end
  end
end
