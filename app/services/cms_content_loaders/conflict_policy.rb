class CmsContentLoaders::ConflictPolicy
  def action_for(_existing_item, _new_item, _attrs)
    raise "CmsContentLoader::ConflictPolicy subclasses must implement #action_for(existing_item, new_item, attrs)"
  end
end
