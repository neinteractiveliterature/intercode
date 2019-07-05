class Queries::NilSafeCache
  def initialize
    @values = {}
  end

  def get(key, &block)
    return @values[key] if @values.key?(key)
    @values[key] = block.call
  end
end
