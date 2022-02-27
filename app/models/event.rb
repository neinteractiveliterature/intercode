# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: events
#
#  id                           :integer          not null, primary key
#  additional_info              :jsonb
#  admin_notes                  :text
#  age_restrictions_description :text
#  author                       :string
#  can_play_concurrently        :boolean          default(FALSE), not null
#  con_mail_destination         :string
#  content_warnings             :text
#  description                  :text
#  email                        :string
#  length_seconds               :integer          not null
#  minimum_age                  :integer
#  organization                 :string
#  participant_communications   :text
#  private_signup_list          :boolean          default(FALSE), not null
#  registration_policy          :jsonb
#  short_blurb                  :text
#  status                       :string           default("active"), not null
#  team_mailing_list_name       :text
#  title                        :string           not null
#  title_vector                 :tsvector
#  url                          :text
#  created_at                   :datetime
#  updated_at                   :datetime
#  convention_id                :integer
#  event_category_id            :bigint           not null
#  owner_id                     :integer
#  updated_by_id                :integer
#
# Indexes
#
#  index_events_on_convention_id      (convention_id)
#  index_events_on_event_category_id  (event_category_id)
#  index_events_on_owner_id           (owner_id)
#  index_events_on_title_vector       (title_vector) USING gin
#  index_events_on_updated_by_id      (updated_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#  fk_rails_...  (event_category_id => event_categories.id)
#  fk_rails_...  (owner_id => users.id)
#  fk_rails_...  (updated_by_id => users.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class Event < ApplicationRecord
  include AgeRestrictions
  include EventEmail
  include FormResponse
  include MarkdownIndexing
  include OrderByTitle
  include PgSearch::Model

  STATUSES = Set.new(%w[active dropped])
  CON_MAIL_DESTINATIONS = Set.new(%w[event_email gms])

  pg_search_scope(
    :title_prefix,
    against: :title,
    using: {
      tsearch: {
        dictionary: 'simple_unaccent',
        prefix: true,
        tsvector_column: 'title_vector'
      }
    }
  )

  indexable_markdown_field(:description_for_search) { description }
  indexable_markdown_field(:short_blurb_for_search) { short_blurb }

  multisearchable(
    against: %i[title author organization team_members_for_search description_for_search short_blurb_for_search],
    additional_attributes: ->(event) do
      { convention_id: event.convention_id, hidden_from_search: event.status == 'dropped' }
    end
  )

  register_form_response_attrs :title,
                               :author,
                               :email,
                               :event_email,
                               :team_mailing_list_name,
                               :organization,
                               :url,
                               :length_seconds,
                               :can_play_concurrently,
                               :con_mail_destination,
                               :description,
                               :short_blurb,
                               :registration_policy,
                               :participant_communications,
                               :age_restrictions,
                               :age_restrictions_description,
                               :minimum_age,
                               :content_warnings

  # Most events belong to the user who proposes it.  Some (like ConSuite or
  # Ops) are owned by the department head
  belongs_to :owner, class_name: 'User', optional: true

  # LARPs have GMs and Panels have Panelists
  has_many :team_members, dependent: :destroy

  # The user who last updated the event.  Used for tracking
  belongs_to :updated_by, class_name: 'User', optional: true

  belongs_to :convention
  belongs_to :event_category

  has_many :maximum_event_provided_tickets_overrides, dependent: :destroy
  has_many :provided_tickets, class_name: 'Ticket', inverse_of: 'provided_by_event', foreign_key: 'provided_by_event_id'
  has_many :ticket_types, dependent: :destroy

  has_many :event_ratings, dependent: :destroy

  has_many_attached :images

  # Status specifies the status of the event.  It must be one of
  # "active" or "dropped".
  validates :status, inclusion: { in: STATUSES }

  validates :con_mail_destination, inclusion: { in: CON_MAIL_DESTINATIONS }

  # All events for a Convention must have a unique title.  Ignore any events
  # that have a status of "Dropped".  If they have a duplicate title we don't
  # care.
  validates :title, presence: true, uniqueness: { scope: :convention, conditions: -> { where.not(status: 'dropped') } }

  # The event's registration policy must also be valid.
  validate :validate_registration_policy

  # Single-run events have to have no more than one run
  validate :single_run_events_must_have_no_more_than_one_run, unless: :bypass_single_event_run_check

  # Making it slightly harder to change the registration policy unless you really know what
  # you're doing
  validate :registration_policy_cannot_change, unless: :allow_registration_policy_change

  validate :event_category_must_be_from_same_convention

  validates :length_seconds, numericality: { greater_than_or_equal_to: 0 }

  # Runs specify how many instances of this event there are on the schedule.
  # An event may have 0 or more runs.
  has_many :runs, dependent: :destroy

  has_one :event_proposal, required: false
  has_many :form_response_changes, as: :response

  STATUSES.each { |status| scope status, -> { where(status: status) } }

  scope :regular, -> { where(event_category_id: EventCategory.where(scheduling_ui: 'regular').select(:id)) }

  scope :joins_rating_for_user_con_profile, ->(user_con_profile) { user_con_profile ? joins(<<~SQL.squish) : self }
        LEFT JOIN event_ratings ON (
          events.id = event_ratings.event_id
          AND user_con_profile_id = #{connection.quote(user_con_profile.id)}
        )
      SQL

  scope :with_rating_for_user_con_profile,
        ->(user_con_profile, rating) {
          if user_con_profile
            rating_array = rating.is_a?(Array) ? rating : [rating]
            joins_rating_for_user_con_profile(user_con_profile).where(
              'COALESCE(event_ratings.rating, 0) IN (?)',
              rating_array
            )
          else
            self
          end
        }

  scope :order_by_rating_for_user_con_profile,
        ->(user_con_profile, direction = nil) {
          if user_con_profile
            joins_rating_for_user_con_profile(user_con_profile).order(
              Arel.sql("COALESCE(event_ratings.rating, 0) #{direction || 'DESC'}")
            )
          else
            self
          end
        }

  scope :with_runs_between,
        ->(convention, start, finish) { where(id: convention.runs.between(start, finish).select(:event_id)) }

  serialize :registration_policy, ActiveModelCoder.new('RegistrationPolicy')

  attr_accessor :bypass_single_event_run_check, :allow_registration_policy_change

  def to_param
    "#{id}-#{title.parameterize}"
  end

  def to_liquid
    EventDrop.new(self)
  end

  def form
    event_category.event_form
  end

  def team_members_for_search
    team_members.visible.includes(:user_con_profile).map(&:name)
  end

  def other_models_for_team_mailing_list_conflicts(model_class)
    return super unless model_class == EventProposal
    super.where.not(event_id: id)
  end

  private

  def validate_registration_policy
    return unless registration_policy
    return if registration_policy.valid?

    registration_policy.errors.each { |attribute, error| errors.add "registration_policy.#{attribute}", error }
  end

  def single_run_events_must_have_no_more_than_one_run
    return unless event_category.single_run? && status == 'active'
    return if runs.size <= 1

    errors.add(:base, "#{event_category.name} events must have no more than one run")
  end

  def registration_policy_cannot_change
    return if new_record?
    return unless registration_policy_changed?

    before, after = changes['registration_policy']
    return if before == after # ActiveRecord is being overzealous about change detection

    errors.add :registration_policy,
               "cannot be changed via ActiveRecord on an existing event.  \
Use EventChangeRegistrationPolicyService instead."
  end

  def event_category_must_be_from_same_convention
    return if convention == event_category.convention

    errors.add :event_category,
               "is from #{event_category.convention.name} but this event is in \
#{convention.name}"
  end
end
