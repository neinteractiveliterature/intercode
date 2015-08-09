#
# Definition of the Ops class of events
#
class Events::Ops < Events::VolunteerEvent

  # Set default values for the Ops! event
  after_initialize do
    if new_record?
      self.title = "Ops!"
      self.short_blurb = "Volunteer for Ops shifts!"
      self.description =
        "The Intercon Operations Crew takes care of ensuring the cogs of the "
        "con keep on turning. Whether it's handing out registration packets, "
        "setting up for the raffle, helping players find games, or any of the "
        "dozens of other things that come up, Ops needs volunteers like you "
        "to make it happen. Volunteering for Ops shifts is a valuable use of "
        "your time and effort."

      # The Ops event does not need to be reviewed
      self.status = "accepted"
    end
  end
end
