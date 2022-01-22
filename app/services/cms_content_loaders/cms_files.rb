# frozen_string_literal: true
class CmsContentLoaders::CmsFiles < CmsContentLoaders::Base
  private

  def storage_adapter
    @storage_adapter ||= CmsContentStorageAdapters::CmsFiles.new(cms_parent, content_set)
  end

  def create_item(_identifier, attrs)
    File.open(attrs[:path], 'rb') do |file|
      cms_parent.cms_files.create!(file: { io: file, filename: File.basename(attrs[:path]) })
    end
  end
end
