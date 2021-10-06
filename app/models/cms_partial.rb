# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: cms_partials
#
#  id          :integer          not null, primary key
#  admin_notes :text
#  content     :text
#  invariant   :boolean          default(FALSE), not null
#  name        :string           not null
#  parent_type :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  parent_id   :integer
#
# Indexes
#
#  index_cms_partials_on_parent_id_and_parent_type           (parent_id,parent_type)
#  index_cms_partials_on_parent_id_and_parent_type_and_name  (parent_id,parent_type,name) UNIQUE
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class CmsPartial < ApplicationRecord
  include Cadmus::Partial
  include CmsReferences

  has_and_belongs_to_many :pages
  has_many :cms_content_group_associations, as: :content
  has_many :cms_content_groups, through: :cms_content_group_associations
  before_commit :set_performance_metadata, on: %i[create update]

  cadmus_partial

  private

  def set_performance_metadata
    self.invariant = template_invariant?(parent&.cms_variables&.pluck(:key) || [])
  end
end
