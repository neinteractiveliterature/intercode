class HostingServiceAdapters::Instance
  attr_reader :id, :type, :group

  def initialize(type:, group:)
    @type = type.to_sym
    @group = group.to_sym
  end
end
