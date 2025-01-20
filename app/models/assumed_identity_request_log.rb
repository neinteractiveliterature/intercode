# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: assumed_identity_request_logs
#
#  id                          :bigint           not null, primary key
#  action_name                 :text             not null
#  controller_name             :text             not null
#  graphql_document            :text
#  graphql_operation_name      :text
#  graphql_variables           :jsonb
#  http_body                   :text
#  http_headers                :jsonb            not null
#  http_method                 :text             not null
#  ip_address                  :inet             not null
#  url                         :text             not null
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#  assumed_identity_session_id :bigint           not null
#
# Indexes
#
#  idx_assumed_identity_request_logs_on_session_id    (assumed_identity_session_id)
#  index_assumed_identity_request_logs_on_created_at  (created_at)
#
# Foreign Keys
#
#  fk_rails_...  (assumed_identity_session_id => assumed_identity_sessions.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class AssumedIdentityRequestLog < ApplicationRecord
  belongs_to :assumed_identity_session
end
