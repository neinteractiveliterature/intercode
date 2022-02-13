# frozen_string_literal: true
class MarkdownPresenter
  class MarkdownRenderer < Redcarpet::Render::HTML
    include Redcarpet::Render::SmartyPants
    include ActionView::Helpers::AssetTagHelper

    def initialize(local_images: {}, controller: nil, **args)
      super(**args)

      @local_images = local_images.stringify_keys.transform_keys { |key| key.downcase.strip }
      @controller = controller
    end

    def image(link, title, alt_text)
      uri =
        begin
          URI.parse(link)
        rescue URI::InvalidURIError
          nil
        end

      is_absolute = uri&.host || uri&.path&.start_with?('/')
      local_image = is_absolute ? nil : @local_images[link.downcase.strip]

      if local_image && @controller
        image_tag(
          @controller.rails_representation_url(local_image),
          title: title,
          alt_text: alt_text,
          class: 'img-fluid'
        )
      else
        image_tag(link, title: title, alt_text: alt_text, class: 'img-fluid')
      end
    rescue StandardError => e
      "#{e.class.name}: #{e.message}"
    end
  end

  # ALLOWED_LIQUID_NODE_CLASSES = [String, Intercode::Liquid::Tags::Spoiler, Intercode::Liquid::Tags::Youtube].freeze

  include ActionView::Helpers::SanitizeHelper
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::TextHelper

  def self.strip_single_p(html)
    fragment = Nokogiri::HTML::DocumentFragment.parse(html)
    non_blank_children = fragment.children.reject { |child| child.text? && child.content.blank? }

    if non_blank_children.size == 1 && non_blank_children.first.name == 'p'
      non_blank_children.first.inner_html.html_safe
    else
      html
    end
  end

  attr_reader :default_content, :cadmus_renderer, :controller

  def initialize(default_content, cadmus_renderer: nil, controller: nil)
    @default_content = default_content
    @cadmus_renderer = cadmus_renderer
    @controller = controller
  end

  def render(markdown, sanitize_content: true, strip_single_p: true, filter_liquid_tags: true, local_images: {})
    pipeline =
      build_pipeline(
        sanitize_content: sanitize_content,
        strip_single_p: strip_single_p,
        filter_liquid_tags: filter_liquid_tags,
        local_images: local_images
      )

    pipeline.inject(markdown) { |acc, elem| elem.call(acc) }
  end

  def markdown_processor(local_images: {})
    @markdown_processor ||=
      Redcarpet::Markdown.new(
        MarkdownRenderer.new(
          controller: controller,
          link_attributes: {
            target: '_blank',
            rel: 'noreferrer'
          },
          local_images: local_images
        ),
        no_intra_emphasis: true,
        autolink: true,
        footnotes: true
      )
  end

  private

  def build_pipeline_core(sanitize_content:, filter_liquid_tags:, local_images:)
    markdown_renderer = (->(content) { markdown_processor(local_images: local_images).render(content || '') })
    sanitizer = (->(content) { sanitize_html(content, sanitize_content: sanitize_content) })
    liquid_renderer = (->(content) { render_liquid(content, filter_liquid_tags: filter_liquid_tags) })

    sanitize_content ? [markdown_renderer, sanitizer, liquid_renderer] : [liquid_renderer, markdown_renderer, sanitizer]
  end

  def build_pipeline(sanitize_content:, strip_single_p:, filter_liquid_tags:, local_images:)
    [
      *build_pipeline_core(
        sanitize_content: sanitize_content,
        filter_liquid_tags: filter_liquid_tags,
        local_images: local_images
      ),
      ->(content) { content.presence || (default_content.present? ? "<p><em>#{default_content}</em></p>" : '') },
      strip_single_p ? ->(content) { MarkdownPresenter.strip_single_p(content) } : nil
    ].compact
  end

  def sanitize_html(html, sanitize_content: true)
    if sanitize_content
      # Loofah will automatically sanitize CSS for us
      sanitize(html, attributes: Rails::Html::SafeListSanitizer.allowed_attributes + %w[style id])
    else
      sanitize(html, scrubber: Rails::Html::TargetScrubber.new) # target nothing for removal
    end
  end

  def render_liquid(liquid, filter_liquid_tags: true)
    if filter_liquid_tags
      # TODO: undo hax if I can figure out a better way to do a node allowlist
      # this used to work before Liquid started freezing everything
      # template.root.nodelist.select! { |node| ALLOWED_LIQUID_NODE_CLASSES.any? { |klass| node.is_a?(klass) } }

      liquid
        .gsub(/\{%\s*youtube\s+([^ %]+)\s*%\}/) do |match|
          # this can't have inner content, so it's fine to run it through a liquid parser
          Liquid::Template.parse(match).render.html_safe
        end
        .gsub(/\{%\s*spoiler\s*%\}(.*)\{%\s*endspoiler\s*%\}/) do |_match|
          # Not going to attempt to replicate what AppComponentRenderer actually does here
          tag.div(nil, 'data-react-class' => 'Spoiler', 'data-react-props' => { content: Regexp.last_match(1) }.to_json)
        end
        .html_safe
    else
      template = Liquid::Template.parse(liquid)
      cadmus_renderer ? cadmus_renderer.render(template, :html) : template.render.html_safe
    end
  rescue StandardError => e
    %(<div class="alert alert-danger">#{e.message}</div>\n#{liquid}).html_safe
  end
end
