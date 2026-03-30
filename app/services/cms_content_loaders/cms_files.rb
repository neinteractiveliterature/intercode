# frozen_string_literal: true
class CmsContentLoaders::CmsFiles < CmsContentLoaders::Base
  private

  def storage_adapter
    @storage_adapter ||= CmsContentStorageAdapters::CmsFiles.new(cms_parent, content_set)
  end

  def create_item(_identifier, attrs)
    File.open(attrs[:path], "rb") do |file|
      cms_parent.cms_files.create!(file: { io: file, filename: File.basename(attrs[:path]) })
    end
  end

  def existing_content_identifiers
    @existing_content_identifiers ||=
      Set.new(
        storage_adapter.cms_parent_association.joins(file_attachment: :blob).pluck(active_storage_blobs: "filename")
      )
  end
end
