class HostingServiceAdapters::InstancesState
  attr_reader :instances

  def initialize(instances:)
    @instances = instances
  end

  def find_instances(group: nil, type: nil)
    instances.filter do |instance|
      (type.nil? || instance.type == type.to_sym) && (group.nil? || instance.group == group.to_sym)
    end
  end

  def counts
    instances_by_group_and_type = {}
    instances.each do |instance|
      instances_by_group_and_type[instance.group] ||= {}
      instances_by_group_and_type[instance.group][instance.type] ||= 0
      instances_by_group_and_type[instance.group][instance.type] += 1
    end

    instances_by_group_and_type.flat_map do |group, instances_by_type|
      instances_by_type.map { |type, count| { group:, type:, count: } }
    end
  end
end
