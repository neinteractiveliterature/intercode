# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: deprecated_graph_ql_usages
#
#  id             :bigint           not null, primary key
#  argument_name  :text
#  client_address :inet
#  field_name     :text
#  graphql_type   :text
#  operation_name :text
#  user_agent     :text
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class DeprecatedGraphQlUsage < ApplicationRecord
end
