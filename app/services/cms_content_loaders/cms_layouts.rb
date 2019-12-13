class CmsContentLoaders::CmsLayouts < CmsContentLoaders::Base
  private

  def inner_call
    super

    return success unless content_set.metadata[:default_layout_name]
    default_layout = convention.cms_layouts.find_by(
      name: content_set.metadata[:default_layout_name]
    )
    convention.update!(default_layout: default_layout)

    success
  end

  def subdir
    'layouts'
  end

  def convention_association
    convention.cms_layouts
  end

  def identifier_attribute
    'name'
  end

  def content_attribute
    'content'
  end

  def taken_special_identifiers
    if convention.default_layout
      { 'Default' => 'default layout' }
    else
      {}
    end
  end
end
