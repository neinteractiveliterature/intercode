# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: cms_layouts
#
#  id             :bigint           not null, primary key
#  admin_notes    :text
#  content        :text
#  name           :text
#  navbar_classes :text
#  parent_type    :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  parent_id      :bigint
#
# Indexes
#
#  index_cms_layouts_on_parent_type_and_parent_id  (parent_type,parent_id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class CmsLayout < ApplicationRecord
  include Cadmus::Layout
  include CmsReferences

  has_many :cms_content_group_associations, as: :content
  has_many :cms_content_groups, through: :cms_content_group_associations
  has_and_belongs_to_many :cms_files
  has_and_belongs_to_many :cms_partials

  before_commit :set_performance_metadata, on: %i[create update]
  after_commit :touch_parent

  private

  cadmus_layout

  def set_performance_metadata
    self.cms_file_ids = referenced_files_recursive.map(&:id)
    self.cms_partial_ids = referenced_partials_recursive.map(&:id)
  end

  def touch_parent
    parent.touch if parent&.persisted?
  end
end
