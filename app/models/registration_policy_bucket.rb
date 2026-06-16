# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: registration_policy_buckets
#
#  id                     :bigint           not null, primary key
#  counted                :boolean          default(TRUE), not null
#  description            :text
#  expose_attendees       :boolean          default(FALSE), not null
#  flex                   :boolean          default(FALSE), not null
#  key                    :string           not null
#  minimum_slots          :integer
#  name                   :text             not null
#  position               :integer          not null
#  preferred_slots        :integer
#  slots_limited          :boolean          default(FALSE), not null
#  total_slots            :integer
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  registration_policy_id :bigint           not null
#
# Indexes
#
#  idx_on_registration_policy_id_key_b71cb40026                 (registration_policy_id,key) UNIQUE
#  index_registration_policy_buckets_on_registration_policy_id  (registration_policy_id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
class RegistrationPolicyBucket < ApplicationRecord
end
