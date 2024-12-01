# frozen_string_literal: true
class Mutations::FreezeBucketAssignments < Mutations::BaseMutation
  description <<~MARKDOWN
  Freeze the existing bucket assignments for an event as they currently are.  After doing this, any signups in flex
  buckets that had a requested bucket will be moved into their requested buckets, and those buckets will be expanded to
  include them (and the flex bucket shrunk accordingly).  Additionally, this will set the flag on the event that
  prevents no-preference signups from being moved.
  MARKDOWN

  field :event, Types::EventType, null: false, description: "The event after freeing bucket assignments."
  argument :id, ID, required: false, description: "The ID of the event to freeze bucket assignments for."

  load_and_authorize_convention_associated_model :events, :id, :update

  def resolve(**)
    old_registration_policy = event.registration_policy.dup

    EventFreezeBucketAssignmentsService.new(event:, whodunit: user).call!
    event.reload

    log_form_response_changes(
      event,
      { "registration_policy" => [old_registration_policy.as_json, event.registration_policy.as_json] }
    )

    { event: }
  end

  private

  def log_form_response_changes(event, changes)
    changes.each do |(key, (previous_value, new_value))|
      FormResponseChange.create!(response: event, user_con_profile:, field_identifier: key, previous_value:, new_value:)
    end
  end
end
