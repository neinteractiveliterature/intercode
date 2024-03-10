# frozen_string_literal: true
class Types::EventType < Types::BaseObject
  include FormResponseAttrsFields

  authorize_record

  field :id, ID, null: false
  field :title, String, null: true
  field :author, String, null: true
  field :email, String, null: true
  field :organization, String, null: true
  field :url, String, null: true
  field :participant_communications, String, null: true
  field :age_restrictions,
        String,
        null: true,
        deprecation_reason:
          "Has not worked correctly in a long time.  Please use form_response_attrs or form_response_attrs_json."
  field :content_warnings, String, null: true
  field :length_seconds, Integer, null: false
  field :can_play_concurrently, Boolean, null: false
  field :con_mail_destination, String, null: true
  field :description, String, null: true
  field :short_blurb, String, null: true
  field :status, String, null: true
  field :private_signup_list, Boolean, null: true
  field :form, Types::FormType, null: true
  field :created_at, Types::DateType, null: true
  field :ticket_types, [Types::TicketTypeType], null: false

  field :event_category, Types::EventCategoryType, null: false

  association_loaders Event, :event_category, :team_members, :ticket_types

  def form
    event_category = dataloader.with(Sources::ActiveRecordAssociation, Event, :event_category).load(object)
    dataloader.with(Sources::ActiveRecordAssociation, EventCategory, :event_form).load(event_category)
  end

  field :runs, [Types::RunType], null: false do
    argument :start, Types::DateType, required: false
    argument :finish, Types::DateType, required: false
    argument :exclude_conflicts,
             Boolean,
             required: false,
             deprecation_reason: "This parameter hasn't actually worked for a long time"
  end

  def runs(**args)
    dataloader.with(Sources::EventRuns, args[:start], args[:finish], args[:exclude_conflicts], pundit_user).load(object)
  end

  field :run, Types::RunType, null: false do
    argument :id, ID, required: false, camelize: true
  end

  def run(**args)
    dataloader.with(Sources::ModelById, Run).load(args[:id])
  end

  field :team_members, [Types::TeamMemberType], null: false

  def team_members
    EventTeamMembersLoader
      .for(pundit_user)
      .load(object)
      .then { |team_members| context[:query_from_liquid] ? team_members.select(&:display?) : team_members }
  end

  field :provided_tickets, [Types::TicketType], null: false do
    authorize do |value, _args, context|
      fake_ticket = value.provided_tickets.new(user_con_profile: UserConProfile.new(convention: context[:convention]))
      authorized = Pundit.policy(context[:pundit_user], fake_ticket).read?
      value.provided_tickets.delete(fake_ticket)
      authorized
    end
  end

  override_type = Types::MaximumEventProvidedTicketsOverrideType
  field :maximum_event_provided_tickets_overrides, [override_type], null: false

  def maximum_event_provided_tickets_overrides
    meptos =
      dataloader.with(Sources::ActiveRecordAssociation, Event, :maximum_event_provided_tickets_overrides).load(object)
    meptos.select { |mepto| policy(mepto).read? }
  end

  field :registration_policy, Types::RegistrationPolicyType, null: true

  field :slots_limited, Boolean, null: true

  def slots_limited
    object.registration_policy.slots_limited?
  end

  field :total_slots, Integer, null: true

  def total_slots
    object.registration_policy.total_slots
  end

  field :short_blurb_html, String, null: true

  def short_blurb_html
    attachments = dataloader.with(Sources::ActiveRecordAssociation, Event, :images_attachments).load(object)
    _blobs = dataloader.with(Sources::ActiveRecordAssociation, ActiveStorage::Attachment, :blob).load_all(attachments)

    dataloader.with(Sources::Markdown, "event", "No information provided", context[:controller]).load(
      [[object, "short_blurb_html"], object.short_blurb, object.images_attachments.index_by { |att| att.filename.to_s }]
    )
  end

  field :description_html, String, null: true

  def description_html
    attachments = dataloader.with(Sources::ActiveRecordAssociation, Event, :images_attachments).load(object)
    _blobs = dataloader.with(Sources::ActiveRecordAssociation, ActiveStorage::Attachment, :blob).load_all(attachments)

    dataloader.with(Sources::Markdown, "event", "No information provided", context[:controller]).load(
      [[object, "description_html"], object.description, object.images_attachments.index_by { |att| att.filename.to_s }]
    )
  end

  field :admin_notes, String, null: true do
    authorize_action :read_admin_notes
  end

  field :my_rating, Integer, null: true
  def my_rating
    return nil unless user_con_profile
    unless EventRatingPolicy.new(pundit_user, EventRating.new(user_con_profile: user_con_profile, event: object)).read?
      return nil
    end

    dataloader.with(Sources::EventRating, user_con_profile).load(object)
  end

  field :form_response_changes, [Types::FormResponseChangeType], null: false do
    authorize_action :update
  end
  def form_response_changes
    changes = dataloader.with(Sources::ActiveRecordAssociation, Event, :form_response_changes).load(object)
    CompactingFormResponseChangesPresenter.new(changes).compacted_changes
  end

  field :images, [Types::ActiveStorageAttachmentType], null: false
  def images
    dataloader.with(Sources::ActiveStorageAttachment, Event, :images).load(object)
  end
end
