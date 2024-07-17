# frozen_string_literal: true
class Sources::Markdown < GraphQL::Dataloader::Source
  attr_reader :group_cache_key, :default_content, :controller

  def initialize(group_cache_key, default_content, controller)
    @group_cache_key = group_cache_key
    @default_content = default_content
    @controller = controller
  end

  def fetch(keys)
    presenter = MarkdownPresenter.new(default_content, controller:)

    render_proc_by_cache_key =
      keys.each_with_object({}) do |(object_cache_key, markdown, local_images), hash|
        hash[[object_cache_key, group_cache_key]] = -> { presenter.render(markdown, local_images: local_images || {}) }
      end

    rendered_content =
      Rails.cache.fetch_multi(*render_proc_by_cache_key.keys) { |key| render_proc_by_cache_key[key].call }

    keys.map { |(object_cache_key, _markdown, _local_images)| rendered_content[[object_cache_key, group_cache_key]] } # rubocop:disable Rails/Pluck
  end
end
