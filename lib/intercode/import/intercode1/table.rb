class Intercode::Import::Intercode1::Table < Intercode::Import::Table
  private

  def yesno_to_bool(value, default = nil)
    case value
    when 'Yes'
      true
    when 'No'
      false
    else
      raise "Invalid yes/no value: #{value.inspect}" if default.nil?
      default
    end
  end

  def yn_to_bool(value, default = nil)
    case value
    when 'Y'
      true
    when 'N'
      false
    else
      raise "Invalid y/n value: #{value.inspect}" if default.nil?
      default
    end
  end
end
