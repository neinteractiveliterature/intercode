class HostingServiceAdapters::Base
  def applicable?
    raise NotImplementedError, "HostingServiceAdapters::Base subclasses must implement #applicable?"
  end

  def instances_state
    raise NotImplementedError, "HostingServiceAdapters::Base subclasses must implement #instances_state"
  end

  def apply_instance_counts(target_counts)
    target_groups = Set.new(target_counts.map { |target| { group: target[:group], type: target[:type] } })

    target_counts.each do |target|
      update_instance_group(group: target[:group], type: target[:type], count: target[:count])
    end

    instances_state.counts.each do |row|
      next if target_groups.include?(row.slice(:group, :type))
      update_instance_group(group: row[:group], type: row[:type], count: 0)
    end

    instances_state
  end

  def update_instance_group(group:, type:, count:)
    raise NotImplementedError, "HostingServiceAdapters::Base subclasses must implement #update_instance_group"
  end
end
