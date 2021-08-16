class Types::FormItemWriteabilityType < Types::BaseEnum
  FormItem::WRITEABILITY_VALUES.each do |possible_value|
    value possible_value
  end
end
