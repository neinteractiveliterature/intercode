# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: organization_roles
#
#  id              :bigint           not null, primary key
#  name            :text
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  organization_id :bigint
#
# Indexes
#
#  index_organization_roles_on_organization_id  (organization_id)
#
# Foreign Keys
#
#  fk_rails_...  (organization_id => organizations.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class OrganizationRole < ApplicationRecord
  belongs_to :organization
  has_and_belongs_to_many :users
  has_many :permissions, dependent: :destroy
end
