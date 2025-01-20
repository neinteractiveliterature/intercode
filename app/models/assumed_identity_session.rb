# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: assumed_identity_sessions
#
#  id                 :bigint           not null, primary key
#  finished_at        :datetime
#  justification      :text             not null
#  started_at         :datetime         not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  assumed_profile_id :bigint           not null
#  assumer_profile_id :bigint           not null
#
# Indexes
#
#  index_assumed_identity_sessions_on_assumed_profile_id  (assumed_profile_id)
#  index_assumed_identity_sessions_on_assumer_profile_id  (assumer_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (assumed_profile_id => user_con_profiles.id)
#  fk_rails_...  (assumer_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class AssumedIdentitySession < ApplicationRecord
  belongs_to :assumed_profile, class_name: 'UserConProfile'
  belongs_to :assumer_profile, class_name: 'UserConProfile'
  has_many :assumed_identity_request_logs, dependent: :destroy

  validates :justification, presence: true
end
