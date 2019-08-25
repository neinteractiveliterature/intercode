class Mutations::CreateCmsContentGroup < Mutations::BaseMutation
  field :cms_content_group, Types::CmsContentGroupType, null: false
  argument :cms_content_group, Types::CmsContentGroupInputType, required: true, camelize: false

  authorize_create_cms_model :cms_content_groups

  def resolve(cms_content_group:)
    content_group = cms_parent.cms_content_groups.create!(name: cms_content_group[:name])
    update_cms_contents(content_group, cms_content_group[:contents])

    { cms_content_group: content_group }
  end

  def update_cms_contents(content_group, contents)
    contents_by_type = contents.group_by { |content| content[:content_type] }
    Types::CmsContentTypeIndicator.values.keys.each do |content_type|
      contents = contents_by_type[content_type]
      if contents.blank?
        content_group.public_send(content_type.tableize).clear
        next
      end

      content_scope = cms_parent.public_send(content_type.tableize)
      content_models = content_scope.find(contents.map { |content| content[:id] })
      content_group.public_send("#{content_type.tableize}=", content_models)
    end
  end
end
