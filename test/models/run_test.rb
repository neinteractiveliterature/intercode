# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: runs
#
#  id               :bigint           not null, primary key
#  schedule_note    :text
#  starts_at        :datetime         not null
#  timespan_tsrange :tsrange          not null
#  title_suffix     :string
#  created_at       :datetime
#  updated_at       :datetime
#  event_id         :bigint           not null
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

require "test_helper"

class RunTest < ActiveSupport::TestCase
  let(:convention) { create(:convention) }
  let(:registration_policy) do
    RegistrationPolicy.build_from_hash(buckets: [{ key: "dogs", name: "Dogs", slots_limited: true, total_slots: 20 }])
  end
  let(:event) { create(:event, convention:, registration_policy:) }
  let(:the_run) { create(:run, event:) }
  let(:dogs_bucket_id) { registration_policy.bucket_with_key("dogs").id }

  describe "capacity checks over many signups" do
    before { 10.times { create(:signup, run: the_run, bucket_id: dogs_bucket_id) } }

    it "does not issue a bucket query per signup when checking #full?" do
      queries = count_queries(/registration_policy_buckets/) { the_run.reload.full? }
      assert_operator queries, :<=, 2, "expected a constant number of bucket queries regardless of signup count"
    end

    it "does not issue a bucket query per signup when computing #available_slots_by_bucket_id" do
      queries = count_queries(/registration_policy_buckets/) { the_run.reload.available_slots_by_bucket_id }
      assert_operator queries, :<=, 2, "expected a constant number of bucket queries regardless of signup count"
    end
  end

  private

  def count_queries(pattern)
    count = 0
    subscriber =
      ActiveSupport::Notifications.subscribe("sql.active_record") do |*, payload|
        count += 1 if pattern.match?(payload[:sql])
      end
    yield
    count
  ensure
    ActiveSupport::Notifications.unsubscribe(subscriber) if subscriber
  end
end
