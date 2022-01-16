require 'test_helper'

describe CmsContentStorageAdapters::CmsPartials do
  it 'finds items in the content set' do
    content_set = CmsContentSet.new(name: 'standard')
    adapter = CmsContentStorageAdapters::CmsPartials.new(nil, content_set)
    items = adapter.all_items_from_disk
    news_partial = items.find { |item| item.identifier == 'news' }

    assert news_partial
    assert File.exist?(news_partial.path)
  end
end
