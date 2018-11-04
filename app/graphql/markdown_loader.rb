class MarkdownLoader < GraphQL::Batch::Loader
  attr_reader :group_cache_key, :default_content

  def initialize(group_cache_key, default_content)
    @group_cache_key = group_cache_key
    @default_content = default_content
  end

  def perform(keys)
    markdown_by_cache_key = keys.each_with_object({}) do |(object_cache_key, markdown), hash|
      hash[[object_cache_key, group_cache_key]] = markdown
    end

    presenter = MarkdownPresenter.new(default_content)
    rendered_content = Rails.cache.fetch_multi(*markdown_by_cache_key.keys) do |key|
      presenter.render(markdown_by_cache_key[key])
    end

    keys.each do |(object_cache_key, markdown)|
      fulfill([object_cache_key, markdown], rendered_content[[object_cache_key, group_cache_key]])
    end
  end
end
