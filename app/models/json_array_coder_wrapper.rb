# frozen_string_literal: true
class JSONArrayCoderWrapper
  attr_reader :wrapped_coder

  def initialize(wrapped_coder)
    @wrapped_coder = wrapped_coder
  end

  def dump(array)
    array.map(&:as_json)
  end

  def load(json)
    case json
    when Array
      json.map { |item| wrapped_coder.load(item) }
    when String
      load(JSON.load(json))
    else
      json
    end
  end
end
