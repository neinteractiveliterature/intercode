# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: registration_policies
#
#  id                            :bigint           not null, primary key
#  freeze_no_preference_buckets  :boolean          default(FALSE), not null
#  prevent_no_preference_signups :boolean          default(FALSE), not null
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

FactoryBot.define { factory :registration_policy }
