Rails.application.config.active_storage.resolve_model_to_route = :rails_storage_proxy

# We're taking a couple of mitigation measures to prevent SVGs becoming a XSS vector - specifically, we're
# using active_storage_svg_sanitizer and serving uploads from a different URL.  Additionally, the only way
# for Markdown input to embed an upload results in it being rendered as an <img> tag, which renders with
# restrictions according to https://www.w3.org/wiki/SVG_Security.
#
# Because of all these measures, I feel OK about turning on serving SVGs.  We might go back on this at
# some point.
ActiveStorage::Engine.config.active_storage.content_types_to_serve_as_binary.delete 'image/svg+xml'
