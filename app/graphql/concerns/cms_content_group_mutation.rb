# frozen_string_literal: true
module CmsContentGroupMutation
  def update_cms_contents(content_group, contents)
    contents_by_type = contents.group_by(&:content_type)
    Types::CmsContentTypeIndicator.values.each_key do |content_type|
      contents = contents_by_type[content_type]
      if contents.blank?
        content_group.public_send(content_type.tableize).clear
        next
      end

      content_scope = content_group.parent.public_send(content_type.tableize)
      content_models = content_scope.find(contents.map(&:id))
      content_group.public_send(:"#{content_type.tableize}=", content_models)
    end
  end
end
