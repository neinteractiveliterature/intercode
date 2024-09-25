# frozen_string_literal: true
class Types::EventType < Types::BaseObject
  include FormResponseAttrsFields

  authorize_record

  field :id, ID, null: false

  field :runs, [Types::RunType], null: false do
    argument :exclude_conflicts,
             Boolean,
             required: false,
             deprecation_reason: "This parameter hasn't actually worked for a long time"
    argument :finish, Types::DateType, required: false
    argument :start, Types::DateType, required: false
  end

  field :run, Types::RunType, null: false do
    argument :id, ID, required: false, camelize: true
  end

  field :team_members, [Types::TeamMemberType], null: false

  field :provided_tickets, [Types::TicketType], null: false do
    authorize do |value, _args, context|
      fake_ticket = value.provided_tickets.new(user_con_profile: UserConProfile.new(convention: context[:convention]))
      authorized = Pundit.policy(context[:pundit_user], fake_ticket).read?
      value.provided_tickets.delete(fake_ticket)
      authorized
    end
  end

  field :maximum_event_provided_tickets_overrides, [Types::MaximumEventProvidedTicketsOverrideType], null: false

  field :registration_policy, Types::RegistrationPolicyType, null: true

  field :slots_limited, Boolean, null: true

  field :total_slots, Integer, null: true

  field :short_blurb_html, String, null: true

  field :description_html, String, null: true

  field :admin_notes, String, null: true do
    authorize_action :read_admin_notes
  end

  field :my_rating, Integer, null: true

  field :form_response_changes, [Types::FormResponseChangeType], null: false do
    authorize_action :update
  end

  field :images, [Types::ActiveStorageAttachmentType], null: false

  field :age_restrictions,
        String,
        null: true,
        deprecation_reason:
          "Has not worked correctly in a long time.  Please use form_response_attrs or form_response_attrs_json."
  field :author, String, null: true
  field :can_play_concurrently, Boolean, null: false
  field :con_mail_destination, String, null: true
  field :content_warnings, String, null: true
  field :convention, Types::ConventionType, null: false
  field :created_at, Types::DateType, null: true
  field :description, String, null: true
  field :email, String, null: true
  field :form, Types::FormType, null: true
  field :length_seconds, Integer, null: false
  field :organization, String, null: true
  field :participant_communications, String, null: true
  field :private_signup_list, Boolean, null: true
  field :short_blurb, String, null: true
  field :status, Types::EventStatusType, null: true
  field :ticket_types, [Types::TicketTypeType], null: false
  field :title, String, null: true
  field :url, String, null: true

  field :event_category, Types::EventCategoryType, null: false

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

  def slots_limited
    object.registration_policy.slots_limited?
  end

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
end
