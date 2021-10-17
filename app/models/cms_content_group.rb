# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: cms_content_groups
#
#  id          :bigint           not null, primary key
#  name        :string           not null
#  parent_type :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  parent_id   :bigint
#
# Indexes
#
#  index_cms_content_groups_on_parent_type_and_parent_id  (parent_type,parent_id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class CmsContentGroup < ApplicationRecord
  include Cadmus::Concerns::ModelWithParent

  model_with_parent
  after_commit :touch_parent

  has_many :cms_content_group_associations, dependent: :destroy
  has_many :pages, through: :cms_content_group_associations, source: :content, source_type: 'Page'
  has_many :cms_partials, through: :cms_content_group_associations, source: :content, source_type: 'CmsPartial'
  has_many :cms_layouts, through: :cms_content_group_associations, source: :content, source_type: 'CmsLayout'
  has_many :permissions, dependent: :destroy

  def touch_parent
    parent.touch if parent&.persisted?
  end
end
