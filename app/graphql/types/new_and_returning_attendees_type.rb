# frozen_string_literal: true
class Types::NewAndReturningAttendeesType < Types::BaseObject
  description "A report grouping convention attendees into those new to the organization " \
                "and those who have attended before."

  field :organization_attendance_counts,
        [Types::OrganizationAttendanceCountType],
        null: false,
        description:
          "Attendance counts per attendee across all conventions in the organization, " \
            "used to distinguish new attendees from returning ones."
end
