require 'test_helper'

describe CmsContentStorageAdapters::Pages do
  it 'inherits templates' do
    content_set = CmsContentSet.new(name: 'rock_and_romance')
    inherited_content_set = CmsContentSet.new(name: 'standard')

    adapter = CmsContentStorageAdapters::Pages.new(nil, content_set)
    items = adapter.all_items_from_disk
    assert(items.any? { |item| item.path.include?(inherited_content_set.root_path) })
  end
end
