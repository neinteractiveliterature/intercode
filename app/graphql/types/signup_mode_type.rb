# frozen_string_literal: true
class Types::SignupModeType < Types::BaseEnum
  value('self_service', 'Attendees can sign themselves up for events')
  value('moderated', 'Attendees can request signups and signup changes but con staff must approve them')
  value('ranked_choice', 'Attendees make a ranked list of choices and the site attempts to give everyone what they want')
end
