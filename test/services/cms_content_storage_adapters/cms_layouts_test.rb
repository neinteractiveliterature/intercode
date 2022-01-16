require 'test_helper'

describe CmsContentStorageAdapters::CmsLayouts do
  it 'loads content and metadata from templates' do
    content_set = CmsContentSet.new(name: 'rock_and_romance')
    adapter = CmsContentStorageAdapters::CmsLayouts.new(nil, content_set)
    items = adapter.all_items_from_disk
    layout = items.find { |item| item.identifier == 'Default' }

    attrs = adapter.read_item_attrs(layout)

    assert attrs[:content].include?('<!DOCTYPE html>')
    assert_equal 'navbar-dark bg-rock-and-romance-red', attrs[:navbar_classes]
  end

  it 'overrides inherited templates' do
    content_set = CmsContentSet.new(name: 'rock_and_romance')
    adapter = CmsContentStorageAdapters::CmsLayouts.new(nil, content_set)
    items = adapter.all_items_from_disk
    assert(items.any? { |item| item.path.include?(content_set.root_path) })
  end
end
