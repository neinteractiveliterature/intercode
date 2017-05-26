module Concerns::Names
  # Return the user's name.
  def name
    name_parts.compact.join(" ")
  end

  # Return the user's name in last, first format.
  def name_inverted
    [last_name, first_name].compact.join(", ")
  end

  def name_parts
    [first_name, last_name]
  end
end