class CmsContentLoaders::Pages < CmsContentLoaders::Base
  private

  def inner_call
    super

    return success unless content_set.metadata[:root_page_slug]
    convention.update!(
      root_page: convention.pages.find_by(slug: content_set.metadata[:root_page_slug])
    )

    success
  end

  def subdir
    'pages'
  end

  def convention_association
    convention.pages
  end

  def identifier_attribute
    'slug'
  end

  def content_attribute
    'content'
  end

  def taken_special_identifiers
    if convention.root_page
      { 'root' => 'root page' }
    else
      {}
    end
  end
end
