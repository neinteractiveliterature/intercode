# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: events
#
#  id                           :bigint           not null, primary key
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
#  convention_id                :bigint
#  event_category_id            :bigint           not null
#  owner_id                     :bigint
#  updated_by_id                :bigint
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
FactoryBot.define do
  factory :event do
    convention

    sequence(:title) { |n| "Event #{n}" }
    status { 'active' }
    registration_policy { RegistrationPolicy.unlimited }
    length_seconds { 4.hours }
    con_mail_destination { 'event_email' }

    after(:build) { |event| event.event_category ||= build(:event_category, convention: event.convention) }
  end
end
