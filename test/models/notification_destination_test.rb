# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: notification_destinations
#
#  id                  :bigint           not null, primary key
#  conditions          :jsonb
#  dynamic_destination :text
#  source_type         :string           not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  source_id           :bigint           not null
#  staff_position_id   :bigint
#  user_con_profile_id :bigint
#
# Indexes
#
#  index_notification_destinations_on_source_type_and_source_id  (source_type,source_id)
#  index_notification_destinations_on_staff_position_id          (staff_position_id)
#  index_notification_destinations_on_user_con_profile_id        (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (staff_position_id => staff_positions.id)
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

require "test_helper"

class NotificationDestinationTest < ActiveSupport::TestCase
  let(:convention) { create(:convention, :with_notification_templates) }
  let(:event_category) { create(:event_category, convention:) }
  let(:staff_position) { create(:staff_position, convention:) }
  let(:notification_template) { convention.notification_templates.find_by!(event_key: "event_proposals/new_proposal") }

  def build_destination(value)
    notification_template.notification_destinations.new(staff_position:, conditions: { event_category: value })
  end

  it "accepts an event category ID or array of IDs as an event_category condition" do
    assert build_destination(event_category.id).valid?
    assert build_destination([event_category.id]).valid?
  end

  it "rejects non-ID values for the event_category condition" do
    [nil, [], event_category.attributes, event_category.id.to_s].each do |value|
      assert_not build_destination(value).valid?, "expected #{value.inspect} to be invalid"
    end
  end
end
