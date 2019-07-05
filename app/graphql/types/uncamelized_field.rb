class Types::UncamelizedField < Types::BaseField
  # We don't camelize fields in the Intercode API (this could change later)
  def initialize(*args, camelize: false, **kwargs, &block)
    super
  end
end
