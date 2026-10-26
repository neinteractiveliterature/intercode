# frozen_string_literal: true
class HostingServiceAdapters::Instance
  attr_reader :id, :type, :group, :created_at, :updated_at

  def initialize(type:, group:, created_at: nil, updated_at: nil)
    @type = type.to_sym
    @group = group.to_sym
    @created_at = created_at
    @updated_at = updated_at
  end

  # Whether this instance is running, or on its way to running. Instances that aren't can't serve traffic, so they
  # shouldn't count toward the number that are wanted.
  def live?
    true
  end

  # Which release of the app this instance is running; higher is newer
  def release_version
    0
  end

  # When this instance was last created, started, stopped or changed
  def last_changed_at
    [created_at, updated_at].compact.max
  end
end
