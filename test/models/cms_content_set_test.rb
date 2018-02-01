require 'test_helper'

describe CmsContentSet do
  it 'finds templates in the content set' do
    content_set = CmsContentSet.new(name: 'standard')
    partials = content_set.all_template_paths_with_names('partials')
    news_partial = partials.find { |(_path, name)| name == 'news' }

    assert news_partial
    assert File.exist?(news_partial.first)
  end

  it 'loads content and metadata from templates' do
    content_set = CmsContentSet.new(name: 'rock_and_romance')
    template_content, metadata = content_set.template_content(content_set.content_path('layouts', 'Default.liquid'))

    assert template_content.include?('<!DOCTYPE html>')
    assert_equal 'navbar-dark bg-rock-and-romance-red', metadata[:navbar_classes]
  end

  it 'loads metadata from content sets' do
    content_set = CmsContentSet.new(name: 'rock_and_romance')
    assert_equal ['standard'], content_set.metadata[:inherit]
  end

  it 'inherits templates' do
    content_set = CmsContentSet.new(name: 'rock_and_romance')
    inherited_content_set = CmsContentSet.new(name: 'standard')

    page_paths = content_set.all_template_paths('pages')
    assert page_paths.any? { |page_path| page_path.include?(inherited_content_set.root_path) }
  end

  it 'overrides inherited templates' do
    content_set = CmsContentSet.new(name: 'rock_and_romance')
    layout_paths = content_set.all_template_paths('layouts')
    assert layout_paths.any? { |layout_path| layout_path.include?(content_set.root_path) }
  end
end
