class CmsContentLoaders::CmsPartials < CmsContentLoaders::Base
  private

  def subdir
    'partials'
  end

  def convention_association
    convention.cms_partials
  end

  def identifier_attribute
    'name'
  end

  def content_attribute
    'content'
  end
end
