# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: form_response_changes
#
#  id                  :bigint           not null, primary key
#  compacted           :boolean          default(FALSE), not null
#  field_identifier    :string           not null
#  new_value           :jsonb
#  notified_at         :datetime
#  previous_value      :jsonb
#  response_type       :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  response_id         :bigint
#  user_con_profile_id :bigint           not null
#
# Indexes
#
#  index_form_response_changes_on_compacted                      (compacted)
#  index_form_response_changes_on_notified_at                    (notified_at)
#  index_form_response_changes_on_response_type_and_response_id  (response_type,response_id)
#  index_form_response_changes_on_user_con_profile_id            (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
# rubocop:disable Metrics/LineLength, Lint/RedundantCopDisableDirective
class FormResponseChange < ApplicationRecord
  belongs_to :response, polymorphic: true
  belongs_to :user_con_profile

  scope :not_notified, -> { where(notified_at: nil) }
  scope :compacted, -> { where(compacted: true) }
  scope :not_compacted, -> { where(compacted: false) }
end
