#
# Definition of the ConSuite class of events
#
class Events::ConSuite < Events::VolunteerEvent
  # Set default values for the ConSuite event
  after_initialize do
    if new_record?
      self.title = "ConSuite"
      self.short_blurb = "Help serve Intercon breakfast, lunch, and dinner."
      self.description = "Help serve Intercon breakfast, lunch, and dinner."

      # The Con Suite event does not need to be reviewed
      self.status = "Accepted"
    end
  end
end
