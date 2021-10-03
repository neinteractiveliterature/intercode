# frozen_string_literal: true
class Queries::NilSafeCache
  def initialize
    @values = {}
  end

  def get(key)
    return @values[key] if @values.key?(key)
    @values[key] = yield
  end
end
