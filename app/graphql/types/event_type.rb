# frozen_string_literal: true
class Types::EventType < Types::BaseObject
  description "An event at a convention"

  include FormResponseAttrsFields

  authorize_record

  field :id, ID, null: false, description: "The ID of this event"

  field :runs, [Types::RunType], null: false, description: "The runs of this event" do
    argument :exclude_conflicts,
             Boolean,
             required: false,
             description: "Deprecated; has no effect",
             deprecation_reason: "This parameter hasn't actually worked for a long time"
    argument :finish, Types::DateType, required: false, description: "Only return runs that finish before this time"
    argument :start, Types::DateType, required: false, description: "Only return runs that start after this time"
  end

  field :run, Types::RunType, null: false, description: "A single run of this event by ID" do
    argument :id, ID, required: false, description: "The ID of the run to return"
  end

  field :team_members, [Types::TeamMemberType], null: false, description: "The team members (GMs) of this event"

  field :provided_tickets, [Types::TicketType], null: false, description: "Tickets provided by this event" do
    authorize do |value, _args, context|
      fake_ticket = value.provided_tickets.new(user_con_profile: UserConProfile.new(convention: context[:convention]))
      authorized = Pundit.policy(context[:pundit_user], fake_ticket).read?
      value.provided_tickets.delete(fake_ticket)
      authorized
    end
  end

  field :maximum_event_provided_tickets_overrides,
        [Types::MaximumEventProvidedTicketsOverrideType],
        null: false,
        description: "Overrides for the maximum number of tickets this event can provide"

  field :bucket_keys_with_pending_signups_or_requests, [String], null: false do
    authorize_action :update
    description <<~MARKDOWN
      The distinct requested_bucket_key values from active signups, pending signup requests, and active signup ranked
      choices for this event. Used to determine which bucket key changes require a remapping UI when editing the
      registration policy.
    MARKDOWN
  end

  field :registration_policy,
        Types::RegistrationPolicyType,
        null: true,
        description: "The registration policy for this event"

  field :slots_limited, Boolean, null: true, description: "Whether this event has a limited number of slots"

  field :total_slots, Integer, null: true, description: "The total number of slots available for this event"

  field :short_blurb_html, String, null: true, description: "The short blurb for this event rendered as HTML"

  field :description_html, String, null: true, description: "The description of this event rendered as HTML"

  field :admin_notes, String, null: true, description: "Admin-only notes about this event" do
    authorize_action :read_admin_notes
  end

  field :my_rating, Integer, null: true, description: "The current user's rating for this event (1 or -1)"

  field :form_response_changes,
        [Types::FormResponseChangeType],
        null: false,
        description: "The history of changes to this event's form response" do
    authorize_action :update
  end

  field :images, [Types::ActiveStorageAttachmentType], null: false, description: "Images attached to this event"

  field :age_restrictions,
        String,
        null: true,
        description: "Age restrictions for this event (deprecated)",
        deprecation_reason:
          "Has not worked correctly in a long time.  Please use form_response_attrs or form_response_attrs_json."
  field :author, String, null: true, description: "The author(s) of this event"
  field :can_play_concurrently,
        Boolean,
        null: false,
        description: "Whether attendees can sign up for this event at the same time as other events"
  field :con_mail_destination,
        String,
        null: true,
        description: "Where convention emails about this event should be sent"
  field :content_warnings, String, null: true, description: "Content warnings for this event"
  field :convention, Types::ConventionType, null: false, description: "The convention this event belongs to"
  field :created_at, Types::DateType, null: true, description: "When this event was created"
  field :description, String, null: true, description: "The full description of this event"
  field :email, String, null: true, description: "The contact email for this event"
  field :form, Types::FormType, null: true, description: "The form used for this event"
  field :length_seconds, Integer, null: false, description: "The length of this event in seconds"
  field :organization, String, null: true, description: "The organization running this event"
  field :participant_communications,
        String,
        null: true,
        description: "Communications to send to participants of this event"
  field :private_signup_list, Boolean, null: true, description: "Whether the signup list for this event is private"
  field :short_blurb, String, null: true, description: "A short description of this event" # rubocop:disable GraphQL/ExtractType
  field :status, String, null: true, description: "The status of this event (active, dropped, etc.)"
  field :ticket_types, [Types::TicketTypeType], null: false, description: "The ticket types associated with this event"
  field :title, String, null: true, description: "The title of this event"
  field :url, String, null: true, description: "The URL for more information about this event"

  field :event_category, Types::EventCategoryType, null: false, description: "The category of this event"

  association_loaders Event, :event_category, :team_members, :ticket_types, :convention

  def form
    event_category = dataloader.with(Sources::ActiveRecordAssociation, Event, :event_category).load(object)
    dataloader.with(Sources::ActiveRecordAssociation, EventCategory, :event_form).load(event_category)
  end

  def runs(**args)
    dataloader.with(Sources::EventRuns, args[:start], args[:finish], args[:exclude_conflicts], pundit_user).load(object)
  end

  def run(**args)
    dataloader.with(Sources::ModelById, Run).load(args[:id])
  end

  def team_members
    team_members = dataloader.with(Sources::EventTeamMembers, pundit_user).load(object)
    context[:query_from_liquid] ? team_members.select(&:display?) : team_members
  end

  def maximum_event_provided_tickets_overrides
    meptos =
      dataloader.with(Sources::ActiveRecordAssociation, Event, :maximum_event_provided_tickets_overrides).load(object)
    meptos.select { |mepto| policy(mepto).read? }
  end

  # rubocop:disable Naming/PredicateMethod
  def slots_limited
    object.registration_policy.slots_limited?
  end
  # rubocop:enable Naming/PredicateMethod

  def total_slots
    object.registration_policy.total_slots
  end

  def short_blurb_html
    attachments = dataloader.with(Sources::ActiveRecordAssociation, Event, :images_attachments).load(object)
    _blobs = dataloader.with(Sources::ActiveRecordAssociation, ActiveStorage::Attachment, :blob).load_all(attachments)

    dataloader.with(Sources::Markdown, "event", "No information provided", context[:controller]).load(
      [[object, "short_blurb_html"], object.short_blurb, object.images_attachments.index_by { |att| att.filename.to_s }]
    )
  end

  def description_html
    attachments = dataloader.with(Sources::ActiveRecordAssociation, Event, :images_attachments).load(object)
    _blobs = dataloader.with(Sources::ActiveRecordAssociation, ActiveStorage::Attachment, :blob).load_all(attachments)

    dataloader.with(Sources::Markdown, "event", "No information provided", context[:controller]).load(
      [[object, "description_html"], object.description, object.images_attachments.index_by { |att| att.filename.to_s }]
    )
  end

  def my_rating
    return nil unless user_con_profile
    return nil unless EventRatingPolicy.new(pundit_user, EventRating.new(user_con_profile:, event: object)).read?

    dataloader.with(Sources::EventRating, user_con_profile).load(object)
  end

  def form_response_changes
    changes = dataloader.with(Sources::ActiveRecordAssociation, Event, :form_response_changes).load(object)
    CompactingFormResponseChangesPresenter.new(changes).compacted_changes
  end

  def images
    dataloader.with(Sources::ActiveStorageAttachment, Event, :images).load(object)
  end

  def bucket_keys_with_pending_signups_or_requests
    run_ids = object.runs.pluck(:id)
    return [] if run_ids.empty?

    (signup_requested_bucket_keys(run_ids) + request_bucket_keys(run_ids) + ranked_choice_bucket_keys(run_ids)).uniq
  end

  private

  def signup_requested_bucket_keys(run_ids)
    Signup
      .where.not(state: "withdrawn")
      .where(run_id: run_ids)
      .where.not(requested_bucket_key: nil)
      .distinct
      .pluck(:requested_bucket_key)
  end

  def request_bucket_keys(run_ids)
    SignupRequest
      .where(target_run_id: run_ids, state: "pending")
      .where.not(requested_bucket_key: nil)
      .distinct
      .pluck(:requested_bucket_key)
  end

  def ranked_choice_bucket_keys(run_ids)
    SignupRankedChoice
      .where(target_run_id: run_ids)
      .where.not(requested_bucket_key: nil)
      .distinct
      .pluck(:requested_bucket_key)
  end
end
