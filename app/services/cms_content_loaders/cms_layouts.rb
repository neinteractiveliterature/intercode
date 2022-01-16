# frozen_string_literal: true
class CmsContentLoaders::CmsLayouts < CmsContentLoaders::Base
  private

  def inner_call
    super

    return success unless content_set.metadata[:default_layout_name]
    default_layout = cms_parent.cms_layouts.find_by(name: content_set.metadata[:default_layout_name])
    cms_parent.update!(default_layout: default_layout)

    success
  end

  def storage_adapter
    @storage_adapter ||= CmsContentStorageAdapters::CmsLayouts.new(cms_parent, content_set)
  end

  def taken_special_identifiers
    cms_parent.default_layout ? { 'Default' => 'default layout' } : {}
  end
end
