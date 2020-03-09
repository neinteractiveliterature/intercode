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
    when Array then json.map { |item| wrapped_coder.load(item) }
    when String then load(JSON.load(json))
    else json
    end
  end
end
