# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: event_proposals
#
#  id                     :bigint           not null, primary key
#  additional_info        :jsonb
#  admin_notes            :text
#  can_play_concurrently  :boolean
#  description            :text
#  email                  :text
#  length_seconds         :integer
#  registration_policy    :jsonb
#  reminded_at            :datetime
#  short_blurb            :text
#  status                 :string
#  submitted_at           :datetime
#  team_mailing_list_name :text
#  timeblock_preferences  :jsonb
#  title                  :text
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  convention_id          :bigint
#  event_category_id      :bigint           not null
#  event_id               :bigint
#  owner_id               :bigint
#
# Indexes
#
#  index_event_proposals_on_convention_id      (convention_id)
#  index_event_proposals_on_event_category_id  (event_category_id)
#  index_event_proposals_on_event_id           (event_id)
#  index_event_proposals_on_owner_id           (owner_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#  fk_rails_...  (event_category_id => event_categories.id)
#  fk_rails_...  (event_id => events.id)
#  fk_rails_...  (owner_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
# rubocop:disable Metrics/LineLength, Lint/RedundantCopDisableDirective
class EventProposal < ApplicationRecord
  include AgeRestrictions
  include EventEmail
  include FormResponse
  include MarkdownIndexing
  include OrderByTitle
  include PgSearch::Model

  STATUSES = Set.new(%w[draft proposed reviewing tentative_accept accepted rejected withdrawn])

  register_form_response_attrs :title,
                               :email,
                               :event_email,
                               :age_restrictions,
                               :team_mailing_list_name,
                               :length_seconds,
                               :description,
                               :short_blurb,
                               :registration_policy,
                               :can_play_concurrently,
                               :timeblock_preferences

  belongs_to :convention
  belongs_to :owner, class_name: 'UserConProfile', optional: true
  belongs_to :event, optional: true
  belongs_to :event_category

  STATUSES.each { |status| scope status, -> { where(status: status) } }

  scope :submitted, -> { where.not(status: 'draft') }
  scope :reminded, -> { where.not(reminded_at: nil) }
  scope :not_reminded, -> { where(reminded_at: nil) }

  serialize :registration_policy, ActiveModelCoder.new('RegistrationPolicy')
  serialize :timeblock_preferences,
            JSONArrayCoderWrapper.new(ActiveModelCoder.new('EventProposal::TimeblockPreference'))

  validates :status, inclusion: { in: STATUSES }
  validate :length_fits_in_convention

  indexable_markdown_field(:description_for_search) { description }
  indexable_markdown_field(:short_blurb_for_search) { short_blurb }

  multisearchable(
    against: %i[
      title
      authors_for_search
      organization_for_search
      owner_for_search
      description_for_search
      short_blurb_for_search
    ],
    additional_attributes: ->(proposal) do
      {
        convention_id: proposal.convention_id,
        hidden_from_search: %w[accepted rejected withdrawn].include?(proposal.status)
      }
    end
  )

  def to_liquid
    EventProposalDrop.new(self)
  end

  def other_models_for_team_mailing_list_conflicts(model_class)
    return super unless model_class == Event && event_id
    super.where.not(id: event_id)
  end

  private

  def length_fits_in_convention
    return unless length_seconds && length_seconds > convention.length_seconds
    errors.add :length_seconds, "Event cannot be longer than #{convention.name}"
  end

  def authors_for_search
    read_form_response_attribute(:authors)
  end

  def organization_for_search
    read_form_response_attribute(:organization)
  end

  def owner_for_search
    owner&.name
  end
end
