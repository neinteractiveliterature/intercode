# frozen_string_literal: true

Rails.application.config.active_storage.resolve_model_to_route = :rails_storage_proxy

# We're taking a couple of mitigation measures to prevent SVGs becoming a XSS vector - specifically, we're
# sanitizing uploaded SVGs via SanitizeSvgJob and serving uploads from a different URL.  Additionally, the
# only way for Markdown input to embed an upload results in it being rendered as an <img> tag, which renders
# with restrictions according to https://www.w3.org/wiki/SVG_Security.
#
# Because of all these measures, I feel OK about turning on serving SVGs.  We might go back on this at
# some point.
Rails.application.config.after_initialize { ActiveStorage.content_types_to_serve_as_binary.delete("image/svg+xml") }

ActiveSupport.on_load(:active_storage_blob) do
  after_create_commit :enqueue_svg_sanitization, if: -> { filename.extension == "svg" }

  def enqueue_svg_sanitization
    SanitizeSvgJob.set(wait: 10.seconds).perform_later(self)
  end
end
