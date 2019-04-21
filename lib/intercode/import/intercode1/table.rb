class Intercode::Import::Intercode1::Table < Intercode::Import::Table
  private

  def yesno_to_bool(value, default = nil)
    case value
    when 'Yes' then true
    when 'No' then false
    else
      raise "Invalid yes/no value: #{value.inspect}" if default.nil?
      default
    end
  end

  def yn_to_bool(value, default = nil)
    case value
    when 'Y' then true
    when 'N' then false
    else
      raise "Invalid y/n value: #{value.inspect}" if default.nil?
      default
    end
  end
end
