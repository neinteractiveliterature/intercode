# == Schema Information
#
# Table name: user_activity_alerts
#
#  id                                 :bigint           not null, primary key
#  email                              :text
#  partial_name                       :text
#  trigger_on_ticket_create           :boolean          default(FALSE), not null
#  trigger_on_user_con_profile_create :boolean          default(FALSE), not null
#  created_at                         :datetime         not null
#  updated_at                         :datetime         not null
#  convention_id                      :bigint           not null
#  user_id                            :bigint
#
# Indexes
#
#  index_user_activity_alerts_on_convention_id  (convention_id)
#  index_user_activity_alerts_on_user_id        (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#  fk_rails_...  (user_id => users.id)
#

FactoryBot.define do
  factory :user_activity_alert do
    convention
  end
end
