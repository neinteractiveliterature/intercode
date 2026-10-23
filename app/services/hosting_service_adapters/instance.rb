# frozen_string_literal: true
class HostingServiceAdapters::Instance
  attr_reader :id, :type, :group, :created_at

  def initialize(type:, group:, created_at: nil)
    @type = type.to_sym
    @group = group.to_sym
    @created_at = created_at
  end
end
