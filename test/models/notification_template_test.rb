# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: notification_templates
#
#  id            :bigint           not null, primary key
#  body_html     :text
#  body_sms      :text
#  body_text     :text
#  event_key     :string           not null
#  subject       :text
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  convention_id :bigint           not null
#
# Indexes
#
#  index_notification_templates_on_convention_id  (convention_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

require "test_helper"

class NotificationTemplateTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
