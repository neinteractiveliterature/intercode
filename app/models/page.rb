# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: pages
#
#  id                       :integer          not null, primary key
#  admin_notes              :text
#  content                  :text
#  hidden_from_search       :boolean          default(FALSE), not null
#  invariant                :boolean          default(FALSE), not null
#  name                     :text
#  parent_type              :string
#  skip_clickwrap_agreement :boolean          default(FALSE), not null
#  slug                     :string
#  created_at               :datetime
#  updated_at               :datetime
#  cms_layout_id            :bigint
#  parent_id                :integer
#
# Indexes
#
#  index_pages_on_cms_layout_id                       (cms_layout_id)
#  index_pages_on_parent_type_and_parent_id_and_slug  (parent_type,parent_id,slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (cms_layout_id => cms_layouts.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
# rubocop:disable Metrics/LineLength, Lint/RedundantCopDisableDirective
class Page < ApplicationRecord
  include PgSearch::Model
  include Cadmus::Page
  include CmsReferences
  include ActionView::Helpers::SanitizeHelper

  cadmus_page
  belongs_to :cms_layout, optional: true
  has_many :cms_content_group_associations, as: :content
  has_many :cms_content_groups, through: :cms_content_group_associations
  has_many :cms_navigation_items, dependent: :destroy
  has_and_belongs_to_many :cms_files
  has_and_belongs_to_many :cms_partials

  before_commit :set_performance_metadata, on: [:create, :update]
  after_commit :touch_parent

  multisearchable(
    against: [:name, :content_for_search],
    additional_attributes: ->(page) {
      convention = page.parent.is_a?(Convention) ? page.parent : nil
      { convention_id: convention&.id, hidden_from_search: page.hidden_from_search }
    }
  )

  def effective_cms_layout
    return cms_layout if cms_layout
    if parent
      parent.default_layout
    else
      RootSite.instance&.default_layout
    end
  end

  def to_liquid
    PageDrop.new(self)
  end

  def referenced_partials_recursive(blacklist = [])
    (super + (effective_cms_layout&.referenced_partials_recursive(blacklist) || [])).uniq
  end

  def referenced_files_recursive
    [
      *super,
      *referenced_partials_recursive.flat_map(&:referenced_files_recursive),
      *(effective_cms_layout&.referenced_files_recursive || [])
    ].uniq
  end

  def content_for_search
    convention = parent.is_a?(Convention) ? parent : nil
    strip_tags(CmsContentFinder.new(convention).cms_rendering_context.render_page_content(self))
  rescue => e
    Rails.logger.debug e
    ''
  end

  private

  def set_performance_metadata
    self.cms_file_ids = referenced_files_recursive.map(&:id)
    self.cms_partial_ids = referenced_partials_recursive.map(&:id)
    self.invariant = template_invariant?(parent&.cms_variables&.pluck(:key) || [])
  end

  def touch_parent
    parent.touch if parent && parent.persisted?
  end
end
