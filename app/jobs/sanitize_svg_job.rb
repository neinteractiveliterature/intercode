# frozen_string_literal: true
class SanitizeSvgJob < ApplicationJob
  def perform(blob)
    return unless blob.filename.extension == "svg"
    return if blob.metadata[:sanitized]

    sanitized = sanitize(blob.download)
    Tempfile.open([blob.filename.base, ".#{blob.filename.extension}"]) do |file|
      file.print sanitized
      file.rewind
      blob.upload file
    end

    blob.update!(metadata: blob.metadata.merge(sanitized: true))
  end

  private

  def sanitize(unsafe_xml)
    unsafe_xml = unsafe_xml.to_s.force_encoding("UTF-8")
    if unsafe_xml.include?("<?xml") || unsafe_xml.include?("<!DOCTYPE")
      Loofah.xml_document(unsafe_xml).scrub!(scrubber).to_s
    else
      Loofah.xml_fragment(unsafe_xml).scrub!(scrubber).to_s
    end
  end

  def scrubber
    Loofah::Scrubber.new { |node| node.remove if node.name == "script" }
  end
end
