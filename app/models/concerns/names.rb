module Concerns::Names
  # Return the user's name.
  def name
    [first_name, last_name].compact.join(" ")
  end

  # Return the user's name in last, first format.
  def name_inverted
    [last_name, first_name].compact.join(", ")
  end
end