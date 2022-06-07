# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: runs
#
#  id               :bigint           not null, primary key
#  schedule_note    :text
#  starts_at        :datetime
#  timespan_tsrange :tsrange          not null
#  title_suffix     :string
#  created_at       :datetime
#  updated_at       :datetime
#  event_id         :bigint
#  updated_by_id    :bigint
#
# Indexes
#
#  index_runs_on_event_id          (event_id)
#  index_runs_on_timespan_tsrange  (timespan_tsrange) USING gist
#  index_runs_on_updated_by_id     (updated_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (event_id => events.id)
#  fk_rails_...  (updated_by_id => users.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
FactoryBot.define do
  factory :run do
    event

    after(:build) { |run| run.starts_at ||= run.event.convention.starts_at }
  end
end
